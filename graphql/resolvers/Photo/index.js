import User from "../../../mongoose/models/User/index.js";
import Post from "../../../mongoose/models/Blog/Post.js";
import Comment from "../../../mongoose/models/Blog/Comment.js";
import {
  jwtSign,
  bcryptHash,
  jwtVerify,
  checkTokenForUserId,
  checkTokenForEmail,
  decryptUserToken,
} from "../../../utils/utils.js";
import ModelReadingTestResult from "../../../mongoose/models/Test/ReadingTest/ReadingResult.js";
import fs from "fs";
import cloudinaryUtils from "../../../utils/cloudinary.js";

import Photo from "../../../mongoose/models/Photo/index.js";
import SocialProfile from "../../../mongoose/models/User/SocialProfile/index.js";
import SocialPost from "../../../mongoose/models/User/SocialPost/index.js";
import mailService from "../../../utils/mailService.js";
import ApolloServer from 'apollo-server'
import {checkAdmin} from "../../../utils/authorization.js";

const {ApolloError} = ApolloServer

export default {
  Query: {
    photo: async (parent, { id }, context, info) => {
      const photo = await Photo.findById(id).exec();
      const token = context.req.headers.xtoken;
      const userId = await checkTokenForUserId(token);
      const user = await User.findById(userId);

      if (!user) {
        throw ApolloError("User not found.", 403);
      }

      return photo
    },

    photos: async (parent, args, { offset = 0, limit = 10, sort =[['createdAt']]}, info) => {
      const photos = await Photo.find({}).populate().skip(offset)
      .limit(limit).sort(sort).exec();

      return photos
    },
  },
  Mutation: {
    uploadAvatar: async (parent, { photo }, context, info) => {
      try {
        const token = context.req.headers.xtoken;
        const userId = await checkTokenForUserId(token);
        const file = photo.file
        const avatar = await cloudinaryUtils.userAvatarUpload(file, userId);
        const avatarUrl = avatar.url;
        const user = await User.findById(userId);
        user.avatar = avatarUrl;
        user.save();
        return {
          status: 200,
          message: "Success",
        };
      } catch (err) {
        return err;
      }
    },
    adminCreateUser: async (parent, { user }, context, info) => {
      try {
        const findUserByEmail = await User.findOne({ email: user.email });

        if (findUserByEmail) {
          throw new Error("Email already exists");
        }

        const findUserByUsername = await User.findOne({
          username: user.username,
        });

        if (findUserByUsername) {
          throw new Error("Username already taken");
        }

        const newUser = await new User({
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          isVerified: user.isVerified,
          userType: user.userType,
          password: await bcryptHash(user.password),
          avatar: "",
        });
        const newSocialProfile = await new SocialProfile({
          owner: newUser,
        });
        newUser.socialProfile = newSocialProfile;
        await newUser.save();
        await newSocialProfile.save();
        const emailToken = await jwtSign({ email: newUser.email });
        await mailService.sendConfirmMail(newUser.email, emailToken);

        return {
          status: 200,
          message: "Success",
        };
      } catch (err) {
        console.log(err)
        return err;
      }
    },
    adminUpdateUser: async (parent, { user }, context, info) => {
      try {
        let isUsernameExist = false
        let isEmailExist = false
        const token = context.req.headers.xtoken;
        const admin = await decryptUserToken(token);
        const findAdmin = await User.findById(admin.userId);
        const userType = findAdmin.userType;
        // Check if user wants to edit exists
        let updateUser = await User.findById(user.id);
        if (!updateUser){
          throw new ApolloError("User not found");
        }
        if (userType !== "ADMIN") {
          throw new ApolloError("Only admins can perform this action", 403);
        }

         // Check if email exists
         const findUserByEmail = await User.findOne({email: user.email})

         if (findUserByEmail && findUserByEmail._id != user.id){
          isEmailExist = true
         }
 
         if (isEmailExist) {
           throw new ApolloError("Email already exists");
         }

        // Check if username exists
        const findUserByUsername = await User.findOne({username: user.username})

        if (findUserByUsername && findUserByUsername._id != user.id){
          isUsernameExist = true
        }

        if (isUsernameExist) {
          throw new ApolloError("Username already exists");
        }

        // Check if email exists
        updateUser.username = user.username
        updateUser.email = user.email
        updateUser.firstName = user.firstName
        updateUser.lastName = user.lastName
        updateUser.isVerified = user.isVerified
        updateUser.userType = user.userType

        await updateUser.save();
        return {
          status: 200,
          message: "Success",
        };
      } catch (err) {
        return err;
      }
    },
    updateUser: async (parent, { user }, context, info) => {
      const token = context.req.headers.xtoken;
      const userId = await checkTokenForUserId(token);
      for (let prop in user) if (!user[prop]) delete user[prop];
      let newUser = { ...user };

      if (user.password) {
        newUser.password = await bcryptHash(user.password);
      }

      return new Promise((resolve, reject) => {
        User.findByIdAndUpdate(
          userId,
          { $set: { ...newUser } },
          { new: true }
        ).exec((err, res) => {
          err ? reject(err) : resolve(res);
        });
      });
    },
    deleteUser: async (parent, { id }, context, info) => {
      try{
        const token = context.req.headers.xtoken;
        const userId = await checkTokenForUserId(token);
        const user = await User.findById(userId);
        if (!user) {
          throw Error("User not found.");
        }
        checkAdmin(user)
        const targetUser = await User.findById(id);
        targetUser.isDeleted = true;
        targetUser.save()
      } catch (err) {
        return err
      }
    },
    deleteManyUsers: async (parent, { users }, context, info) => {
      try{
        const token = context.req.headers.xtoken;
        const userId = await checkTokenForUserId(token);
        const user = await User.findById(userId);
        if (!user) {
          throw Error("User not found.");
        }
        checkAdmin(user)
       
        const targetUsers = await  User.find().where('_id').in(users).exec();
        targetUsers.map((user) => {
          user.isDeleted = true;
          user.save()
        })
      } catch (err) {
        return err
      }
    },
    uploadAvatar: async (parent, { file }, context, info) => {
      try {
        const token = context.req.headers.xtoken;
        const userId = await checkTokenForUserId(token);
        const avatar = await cloudinaryUtils.userAvatarUpload(file, userId);
        const avatarUrl = avatar.url;
        const user = await User.findById(userId);
        user.avatar = avatarUrl;
        user.save();
        return {
          status: 200,
          message: "Success",
        };
      } catch (err) {
        return err;
      }
    },
    postComment: async (parent, { content, id }, context, info) => {
      try {
        const token = context.req.headers.xtoken;

        if (!userId) {
          var userId = await checkTokenForUserId(token);
        }
        
        const user = await User.findById(userId);
        const newSocialPost = await new SocialPost({
          owner: user,
          content: content,
        });
        const userSocialProfile = await SocialProfile.findOne({ owner: id });
        userSocialProfile.wall.posts.push(newSocialPost);

        await userSocialProfile.save();
        await newSocialPost.save();
        return {
          status: 200,
          message: "Success",
        };
      } catch (err) {
        return err;
      }
    },
    verifyEmail: async (parent, { emailToken }, context, info) => {
      try {
        const email = await checkTokenForEmail(emailToken);
        const user = await User.findOne({ email: email });
        if (!user) {
          throw Error("No user found");
        }
        user.isVerified = true;
        await user.save();
        return {
          status: 200,
          message: "Success",
        };
      } catch (err) {
        return err;
      }
    },
  },
  User: {
    posts: async ({ id }, args, context, info) => {
      return await Post.find({ author: id });
    },
    comments: async ({ id }, args, context, info) => {
      return await Comment.find({ author: id });
    },
  },
};
