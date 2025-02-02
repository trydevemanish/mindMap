import { nodeModel } from "@/model/nodes";
import { connectDb } from "@/connections/connectDb";
import { NextResponse } from "next/server";

export async function PUT(req:Request) {
    try {

        await connectDb()

        const { link } = await req.json()

        const url = new URL(req.url);
        const nodeid = url.pathname.split('/').pop();

        if(!nodeid) {
            return NextResponse.json(
                {message : "Node id must be there"},
                {status : 404}
            )
        }

        if(!link) {
            return NextResponse.json(
                {message : "pls enter the link"},
                {status : 404}
            )
        }

        const linkAdded = await nodeModel.findByIdAndUpdate(
            nodeid,
            {$set : { link : link }},
            {new : true}
        )

        if(!linkAdded){
            return NextResponse.json(
                {message : "Invalid Id , or failed to add Link"},
                {status : 400}
            )
        }

        await linkAdded.save({ validateBeforeSave : true })

        return NextResponse.json(
            {message : "Link Added Successfully", data : linkAdded},
            {status : 200}
        )
        
    } catch (error) {
        return NextResponse.json(
            {message : error ?? "Internal server Error"},
            {status : 500}
        )
    }
}