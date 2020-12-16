import mongoose from 'mongoose';

const mongooseInit = () =>
	mongoose
		.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
		})
		.then(console.log('Database connection successfully established'))
		.catch((err) => console.log(err));

export default mongooseInit;
