import apollo from "apollo-server";
const { gql } = apollo;

const ReadingTestType = gql`
  type Paragraph {
    content: String!
  }

  type Question {
    content: String
    key: String
    multipleChoices: [String]
  }

  type QuestionSection {
    instruction: String
    questionType: String
    options: [String]
    questions: [Question]
  }

  type ReadingPassage {
    id: String
    title: String
    image: String
    questionSections: [QuestionSection]
    paragraphs: [Paragraph]
  }

  type ReadingTestDetails {
    id: String!
    createdAt: String
    passages: [ReadingPassage]
  }

  type ReadingTest {
    id: String!
    title: String
    author: String
    testDetails: ReadingTestDetails
  }

  type TestResult {
    correctAnswers: Int
    totalQuestions: Int
    scoreBand: Float
    timeSpent: Int
  }

  type SubmitAnswerRes {
    resultId: String
  }

  type ReadingResult {
    test: Test
    result: TestResult
    user: User
  }

  type Query {
    readingTest(id: ID!): ReadingTest!
    readingTests: [ReadingTest!]!
    getReadingResult(resultId: String): ReadingResult
    getReadingLeaderboardByResultId(
      orderBy: String
      offset: Int
      limit: Int
      resultId: String
    ): [ReadingResult]
    getReadingLeaderboardByTestId(
      orderBy: String
      offset: Int
      limit: Int
      testId: String
    ): [ReadingResult]
  }

  type Mutation {
    submitReadingAnswer(
      testId: String
      answers: ReadingAnswerInput
      timeSpent: Int
    ): SubmitAnswerRes
  }

  input ReadingAnswerInput {
    id: Int
    value: String
  }

  input ReadingAnswerSectionInput {
    id: Int
    answers: [ReadingAnswerInput]
  }

  input ReadingAnswerPassageInput {
    id: Int
    sections: [ReadingAnswerSectionInput]
  }

  input ReadingAnswerInput {
    passages: [ReadingAnswerPassageInput]
  }

  input ParagraphInput {
    content: String
  }

  input ReadingPassageInput {
    title: String
    image: String
    paragraphs: [ParagraphInput]
    questionSections: [QuestionSectionInput]
  }

  input QuestionInput {
    content: String
    multipleChoices: [String]
    key: String
  }

  input QuestionSectionInput {
    instruction: String
    questionType: String
    options: [String]
    questions: [QuestionInput]
  }

  input ReadingTestDetailsInput {
    passages: [ReadingPassageInput]
  }

  input ReadingTestInput {
    title: String
    author: String
    testDetails: ReadingTestDetailsInput
  }
`;

export default ReadingTestType;
