import ApolloServer from 'apollo-server'

const {ApolloError} = ApolloServer

export const checkAdmin = (user) => {
    const userType = user.userType;
    if (userType !== "ADMIN") {
      throw new ApolloError("Only admins can perform this action", 403);
    }
}
