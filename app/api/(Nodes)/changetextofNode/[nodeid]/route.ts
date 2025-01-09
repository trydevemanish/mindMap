import { connectDb } from "@/connections/connectDb";
import { nodeModel } from "@/model/nodes";
import { NextResponse } from "next/server";

export async function PUT(req:Request,{params}:{params : any}) {
    try {
        await connectDb()
        const {nodeid} = await params
        const { updatedText } = await req.json()

        const updatedTextOfNode = await nodeModel.findByIdAndUpdate(
            nodeid,
            { title : updatedText }
        )

        if(!updatedTextOfNode){
            return NextResponse.json(
                {message : "updation failed"},
                {status : 400}
            )
        }

        await updatedTextOfNode?.save({ validateBeforeSave : true })

        return NextResponse.json(
            {message : "text updated Successfully",data : updatedTextOfNode},
            {status : 200}
        )

    } catch (error) {
        return NextResponse.json(
            {message : error ?? "Failed to update text"},
            {status : 500}
        )
    }
}