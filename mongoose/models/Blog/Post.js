import mongoose from 'mongoose';
import mongodb from 'mongodb';
const { ObjectID } = mongodb;

const Schema = mongoose.Schema;

ObjectID.prototype.valueOf = function () {
	return this.toString();
};

const PostSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		image: { type: String },
		content: { html: { type: String }, text: { type: String } },
		isPublished: {
			type: Boolean,
			required: true,
		},
		views: {
			type: Number,
			default: 0,
		},
		author: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		comments: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Comment',
			},
		],
	},
	{ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
);
export default mongoose.model('Post', PostSchema);
