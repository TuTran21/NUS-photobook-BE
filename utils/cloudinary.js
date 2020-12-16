import cloudinary from 'cloudinary';

const userAvatarUpload = (image, userId) => {
	return cloudinary.v2.uploader.upload(
		image,
		{
			overwrite: true,
			invalidate: true,
			public_id: `onlineExam/userAvatars/${userId}`,
		},
		function (error, result) {
			if (result) {
				return result;
			}
			return error;
		},
	);
};

const testImageUpload = (image, userId) => {
	return cloudinary.v2.uploader.upload(
		image,
		{
			overwrite: true,
			invalidate: true,
			public_id: `onlineExam/tests/images/${userId}`,
		},
		function (error, result) {
			if (result) {
				return result;
			}
			return error;
		},
	);
};

const cloudinaryUtils = {
	userAvatarUpload,
	testImageUpload,
};

export default cloudinaryUtils;
