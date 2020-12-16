import apollo from 'apollo-server';
const { gql } = apollo;

const TestType = gql`
	type TestDetails {
		readingTest: ReadingTest!
	}

	type RatingVotes {
		owner: String
		star: Float
	}

	type Rating {
		starAmount: Float
		voteAmount: Int
		votes: [RatingVotes]
	}

	type TestCompetition {
		isCompetition: Boolean
		attemptAmount: Int
		event: Event
	}

	type Test {
		id: String!
		title: String!
		image: String
		publishDate: Date
		author: User
		rating: Rating
		views: Int
		testsTaken: Int
		createdAt: String
		testDetails: TestDetails!
		competition: TestCompetition
	}

	type Query {
		test(id: String): Test
		tests(offset: Int, limit: Int): [Test!]!
	}

	type Mutation {
		createTest(test: CreateTestInput): CommonResponse!
		updateTest(id: String!, user: UpdateTestInput!): Test!
		deleteTest(id: String!): CommonResponse
		deleteManyTests(tests: [String]): CommonResponse
		rateTest(id: String, star: Float): CommonResponse
	}

	input CreateTestInput {
		title: String!
		author: String
		views: Int
		image: String
		publishDate: Date
		testDetails: TestDetailsInput!
	}

	input TestDetailsInput {
		readingTest: ReadingTestInput
	}

	input UpdateTestInput {
		title: String!
		author: String
		testDetails: TestDetailsInput!
	}
`;

export default TestType;
