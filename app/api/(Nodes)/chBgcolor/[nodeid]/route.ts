import { nodeModel } from "@/model/nodes";
import { NextResponse } from "next/server";
import { connectDb } from "@/connections/connectDb";

async function PUT(req:Request, { params } : { params : any }) {
    try {

        await connectDb()
        const { bgcolorcode } = await req.json()
        const { nodeid } = await params

        if(!nodeid) {
            return NextResponse.json(
                {message : "Node id must be there"},
                {status : 404}
            )
        }

        const bgUpdated = await nodeModel.findByIdAndUpdate(
            nodeid,
            {
                style : {
                    backgroundColor : bgcolorcode
                }
            }
        )

        if(!bgUpdated){
            return NextResponse.json(
                {message : "Invalid Id , or failed to update Background "},
                {status : 400}
            )
        }

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