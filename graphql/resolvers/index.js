import mergeGraphql from "merge-graphql-schemas";
import User from "./User/index.js";
import Post from "./Post/index.js";
import Comment from "./Comment/index.js";
import Test from "./Test/index.js";
import Auth from "./Auth/index.js";
import CustomScalars from "./CustomScalars/index.js";
import Dashboard from './Dashboard/index.js'

const { mergeResolvers } = mergeGraphql;
const resolvers = [User, Post, Comment, Test, Auth, Dashboard, CustomScalars];

export default mergeResolvers(resolvers);
