import mongoose from 'mongoose';
import mongodb from 'mongodb';
const { ObjectID } = mongodb;

const Schema = mongoose.Schema;

ObjectID.prototype.valueOf = function () {
	return this.toString();
};

const EventSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		image: { type: String },
		posts: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Post',
			},
		],
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
		participants: [
			{
				id: Number,
				user: {
					type: Schema.Types.ObjectId,
					ref: 'User',
				},
				isPaid: {
					type: Boolean,
					default: false,
				},
				message: {
					type: String,
					default: '',
				},

				note: {
					type: String,
					default: '',
				},
				createdAt: Date,
				updatedAt: Date,
			},
		],
		fee: Number,
		startDate: Date,
		endDate: Date,
	},
	{ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
);
export default mongoose.model('Event', EventSchema);
