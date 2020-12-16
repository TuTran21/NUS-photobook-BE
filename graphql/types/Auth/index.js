import apollo from "apollo-server";
const { gql } = apollo;

const AuthType = gql`
  type ActiveUserAuth {
    avatar: String
    firstName: String
    lastName: String
    username: String
    userType: String
  }

  type AuthData {
    userId: ID!
    accessToken: String!
    tokenExpiration: String!
    activeUser: ActiveUserAuth
  }

  type Query {
    login(email: String, password: String): AuthData!
    verifyAccessToken: AuthData!
  }
`;
export default AuthType;
