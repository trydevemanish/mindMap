import { projectModel } from "../../../../model/projectPage"
import { NextResponse } from "next/server"
import { connectDb } from "../../../../connections/connectDb"

export async function POST(req : Request) {
    try {

        console.log("test 1")
        await connectDb()
        console.log("test 2")

        const { projectName, description } = await req.json()

        console.log(projectName)
        console.log(description)

        if(!projectName && !description){
            return NextResponse.json(
                { message : "Invalid Inputs field" },
                { status : 404 }
            )
        }

        let today = new Date();
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

        res.save({ validateBeforeSave : true })

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
