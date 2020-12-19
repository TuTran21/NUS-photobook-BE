import mergeGraphql from "merge-graphql-schemas";
import User from "./User/index.js";
import Auth from "./Auth/index.js";
import CustomScalars from "./CustomScalars/index.js";
import Dashboard from "./Dashboard/index.js";
import Photo from "./Photo/index.js";

const { mergeResolvers } = mergeGraphql;
const resolvers = [User, Auth, Dashboard, Photo, CustomScalars];

export default mergeResolvers(resolvers);
