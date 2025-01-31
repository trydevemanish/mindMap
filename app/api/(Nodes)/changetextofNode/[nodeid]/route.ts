import { connectDb } from "@/connections/connectDb";
import { nodeModel } from "@/model/nodes";
import { NextResponse } from "next/server";

export async function PUT(req:Request) {
    try {
        await connectDb()

        const url = new URL(req.url);
        const nodeid = url.pathname.split('/').pop();

        const { updatedText } = await req.json()

        if(!updatedText){
            return NextResponse.json(
                {message : "pls provide new text"},
                {status : 400}
            )
        }

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