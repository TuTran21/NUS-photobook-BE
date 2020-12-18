import mongoose from 'mongoose';
import mongodb from 'mongodb';
const { ObjectID } = mongodb;

const Schema = mongoose.Schema;
const UserTypeEnum = ['USER', 'ADMIN'];

ObjectID.prototype.valueOf = function () {
	return this.toString();
};

const UserSchema = new Schema(
	{
		id: Schema.Types.ObjectId,
		userType: {
			type: String,
			enum: UserTypeEnum,
			default: 'USER',
			uppercase: true,
		},
		username: {
			type: String,
			index: true,
			required: true,
			unique: true,
			trim: true,
		},
		email: {
			type: String,
			match: /^\S+@\S+\.\S+$/,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		isVerified: {
			type: Boolean,
			required: false,
			default: false,
		},
		password: {
			type: String,
			required: true,
		},
		firstName: {
			type: String,
			required: false, //TODO: Turn this to true
		},
		lastName: {
			type: String,
			required: false, //TODO: Turn this to true
		},
		phone: {
			type: String,
			required: false, //TODO: Turn this to true
		},
		services: {
			facebook: String,
			google: String,
		},
		// role: {
		//   type: String,
		//   required: true,
		//   trim: true,
		//   enum: rolesEnum,
		//   default: "user",
		// },
		avatar: {
			type: String,
			trim: true,
		},
		isActive: {
			type: Boolean,
			required: true,
			default: false,
		},
		isDeleted: {
		  type: Boolean,
		  default: false,
		},
		socialProfile: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'UserSocialProfile',
			default: null,
		},
		testResults: {
			reading: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: 'ReadingTestResult',
					default: null,
				},
			],
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: false, //TODO: Turn this to true
		},
		lastModifiedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: false, //TODO: Turn this to true
		},
		lastLogin: {
			type: Date,
			default: Date.now,
		},
		defaultTenant: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Tenant',
			default: null,
		},
	},
	{ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
);

export default mongoose.model('User', UserSchema);
