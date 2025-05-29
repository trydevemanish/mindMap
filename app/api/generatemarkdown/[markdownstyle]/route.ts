import { NextResponse } from "next/server"
import { MindmapExample,SequenceDiagramExample,erDiagramExample,kanbanExample,packetbetaExample,quadrantChartExample,timelineExample,propmt } from '@/constants/data'
import { GoogleGenerativeAI } from "@google/generative-ai";

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req:Request) {
    try {

        const url = new URL(req.url)
        const markdownstyle = url.pathname.split("/")[3]

        console.log(markdownstyle)

        const {description} = await req.json()

        if (!description) { 
            return NextResponse.json(
                {message:'No descrition provided'},
                {status:400}
            )
        }

        console.log(description);

        const propmtdescription = propmt;
        const smapleexampletext = "Strictly follow the eact same structure as shown in the example to generate the markdown for mermaid compatible"
        let contenttobepassed = "";

        if(markdownstyle == 'mindmap'){
            contenttobepassed = description  + smapleexampletext +  MindmapExample;
        } else if (markdownstyle == 'sequenceDiagram') {
            contenttobepassed =  description + smapleexampletext + SequenceDiagramExample;
        } else if (markdownstyle == 'erDiagram') {
            contenttobepassed =  description + smapleexampletext +  erDiagramExample;
        } else if (markdownstyle == 'timeline') {
            contenttobepassed =  description + smapleexampletext +  timelineExample;
        } else if (markdownstyle == 'kanban') {
            contenttobepassed =  description + smapleexampletext +  kanbanExample;
        } else {
            return NextResponse.json(
                {
                    message:'no markdown style passed'
                },
                {status:500}
            )
        }
        

        const chat = model.startChat({
            history: [
              {
                role: "user",
                parts: [{ text: propmtdescription }]
              },
              {
                role: "model",
                parts: [{ text: "Got it. Ready for your input." }]
              }
            ]
          });

        const result = await chat.sendMessage(contenttobepassed);
        const response = result.response.text();

        if(!response){
            return NextResponse.json(
                {message:'Response not generated'},
                {status:400}
            )
        }

        console.log('response',response)

        return NextResponse.json(
            {message:'Markdown generated',data:response},
            {status:200}
        )
          
    } catch (error) {
        console.error(`Failed to generate Markdown : ${error}`)
        return NextResponse.json(
            {
                message:`Failed to generate Markdown : ${error}`
            },
            {status:500}
        )
    }
}