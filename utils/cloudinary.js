import cloudinary from "cloudinary";

const userAvatarUpload = (image, userId) => {
  return cloudinary.v2.uploader.upload(
    image,
    {
      overwrite: true,
      invalidate: true,
      public_id: `fotobook/userAvatars/${userId}`,
    },
    function (error, result) {
      if (result) {
        return result;
      }
      return error;
    }
  );
};

const photoUpload = (image, userId) => {
  return cloudinary.v2.uploader.upload(
    image,
    {
      overwrite: true,
      invalidate: true,
      public_id: `fotobook/${userId}/photos`,
    },
    function (error, result) {
      if (result) {
        return result;
      }
      return error;
    }
  );
};

const cloudinaryUtils = {
  userAvatarUpload,
  photoUpload,
};

export default cloudinaryUtils;
