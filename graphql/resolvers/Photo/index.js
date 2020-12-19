import User from "../../../mongoose/models/User/index.js";
import {
  jwtSign,
  bcryptHash,
  jwtVerify,
  checkTokenForUserId,
  checkTokenForEmail,
  decryptUserToken,
} from "../../../utils/utils.js";
import cloudinaryUtils from "../../../utils/cloudinary.js";

import Photo from "../../../mongoose/models/Photo/index.js";
import mailService from "../../../utils/mailService.js";
import ApolloServer from "apollo-server";
import { checkAdmin } from "../../../utils/authorization.js";

const { ApolloError } = ApolloServer;

export default {
  Query: {
    photo: async (parent, { id }, context, info) => {
      const photo = await Photo.findById(id).exec();
      return photo;
    },

    photos: async (
      parent,
      args,
      {
        offset = 0,
        limit = 10,
        sort = [["createdAt"]],
        isPublic = true,
        isOwner = false,
      },
      info
    ) => {
      let queryCondition = { isPublic: isPublic };
      if (isOwner) {
        const token = context.req.headers.xtoken;
        const userId = await checkTokenForUserId(token);
        const owner = User.findById(userId);
        queryCondition.user = owner;
        queryCondition.isPublic = undefined;
      }
      const photos = await Photo.find(queryCondition)
        .populate("user")
        .skip(offset)
        .limit(limit)
        .sort(sort)
        .exec();

      return photos;
    },
  },
  Mutation: {
    createPhoto: async (parent, { photo }, context, info) => {
      try {
        const { title, description, image, isPublic } = photo;
        const token = context.req.headers.xtoken;
        const userId = await checkTokenForUserId(token);
        const owner = User.findById(userId);

        if (!owner) {
          throw ApolloError("User not found.", 403);
        }
        const file = image;
        const photoUpload = await cloudinaryUtils.photoUpload(file, userId);
        const photoUrl = photoUpload.url;
        const newPhoto = await new Photo({
          title: title,
          description: description,
          isPublic: isPublic,
          image: {
            url: photoUrl,
          },
          user: userId,
        });
        newPhoto.save();
        return {
          status: 200,
          message: "Success",
        };
      } catch (err) {
        return err;
      }
    },
    updatePhoto: async (parent, { photo }, context, info) => {
      const token = context.req.headers.xtoken;
      const userId = await checkTokenForUserId(token);
      let newPhoto = { ...photo };
      const photoUpload = await cloudinaryUtils.photoUpload(file, userId);
      const photoUrl = photoUpload.url;
      newPhoto.image.url = photoUrl;

      await Photo.findByIdAndUpdate(
        photo.id,
        { $set: { ...newPhoto } },
        { new: true }
      );
      return {
        status: 200,
        message: "Success",
      };
    },
    deletePhoto: async (parent, { id }, context, info) => {
      try {
        const token = context.req.headers.xtoken;
        const userId = await checkTokenForUserId(token);
        const user = await User.findById(userId);
        if (!user) {
          throw ApolloError("User not found.");
        }
        // checkAdmin(user);
        await Photo.deleteOne({ _id: id });
        return {
          status: 200,
          message: "Success",
        };
      } catch (err) {
        return err;
      }
    },
    deleteManyPhotos: async (parent, { photos }, context, info) => {
      try {
        const token = context.req.headers.xtoken;
        const userId = await checkTokenForUserId(token);
        const user = await User.findById(userId);
        if (!user) {
          throw ApolloError("User not found.");
        }
        checkAdmin(user);

        await Photo.deleteMany().where("_id").in(photos).exec();
        return {
          status: 200,
          message: "Success",
        };
      } catch (err) {
        return err;
      }
    },
  },
};
