import mongoose from "mongoose";

const connectDB = async () => {
   try {
          await mongoose.connect(process.env.MONGO_URI);
          console.log('MongoDB connected');
      } catch (err) {
          console.error(err.message);
          process.exit(1);// why do we use process.exit(1) because if there is an error in connecting to database then we need to exit the 
          // process with failure code 1
  
      }     
};

export default connectDB;