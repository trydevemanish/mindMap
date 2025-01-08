import mongoose from "mongoose";

type connectionObject = {
    isConnected? : number
}

const connection : connectionObject = {}

export async function connectDb():Promise<void> {
    if(connection.isConnected){
    } else {
        try {

            const mongoConnectionString = process.env.MONGO_URI
            const db_name = process.env.DB_NAME

            const db = await mongoose.connect(`${mongoConnectionString}${db_name}`)
            connection.isConnected = db.connections[0].readyState
            console.log("Mongo DB connected success...")
            
        } catch (error) {
            console.error("Connecting Database Failed",error)
        }
    }
}