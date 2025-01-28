import { connectDb } from "@/connections/connectDb";
import { NextResponse } from "next/server";
import { nodeModel } from "@/model/nodes";

export async function DELETE(req:Request) {
    try {

        await connectDb()

        const url = new URL(req.url);
        const projectid = url.pathname.split('/').pop();

        const deletedAllNode = await nodeModel.deleteMany({
            projectID : projectid
        })

        if(!deletedAllNode){
            return NextResponse.json(
                {message : "Failed to delete Nodes array"}, 
                {status : 400}
            )
        }

        return NextResponse.json(
            {message : "All Nodes deleted Successfully"},
            {status : 200}
        )

    } catch (error) {
        return NextResponse.json(
            {message : error ?? "Internal server error"},
            {status : 500}
        )
    }
}