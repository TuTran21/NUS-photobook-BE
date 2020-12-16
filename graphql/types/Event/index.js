import apollo from 'apollo-server';
const { gql } = apollo;

const EventType = gql`
	type EventParticipant {
		id: Int
		user: User
		isPaid: Boolean
		message: String
		note: String
		createdAt: Date
		updatedAt: Date
	}

	type Event {
		id: String
		title: String!
		image: String
		posts: [Post]
		views: Int
		author: User
		comments: [Comment]
		participants: [EventParticipant]
		fee: Int
		startDate: Date
		endDate: Date
	}

	type Query {
		event(id: String): Event
		events(offset: Int, limit: Int): [Event]!
	}

	type Mutation {
		createEvent(post: CreateEventInput): CommonResponse
		updateEvent(post: UpdateEventInput): CommonResponse
		deleteEvent(id: String!): CommonResponse
		deleteManyEvents(posts: [String]): CommonResponse
	}


	input UpdateEventInput {
		title: String!
		image: String
		fee: Int
		startDate: Date
		endDate: Date
	}

	input CreateEventInput {
		title: String!
		image: String
		fee: Int
		startDate: Date
		endDate: Date
	}

	enum MutationType {
		CREATED
		DELETED
		UPDATED
	}
`;

export default EventType;
