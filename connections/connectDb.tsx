import mongoose from "mongoose";

type connectionObject = {
    isConnected? : number
}

const connection : connectionObject = {isConnected : 0}

export async function connectDb():Promise<void> {

    if (mongoose.connection.readyState >= 1) {
        console.log("Using existing database connection.");
        return;
    }

    try {

        const mongoConnectionString = process.env.MONGO_URI
        const db_name = process.env.DB_NAME

        await mongoose.connect(`${mongoConnectionString}${db_name}`,{
            serverSelectionTimeoutMS: 5000, 
            socketTimeoutMS: 45000,
        })

        connection.isConnected = mongoose.connection.readyState;
        console.log("✅ MongoDB connected successfully!");

        
    } catch (error) {
        console.error("Connecting Database Failed",error)
    }
}