import { NextResponse } from "next/server";
import { projectModel } from "@/model/projectPage";
import { connectDb } from "@/connections/connectDb";

export async function GET() {
    try {

        console.log('connecting db')
        
        await connectDb()

        console.log('Calling fetch method')

        const res = await projectModel.find({})

        if(!res){
            return NextResponse.json(
                {message : "Issue in finding projects"},
                {status : 404}
            )
        }

        return NextResponse.json(
            {message : "found projects...",data : res},
            {status : 200}
        )

    } catch (error) {
        return NextResponse.json(
            {message : error ?? "failed to fetch projects"},
            {status : 500}
        )
    }
}