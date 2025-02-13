import mongoose from "mongoose";

let isConnected = false;

export async function connectDb(): Promise<void> {
  if (isConnected) {
    console.log("using exisiting conn")
    return; 
  }

  try {
    await mongoose.connect(process.env.MONGO_URI!, {
      dbName: process.env.DB_NAME,
    });

    isConnected = true; 
    console.log("db connected")
  } catch (error) {
    console.error("Database connection failed:", error);
    throw new Error("Database connection failed");
  }
}

