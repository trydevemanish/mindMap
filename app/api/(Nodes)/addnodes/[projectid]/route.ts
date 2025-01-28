import { connectDb } from "@/connections/connectDb"
import { nodeModel } from "@/model/nodes"
import { NextResponse } from "next/server"

export async function POST(req : Request) {
    try {
        await connectDb()
        const { title,parentNodeID,position } = await req.json()
        
        const url = new URL(req.url);
        const projectid = url.pathname.split('/').pop();

        if(!projectid){
            return NextResponse.json(   
                {message : "Invalid Project Id"},
                {status : 400}
            )
        }

        const newNode = await nodeModel.create({
            projectID : projectid,
            title : title,
            parentNodeID : parentNodeID || null,
            childNodeID : [],
            position : {
                x : position.x ,
                y : position.y ,
            }
        })

        if(parentNodeID){
            await nodeModel.findByIdAndUpdate(
                parentNodeID,
                {$push : { childNodeID : newNode?._id }}
            )
        }

        return NextResponse.json(
            {message : "New Node Created", data : newNode},
            {status : 201}
        )
        
        
    } catch (error) {
        return NextResponse.json(
            {message : error ?? "Failed to Add"},
            { status : 500 }
        )
    }
}