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
      let isOwner = false
      let photo = await Photo.findById(id).exec();
      const token = context.req.headers.xtoken;
      if (token) {
        const tokenVerify = jwtVerify(token);
        const userId = tokenVerify.userId;  
        if (photo.user._id.toString() === userId) {
          isOwner = true
        } 
      }


      photo.isOwner = isOwner

      return photo;
    },

    photos: async (
      parent,
      {
        offset = 0,
        limit = 10,
        sort = [["createdAt"]],
        isPublic = true,
        isOwner = false,
      },
      context,
      info
    ) => {

      if (isOwner) {
        const token = context.req.headers.xtoken;
        const userId = await checkTokenForUserId(token);
        const photos = await Photo.find({user: userId}).populate("user")
        .skip(offset)
        .limit(limit)
        .sort(sort)
        .exec();

      return photos;
      }

      const photos = await Photo.find({isPublic: isPublic})
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
      try{
      const { image } = photo;
      const token = context.req.headers.xtoken;
      const userId = await checkTokenForUserId(token);
      let findPhoto = await Photo.findById(photo.id)

      if (findPhoto.user._id.toString() !== userId) {
        throw ApolloError("Unauthorized, not owner.", 403);
      }

      if (!findPhoto) {
        throw ApolloError("Photo not found.", 404);
      }


      const file = image.url;
      const photoUpload = await cloudinaryUtils.photoUpload(file, userId);
      const photoUrl = photoUpload.url;
      findPhoto = {...photo}
      findPhoto.image.url = photoUrl
      findPhoto.save()
      return {
        status: 200,
        message: "Success",
      };
    }catch(err){
      return err
    }
    }
    ,
    deletePhoto: async (parent, { id }, context, info) => {
      try {
        const token = context.req.headers.xtoken;
        const userId = await checkTokenForUserId(token);
        const findPhoto = await Photo.findById(id)

        if (findPhoto.user._id.toString() !== userId) {
          throw ApolloError("Unauthorized, not owner.", 403);
        }
        
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
