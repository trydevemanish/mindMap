import { NextResponse } from "next/server";
import { connectDb } from "@/connections/connectDb";
import { nodeModel } from "@/model/nodes";

export async function GET(req : Request){
    try {

        console.log("test 1")
        await connectDb()

        const url = new URL(req.url);
        const projectid = url.pathname.split('/').pop();

        if(!projectid){
            return NextResponse.json(
                {message : "Invalid Project Id"},
                {status : 404}
            )
        }

        const nodes = await nodeModel.find({ projectID : projectid })

        if(!nodes){
            return NextResponse.json(
                {message : "Can't get Nodes from DB"},
                {status : 400}
            )
        }

        return NextResponse.json(
            {messsge : "fetch all the Nodes",data : nodes},
            {status  : 200}
        )

    } catch (error) {
        return NextResponse.json(
            {message : error ?? "Failed to Get all Nodes"},
            {status : 500}
        )
    }
}