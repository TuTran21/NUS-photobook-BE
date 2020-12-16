import dotenv from "dotenv";
import schema from "./graphql/index.js";
import { models } from "./mongoose/config/db/index.js";
import connectDB from "./mongoose/index.js";
import apollo from "apollo-server";
import { cloudinaryConfig } from "./utils/cloudinaryConfigs.js";
const { ApolloServer } = apollo;
// const pubsub = new PubSub();
dotenv.config();
const options = {
  port: process.env.PORT || "5000",
  endpoint: "/graphql",
  subscriptions: "/subscriptions",
  playground: "/playground",
  cors: {
    credentials: true,
    origin: [
      process.env.FRONTEND_URL
        ? process.env.FRONTEND_URL
        : "http://localhost:3000",
    ], // your frontend url.
  },
};

// const context = {
// 	models,
// 	pubsub,
// };

const context = {
  models,
};

// Connect to MongoDB with Mongoose.
connectDB();

const server = new ApolloServer({
  typeDefs: schema.typeDefs,
  resolvers: schema.resolvers,
  context(request) {
    return { ...context, ...request };
  },
});

// const server = new GraphQLServer({
//   schema,
//   context(request) {
//     return { ...context, ...request };
//   },
// });

cloudinaryConfig();

server.listen(options).then(({ url }) => {
  console.log(`🚀 Server is running on ${url}`);
});
// server.start(options, ({ port }) => {
// 	console.log(`🚀 Server is running on http://localhost:${port}`);
// });
