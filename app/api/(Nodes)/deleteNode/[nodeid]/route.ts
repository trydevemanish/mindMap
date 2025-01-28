import { connectDb } from "@/connections/connectDb";
import { nodeModel } from "@/model/nodes";
import { NextResponse } from "next/server";

export async function DELETE(req:Request) {
    try {

        await connectDb()
        
        const url = new URL(req.url);
        const nodeid = url.pathname.split('/').pop();

        if(!nodeid){
            return NextResponse.json(
                {message : "Invalid Node id"},
                {status : 404}
            )
        }

        const deletedNode = await nodeModel.findByIdAndDelete(nodeid)

        return NextResponse.json(
            {message : "Node Deleted Success",data : deletedNode},
            {status : 200}
        )

    } catch (error) {
        return NextResponse.json(
            {message : error ?? "Failed to delete Error"},
            {status : 500}
        )
    }
}