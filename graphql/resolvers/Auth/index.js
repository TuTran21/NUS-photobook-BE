import User from "../../../mongoose/models/User/index.js";
import bcrypt from "bcrypt";
import {
  jwtSign,
  jwtVerify,
  checkTokenForUserId,
} from "../../../utils/utils.js";

export default {
  Query: {
    login: async (parent, { email, password }) => {
      try {
        let user = await User.findOne({ email });
        if (!user) {
          throw new Error("User does not exist");
        }

        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
          throw new Error("Password is incorrect");
        }

        user.lastLogin = Date.now();
        user.save();
        const token = jwtSign({
          userId: user._id.toString(),
          userType: user.userType,
        });

        return {
          userId: user._id.toString(),
          accessToken: token,
          tokenExpiration: process.env.JWT_EXPIRATION_TIME,
          activeUser: {
            avatar: user.avatar,
            username: user.username,
            firstName: user.firstname,
            lastName: user.lastName,
            userType: user.userType,
          },
        };
      } catch (err) {
        throw err;
      }
    },

    verifyAccessToken: async (parent, args, context, info) => {
      try {
        const token = context.req.headers.xtoken;
        const userId = await checkTokenForUserId(token);
        const user = await User.findById(userId);
        if (!user) {
          throw Error("User not found.");
        }
        user.lastLogin = Date.now();
        user.save();
        return {
          userId: user._id.toString(),
          accessToken: token,
          tokenExpiration: process.env.JWT_EXPIRATION_TIME,
          activeUser: {
            avatar: user.avatar,
            username: user.username,
            firstName: user.firstname,
            lastName: user.lastName,
          },
        };
      } catch (err) {
        throw err;
      }
    },
  },
};
