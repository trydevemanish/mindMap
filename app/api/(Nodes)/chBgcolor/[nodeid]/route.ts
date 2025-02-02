import { nodeModel } from "@/model/nodes";
import { NextResponse } from "next/server";
import { connectDb } from "@/connections/connectDb";

export async function PUT(req:Request) {
    try {

        await connectDb()

        const { bgColorCode } = await req.json()

        const url = new URL(req.url);
        const nodeid = url.pathname.split('/').pop();

        if(!bgColorCode){
            return NextResponse.json(
                {message : "Bg color code didn't received"},
                {status : 400}
            )
        }

        if(!nodeid) {
            return NextResponse.json(
                {message : "Node id must be there"},
                {status : 404}
            )
        }

        const bgUpdated = await nodeModel.findByIdAndUpdate(
            nodeid,
            {
                $set : { 
                    'style.backgroundColor' : bgColorCode
                }
            }
        )

        if(!bgUpdated){
            return NextResponse.json(
                {message : "Invalid Id , or failed to update Background "},
                {status : 400}
            )
        }

        await bgUpdated.save({ validateBeforeSave : true })

        return NextResponse.json(
            {message : "Background Color Updated Successfully", data : bgUpdated},
            {status : 200}
        )
        
    } catch (error) {
        return NextResponse.json(
            {message : error ?? "Internal server Error"},
            {status : 500}
        )
    }
}