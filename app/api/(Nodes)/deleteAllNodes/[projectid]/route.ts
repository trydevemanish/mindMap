import { connectDb } from "@/connections/connectDb";
import { NextResponse } from "next/server";
import { nodeModel } from "@/model/nodes";

export async function DELETE(req:Request,{params} : {params : any}) {
    try {

        await connectDb()

        const { projectid } = await params

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