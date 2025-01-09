import { nodeModel } from "@/model/nodes";
import { NextResponse } from "next/server";
import { connectDb } from "@/connections/connectDb";

async function PUT(req:Request, { params } : { params : any }) {
    try {

        await connectDb()
        const { textcolorcode } = await req.json()
        const { nodeid } = await params

        if(!nodeid) {
            return NextResponse.json(
                {message : "Node id must be there"},
                {status : 404}
            )
        }

        const textColorUpdated = await nodeModel.findByIdAndUpdate(
            nodeid,
            {
                style : {
                    textcolor : textcolorcode
                }
            }
        )

        if(!textColorUpdated){
            return NextResponse.json(
                {message : "Invalid Id , or failed to update text color "},
                {status : 400}
            )
        }

        return NextResponse.json(
            {message : "text Color Updated Successfully", data : textColorUpdated},
            {status : 200}
        )
        
    } catch (error) {
        return NextResponse.json(
            {message : error ?? "Internal server Error"},
            {status : 500}
        )
    }
}