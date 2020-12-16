import mongoose from "mongoose";

const Schema = mongoose.Schema;

// const Paragraph = new Schema({
//   id: Schema.Types.ObjectId,
//   content: String,
// });

// const ReadingPassage = new Schema({
//   id: Schema.Types.ObjectId,
//   title: String,
//   paragraph: [Paragraph],
// });

// const ReadingTestDetails = new Schema({
//   id: Schema.Types.ObjectId,
//   passages: [ReadingPassage],
// });

const ReadingTest = new Schema(
  {
    id: Schema.Types.ObjectId,
    title: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // author: String,
    testDetails: {
      passages: [
        {
          title: String,
          image: String,
          paragraphs: [{ content: String }],
          questionSections: [
            {
              instruction: String,
              questionType: String,
              options: [],
              questions: [
                {
                  content: String,
                  multipleChoices: [String],
                  key: String,
                },
              ],
            },
          ],
        },
      ],
    },
    results: [
      {
        type: Schema.Types.ObjectId,
        ref: "ReadingTestResult",
        default: null,
      },
    ],
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const ModelReadingTest = mongoose.model("ReadingTest", ReadingTest);
export default ModelReadingTest;
// export default ModelReadingTest;
