import { NextResponse } from "next/server";
import { projectModel } from "@/model/projectPage";
import { connectDb } from "@/connections/connectDb";

export async function PUT(req:Request) {
    try {

        await connectDb()

        const url = new URL(req.url);
        const projectid = url.pathname.split('/').pop();

        const {newProjectName} = await req.json()

        if(!newProjectName){
            return NextResponse.json(
                {message : "New Project Name is required"},
                {status : 404}
            )
        }

        const updatedProjectName = await projectModel.findByIdAndUpdate(
            projectid,
            {
                $set : {
                    projectName : newProjectName
                }
            }
        )

        if(!updatedProjectName){
            return NextResponse.json(
                {message : "Updation Failed"},
                {status : 500}
            )
        }

        return NextResponse.json(
            {message : "Updationn Success",data : updatedProjectName},
            {status : 200}
        )
        
    } catch (error) {
        return NextResponse.json(
            {message : error ?? "Internal Server Error"},
            {status : 500}
        )
    }
}