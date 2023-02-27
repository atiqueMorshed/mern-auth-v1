import mongoose from "mongoose";

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI_DOCKER);
		console.log("MongoDB database connected!");
	} catch (err) {
		console.error("ERROR (connectDB): ", err.message);
	}
};

export default connectDB;
