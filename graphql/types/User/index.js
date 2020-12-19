import apollo from "apollo-server";
const { gql } = apollo;

const UserType = gql`
  type CommonResponse {
    status: Int
    message: String
  }

  type LikeReaction {
    amount: Int
  }

  type SocialReactions {
    likes: LikeReaction
  }

  type SocialPost {
    owner: User
    content: String
    reaction: SocialReactions
    createdAt: Date
  }

  type SocialWall {
    posts: [SocialPost]
  }

  type RpgElement {
    experience: Int
    title: String
    level: Int
  }

  type UserSocialProfile {
    id: ID
    rpg: RpgElement
    wall: SocialWall
  }

  type User {
    _id: String
    id: String
    username: String
    email: String!
    firstName: String
    lastName: String
    isVerified: Boolean
    userType: String
    phone: String
    password: String
    avatar: String
    comments: [Comment!]
    socialProfile: UserSocialProfile
    createdAt: Date
    updatedAt: Date
    isDeleted: Boolean
    lastLogin: Date
  }

  type GetMyProfile {
    userId: String
  }

  type OverallScore {
    reading: Float
    listening: Float
    writing: Float
  }

  type UserProfileRes {
    user: User
    isOwner: Boolean
  }

  type Query {
    user(id: String): UserProfileRes
    users: [User!]!
    getMyProfile: GetMyProfile
    getOverallScore(userId: String): OverallScore
    getRpgElement(userId: String): RpgElement
    getWallPosts(userId: String): SocialWall
  }

  type Mutation {
    createUser(user: CreateUserInput): CommonResponse
    updateUser(user: UpdateUserInput): CommonResponse
    deleteUser(id: String!): User!
    uploadAvatar(file: String): CommonResponse
    postComment(content: String, id: String): CommonResponse
    verifyEmail(emailToken: String): CommonResponse
    adminUpdateUser(user: AdminUpdateUserInput): CommonResponse
    adminCreateUser(user: AdminCreateUserInput): CommonResponse
    deleteManyUsers(users: [String]): CommonResponse
  }

  input CreateUserInput {
    username: String!
    email: String!
    firstName: String
    lastName: String
    phone: String
    password: String
  }

  input UpdateUserInput {
    username: String!
    avatar: String
    email: String!
    firstName: String
    lastName: String
    phone: String
    password: String
  }

  input AdminCreateUserInput {
    username: String!
    email: String!
    firstName: String
    lastName: String
    isVerified: Boolean
    phone: String
    password: String
    userType: String
  }

  input AdminUpdateUserInput {
    id: String
    username: String!
    email: String!
    firstName: String
    lastName: String
    isVerified: Boolean
    password: String
    userType: String
  }
`;

export default UserType;
