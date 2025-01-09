import { nodeModel } from "@/model/nodes";
import { connectDb } from "@/connections/connectDb";
import { NextResponse } from "next/server";

async function PUT(req:Request,{ params } : { params : any }) {
    try {

        await connectDb()
        const { link } = await req.json()
        const { nodeid } = await params

        if(!nodeid) {
            return NextResponse.json(
                {message : "Node id must be there"},
                {status : 404}
            )
        }

        const linkAdded = await nodeModel.findByIdAndUpdate(
            nodeid,
            {link : link}
        )

        if(!linkAdded){
            return NextResponse.json(
                {message : "Invalid Id , or failed to add Link"},
                {status : 400}
            )
        }

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