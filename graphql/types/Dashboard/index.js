import apollo from "apollo-server";
const { gql } = apollo;

const DashboardType = gql`
  type AuthData {
    userId: ID!
    accessToken: String!
    tokenExpiration: String!
    activeUser: ActiveUserAuth
  }

  type Query {
    verifyAdminAccessToken: AuthData
  }
`;
export default DashboardType;
