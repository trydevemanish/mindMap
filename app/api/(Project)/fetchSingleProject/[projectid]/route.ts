import { NextResponse } from "next/server";
import { projectModel } from "@/model/projectPage";
import { connectDb } from "@/connections/connectDb";

export async function GET(req:Request) {
    try {
        
        await connectDb()

        const projectid = req.url.split("/")[5]

        if(!projectid){
            return NextResponse.json(
                {message : 'Invalid id property'},
                {status : 400}
            )
        }

        const res = await projectModel.findById(projectid)

        if(!res){
            return NextResponse.json(
                {message : "Issue in finding projects"},
                {status : 404}
            )
        }

        return NextResponse.json(
            {message : "found project...",data : res},
            {status : 200}
        )

    } catch (error) {
        return NextResponse.json(
            {message : error ?? "failed to fetch projects"},
            {status : 500}
        )
    }
}