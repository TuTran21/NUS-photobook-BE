import mergeGraphql from "merge-graphql-schemas";
import User from "./User/index.js";
import Auth from "./Auth/index.js";
import CustomScalars from "./CustomScalars/index.js";
import Dashboard from './Dashboard/index.js'

const { mergeResolvers } = mergeGraphql;
const resolvers = [User, Auth, Dashboard, CustomScalars];

export default mergeResolvers(resolvers);
