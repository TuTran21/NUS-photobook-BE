import mergeGraphql from "merge-graphql-schemas";

import User from "./User/index.js";
import Comment from "./Comment/index.js";
import Photo from "./Photo/index.js";
import Dashboard from "./Dashboard/index.js";
import Auth from "./Auth/index.js";
import CustomScalars from "./CustomScalars/index.js";

const typeDefs = [User, Comment, Auth, Dashboard, Photo, CustomScalars];
const { mergeTypes } = mergeGraphql;

// NOTE: 2nd param is optional, and defaults to false
// Only use if you have defined the same type multiple times in
// different files and wish to attempt merging them together.
export default mergeTypes(typeDefs, { all: true });
