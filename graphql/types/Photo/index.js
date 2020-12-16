import apollo from "apollo-server";
const { gql } = apollo;

const PhotoType = gql`
  type Dates {
    isPublished: String
    updated: String
  }

  type Image {
    url: String
  }

  type PostContent {
    html: String
    text: String
  }

  type Photo {
    id: String
    title: String!
    image: Image
    isPublic: Boolean
    user: User
    createdAt: Date
    views: Int
    likes: [User]
  }

  type Query {
    post(id: String): Post
    posts(offset: Int, limit: Int): [Post]!
  }

  type Mutation {
    createPost(post: CreatePostInput): CommonResponse
    updatePost(post: UpdatePostInput): CommonResponse
    deletePost(id: String!): CommonResponse
    deleteManyPosts(posts: [String]): CommonResponse
  }

  type Subscription {
    post: PostSubscriptionPayload!
  }

  type PostSubscriptionPayload {
    mutation: MutationType!
    post: Post!
  }

  
  input PostContentInput {
    html: String
    text: String
  }

  input DatesInput {
    published: String
    updated: String
  }

  input CreatePostInput {
    title: String!
    image: String
    content: PostContentInput!
    isPublished: Boolean!
  }

  input UpdatePostInput {
    id: String
    image: String
    title: String!
    content: PostContentInput!
    isPublished: Boolean!
  }

  enum MutationType {
    CREATED
    DELETED
    UPDATED
  }
`;

export default PhotoType;
