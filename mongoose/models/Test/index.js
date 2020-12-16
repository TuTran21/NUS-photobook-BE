import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Test = new Schema(
	{
		id: Schema.Types.ObjectId,
		title: { type: String, default: 'Unnamed Test' },
		author: { type: Schema.Types.ObjectId, ref: 'User' },
		image: { type: String, default: '' },
		views: { type: Number, default: 0 },
		publishDate: Date,
		competition: {
			isCompetition: {
				type: Boolean,
				default: false,
			},
			attemptAmount: {
				type: Number,
				default: 0,
			},
			event: {
				type: Schema.Types.ObjectId,
				ref: 'Event',
			},
		},
		rating: {
			starAmount: { type: Number, default: 0 },
			voteAmount: { type: Number, default: 0 },
			votes: [
				{
					owner: { type: Schema.Types.ObjectId, ref: 'User' },
					star: Number,
				},
			],
		},
		testDetails: {
			readingTest: { type: Schema.Types.ObjectId, ref: 'ReadingTest' },
		},
	},
	{ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
);
const ModelTest = mongoose.model('Test', Test);
export default ModelTest;
