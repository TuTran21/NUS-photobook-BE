import apollo from "apollo-server";
const { gql } = apollo;

const CustomScalars = gql`
  scalar Date
`;
export default CustomScalars;
