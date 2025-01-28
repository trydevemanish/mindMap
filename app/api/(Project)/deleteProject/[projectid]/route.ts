import { NextResponse } from "next/server";
import { projectModel } from "@/model/projectPage";
import { connectDb } from "@/connections/connectDb";

export async function DELETE(req:Request) {
    try {

        await connectDb()

        const projectid = req.url.split("/")[5]

        const deletedProject = await projectModel.findByIdAndDelete(projectid)

        if(!deletedProject){
            return NextResponse.json(
                {message : "Project Deletion Unsuccessfull"},
                {status : 400}
            )
        }

        return NextResponse.json(
            {message : "Project Deletion Success"},
            {status : 200}
        )
        
    } catch (error) {
        return NextResponse.json(
            {message : error ?? "Internal Server Error"},
            {status : 500}
        )
    }
}