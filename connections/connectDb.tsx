import mongoose from "mongoose";

type connectionObject = {
    isConnected? : number
}

const connection : connectionObject = {isConnected : 0}

export async function connectDb():Promise<void> {
    if(connection.isConnected){
    } else {
        try {

            const mongoConnectionString = process.env.MONGO_URI
            const db_name = process.env.DB_NAME

            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 5000);

            const db = await mongoose.connect(`${mongoConnectionString}${db_name}`,{
                serverSelectionTimeoutMS: 5000, // 5 seconds
                socketTimeoutMS: 45000,
            })
            clearTimeout(timeout);  
            connection.isConnected = db.connections[0].readyState
            console.log("Mongo DB connected success...")
            
        } catch (error) {
            console.error("Connecting Database Failed",error)
        }
    }
}