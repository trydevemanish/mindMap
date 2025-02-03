import { connectDb } from "@/connections/connectDb"
import { projectModel } from "@/model/projectPage"
import { NextResponse } from "next/server"

export async function POST(req : Request) {
    try {

        await connectDb()

        const { projectName, description } = await req.json()

        if(!projectName || !description){
            return NextResponse.json(
                { message : "Invalid Inputs field" },
                { status : 404 }
            )
        }

        const today = new Date();
        const construct_Date = today.toLocaleDateString("en-US")
  
        const res = await projectModel.create({
            projectName : projectName,
            description : description ?? "No desc.. provided",
            created_At : construct_Date
        })

        if(!res){
            return NextResponse.json(
                { message : "issue in creating projectModel" },
                { status : 404 }
            )
        }

        console.log("project created ...")

        return NextResponse.json(
            { message : "Created new proj.." , data : res },
            { status : 201 }
        )

    } catch (error) {
        return NextResponse.json(
            { message : error ?? "failed to crete new proj..."},
            { status : 500 }
        )
    }
}
