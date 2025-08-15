import mongoose from "mongoose";

let bucket; // Variable for storing connections to GridFS buckets

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`mongodb connected: ${conn.connection.host}`);
    // Once the connection is successful, create a connection to GridFS.
    bucket = new mongoose.mongo.GridFSBucket(conn.connection.db, {
      bucketName: "uploads", // Collection name in the database
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export const getbucket = () => bucket;
