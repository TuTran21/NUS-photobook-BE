import Test from "../../../mongoose/models/Test/index.js";
import User from "../../../mongoose/models/User/index.js";
import ReadingTest from "../../../mongoose/models/Test/ReadingTest/index.js";
import ReadingResult from "../../../mongoose/models/Test/ReadingTest/ReadingResult.js";
import {
  calcReadingScore,
  jwtVerify,
  checkTokenForUserId,
  decryptUserToken,
} from "../../../utils/utils.js";
import {checkAdmin} from '../../../utils/authorization.js'
import cloudinaryUtils from "../../../utils/cloudinary.js";
import ApolloServer from 'apollo-server'

const {ApolloError} = ApolloServer
export default {
  Query: {
    test: async (parent, { id }, context, info) => {
      try {
        const test = await Test.findById(id)
          .populate({
            path: "testDetails.readingTest",
          })
          .populate("author")
          .exec();
        test.views = test.views + 1;
        test.save();
        const testsTaken = test.testDetails.readingTest.results.length;
        return {
          id: test._id.toString(),
          title: test.title,
          author: test.author,
          image: test.image,
          publishDate: test.publishDate.toString(),
          createdAt: test.createdAt.toString(),
          views: test.views,
          rating: test.rating,
          testsTaken: testsTaken,
          testDetails: test.testDetails,
        };
      } catch (err) {
        return err;
      }
    },
    tests: async (parent, { offset = 0, limit = 0 }, context, info) => {
      const tests = await Test.find({})
        .populate({
          path: "testDetails.readingTest",
        })
        .populate("author")
        .skip(offset)
        .limit(limit)
        .exec();
      if (!tests) {
        return [];
      }
      return tests.map((t) => {
        const testsTaken = t.testDetails.readingTest.results.length;
        return {
          id: t._id,
          title: t.title,
          author: t.author,
          image: t.image,
          publishDate: t.publishDate.toString(),
          createdAt: t.createdAt.toString(),
          views: t.views,
          rating: t.rating,
          testsTaken: testsTaken,
          testDetails: t.testDetails,
        };
      });
    },
    getReadingResult: async (parent, { resultId }, context, info) => {
      try {
        const findResult = await ReadingResult.findById(resultId)
          .populate("test")
          .populate("test.author")
          .populate("readingTest")
          .populate("user")
          .exec();
        const testsTaken = findResult.readingTest.results.length;
        if (!findResult) {
          throw Error("No result found.");
        }
        const test = findResult.test;
        test.testsTaken = testsTaken;
        const resTest = test;
        resTest.id = resTest._id.toString();
        return {
          test: resTest,
          user: findResult.user,
          result: findResult.result,
        };
      } catch (err) {
        return err;
      }
    },
    getReadingLeaderboardByResultId: async (
      parent,
      { orderBy = "ascending", offset = 0, limit = 10, resultId },
      context,
      info
    ) => {
      try {
        const findResult = await ReadingResult.findById(resultId)
          .populate("test")
          .exec();

        if (!findResult) {
          throw Error("No result found.");
        }
        const testId = findResult.test;
        const findResults = await ReadingResult.find({ test: testId })
          .populate("user")
          .skip(offset)
          .limit(limit)
          .sort({
            "result.scoreBand": orderBy,
            "result.timeSpent": "ascending",
          })
          .exec();
        return findResults;
      } catch (err) {
        return err;
      }
    },
    getReadingLeaderboardByTestId: async (
      parent,
      { orderBy = "ascending", offset = 0, limit = 10, testId },
      context,
      info
    ) => {
      try {
        const findResults = await ReadingResult.find({ test: testId })
          .populate("user")
          .skip(offset)
          .limit(limit)
          .sort({
            "result.scoreBand": orderBy,
            "result.timeSpent": "ascending",
          })
          .exec();
        return findResults;
      } catch (err) {
        return err;
      }
    },
  },
  Mutation: {
    createTest: async (parent, { test }, context, info) => {
      try {
        const token = context.req.headers.xtoken;
        const userId = await checkTokenForUserId(token);

        const findUser = await User.findById(userId);
        checkAdmin(findUser)
        const newReadingTest = await new ReadingTest({
          title: test.testDetails.readingTest.title,
          author: findUser._id,
          testDetails: test.testDetails.readingTest.testDetails,
        });

        await newReadingTest.save();

        const newTest = await new Test({
          title: test.title,
          publishDate: test.publishDate,
          author: findUser._id,
          testDetails: { readingTest: newReadingTest._id },
        });

        // Save test image
        if (test.image) {
          const image = await cloudinaryUtils.testImageUpload(
            test.image,
            newTest._id.toString()
          );
          const imageUrl = image.url;
          newTest.image = imageUrl;
        }

        await newTest.save();
        return { status: 200, message: "Success" };
      } catch (err) {
        return err;
      }
    },
    updateTest: async (parent, { id, test }, context, info) => {
      try {
      const token = context.req.headers.xtoken;
      const userId = await checkTokenForUserId(token);

      const findUser = await User.findById(userId);
      checkAdmin(findUser)
      return new Promise((resolve, reject) => {
        Test.findByIdAndUpdate(id, { $set: { ...test } }, { new: true }).exec(
          (err, res) => {
            err ? reject(err) : resolve(res);
          }
        );
      });
    } catch (err) {
      return err
    }
    },
    deleteTest: async (parent, { id }, context, info) => {
      try {
        const token = context.req.headers.xtoken;
        const userId = await checkTokenForUserId(token);
  
        const findUser = await User.findById(userId);
        checkAdmin(findUser)
      return new Promise((resolve, reject) => {
        Test.findByIdAndDelete(id).exec((err, res) => {
          err ? reject(err) : resolve(res);
        });
      });
    } catch(err) {
      return err
    }
    },
    
    deleteManyTests: async (parent, { tests }, context, info) => {
      try{
      const token = context.req.headers.xtoken;
      const admin = await decryptUserToken(token);
      const findAdmin = await User.findById(admin.userId);
      checkAdmin(findAdmin)

      await Test.deleteMany({
          _id: {
            $in: tests
          }
        })
      
      return {
        status: 200,
        message: "Success"
      }
    }
        
    catch(err){
      return err
    }
    },
    rateTest: async (parent, { id, star }, context, info) => {
      try {
        const token = context.req.headers.xtoken;
        const userId = await checkTokenForUserId(token);
        const findUser = await User.findById(userId);

        if (!findUser) {
          throw Error("User not found.");
        }
        const test = await Test.findById(id).populate("rating.votes.owner");
        if (!test) {
          throw Error(
            "The current test is no longer available, please select another one."
          );
        }
        const votes = test.rating.votes;
        // Find if user has voted or not
        const votedUserIndex = votes.findIndex((vote) => vote.owner._id == userId);
        // initial total rating
        let totalRating = 0;
        // If user voted, change the vote result to the new one
        if (votedUserIndex > -1) {
          votes[votedUserIndex].star = star;
        }
        // If the user never voted before, we push new one and save it
        if (votedUserIndex === -1) {
          const newRating = { owner: findUser._id, star: star };
          // Save new results
          votes.push(newRating);
        }
        // Calculate the total rating after the change
        votes.forEach((vote) => {
          totalRating = vote.star + totalRating;
        });
        totalRating = totalRating / (votes.length > 0 ? votes.length : 1);

        test.rating.starAmount = totalRating;
        test.rating.voteAmount = test.rating.votes.length;
        test.rating.votes = votes;
        test.save();

        return { status: 200, message: "Success" };
      } catch (err) {
        return err;
      }
    },
    submitReadingAnswer: async (
      parent,
      { testId, answers, timeSpent },
      context,
      info
    ) => {
      try {
        const token = context.req.headers.xtoken;
        const userId = await checkTokenForUserId(token);

        const findUser = await User.findById(userId);

        if (!findUser) {
          throw Error("User not found.");
        }

        const test = await Test.findById(testId)
          .populate({
            path: "testDetails.readingTest",
          })
          .exec();

        if (!test) {
          throw Error(
            "The current test is no longer available, please select another one."
          );
        }

        const findReadingTest = await ReadingTest.findById(
          test.testDetails.readingTest._id
        );

        if (!findReadingTest) {
          throw Error("No reading test found.");
        }
        // TOTAL AMOUNT OF QUESTIONS
        let totalQuestions = 0;
        findReadingTest.testDetails.passages.forEach((passage) => {
          passage.questionSections.forEach((section) => {
            section.questions.forEach((question) => {
              totalQuestions = totalQuestions + 1;
            });
          });
        });
        // CALCULATE SCORE
        const questionSections = test.testDetails.readingTest.testDetails;
        const readingAnswers = answers;
        let correctAnswers = 0;
        readingAnswers.passages.map((passage) => {
          const passageId = passage.id;
          const testPassage = questionSections.passages[passageId];
          passage.sections.map((section) => {
            const sectionId = section.id;
            const testSection = testPassage.questionSections[sectionId];
            section.answers.map((answer) => {
              const answerId = answer.id;
              const answerKey = testSection.questions[answerId].key;
              if (answerKey.toUpperCase() === answer.value.toUpperCase()) {
                correctAnswers = correctAnswers + 1;
              }
            });
          });
        });
        const scoreBand = calcReadingScore(correctAnswers);
        // Save new result
        const newResult = await new ReadingResult({
          test: test._id,
          readingTest: findReadingTest._id,
          user: findUser._id,
          result: {
            correctAnswers: correctAnswers,
            totalQuestions: totalQuestions,
            scoreBand: scoreBand,
            timeSpent: timeSpent,
            answers: readingAnswers,
          },
        });
        await newResult.save();
        // Save result into user
        await findUser.testResults.reading.push(newResult);
        await findUser.save();
        // Save new result into test
        await findReadingTest.results.push(newResult);
        await findReadingTest.save();
        return {
          resultId: newResult._id.toString(),
        };
      } catch (err) {
        return err;
      }
    },
  },
};
