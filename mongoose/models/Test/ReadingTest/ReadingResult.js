import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ReadingTestResult = new Schema(
  {
    id: Schema.Types.ObjectId,
    test: {
      type: Schema.Types.ObjectId,
      ref: "Test",
    },
    readingTest: {
      type: Schema.Types.ObjectId,
      ref: "ReadingTest",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    result: {
      correctAnswers: Number,
      totalQuestions: Number,
      scoreBand: Number,
      timeSpent: String,
      answers: {},
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const ModelReadingTestResult = mongoose.model(
  "ReadingTestResult",
  ReadingTestResult
);
// export default ModelReadingTestResult;
export default ModelReadingTestResult;
