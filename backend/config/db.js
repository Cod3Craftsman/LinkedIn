import mongoose from "mongoose";
const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URL);
  } catch (error) {
    console.log("DB error", error);
  }
};

export default connectDB;
