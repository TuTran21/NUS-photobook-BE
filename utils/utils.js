
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const jwtVerify = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const jwtSign = (value, expireIn = process.env.JWT_EXPIRATION_TIME) => {
  console.log(process.env.JWT_EXPIRATION_TIME);
  return jwt.sign(value, process.env.JWT_SECRET, {
    expiresIn: expireIn,
  });
};

export const bcryptHash = async (value) => {
  const salt = await bcrypt.genSaltSync(parseInt(process.env.HASH_COST));
  const hashedValue = await bcrypt.hashSync(value, salt);
  return hashedValue;
};

export const roleAuthentication = async (token) => {};

export const checkTokenForUserId = async (token) => {
  if (!token) {
    throw Error("Bad request, no token found.");
  }
  const tokenVerify = jwtVerify(token);
  if (!tokenVerify) {
    throw Error("Your session has expired, please login again.");
  }
  const userId = tokenVerify.userId;
  return userId;
};

export const decryptUserToken = async (token) => {
  if (!token) {
    throw Error("Bad request, no token found.");
  }
  const tokenVerify = jwtVerify(token);
  if (!tokenVerify) {
    throw Error("Your session has expired, please login again.");
  }
  return tokenVerify;
};

export const checkTokenForEmail = async (token) => {
  if (!token) {
    throw Error("Bad request, no token found.");
  }
  const tokenVerify = jwtVerify(token);
  if (!tokenVerify) {
    throw Error("Your token has expired.");
  }
  const email = tokenVerify.email;
  return email;
};
