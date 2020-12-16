import graphql from "graphql";
const { GraphQLScalarType } = graphql;

const CustomScalarResolvers = {
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue(value) {
      return value; // value from the client
    },
    serialize(value) {
      const resValue = value.toString();
      return resValue; // value sent to the client
    },
  }),
  ID: new GraphQLScalarType({
    name: "ID",
    description: "ID custom scalar type",
    parseValue(value) {
      return value; // value from the client
    },
    serialize(value) {
      const resValue = value.toString();
      return resValue; // value sent to the client
    },
  }),
};

export default CustomScalarResolvers;
