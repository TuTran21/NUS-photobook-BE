export default {
  MONGO_URI: process.env.MONGO_URI
    ? process.env.MONGO_URI
    : "mongodb+srv://ESCer-TuTran:tranminhtu@esc-cloud-jofyv.mongodb.net/test?retryWrites=true&w=majority",
  MONGO_URI_TEST: process.env.MONGO_URI_TEST
    ? process.env.MONGO_URI_TEST
    : "EXAMPLE",
  JWT_SECRET: process.env.JWT_SECRET ? process.env.JWT_SECRET : "nxtftw",
  JWT_EXPIRATION_TIME: process.env.JWT_EXPIRATION_TIME
    ? process.env.JWT_EXPIRATION_TIME
    : "15m",
};
