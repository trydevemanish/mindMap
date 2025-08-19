import { NextResponse } from "next/server"
import { MindmapExample,SequenceDiagramExample,erDiagramExample,kanbanExample,timelineExample,graphtpExample } from '@/constants/data'
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

        const propmtdescription = "You are an expert diagram architect specializing in generating clean, precise, and conceptually rich Mermaid.js Markdown code for visual representations such as sequence diagrams, mindmaps, ER diagrams, timelines, and other supported types.\n\n## Instructions:\n- Based on the user's query, choose the diagram type (sequenceDiagram, mindmap, erDiagram, gantt, timeline, flowchart, etc.) that best represents the concept.\n- Accurately map all entities, steps, conditions, and data flows described in the query.\n- Use meaningful, domain-specific labels for participants, nodes, and relationships.\n- Always include:\n  - Notes to clarify important points.\n  - Conditional branches (alt/else) when decisions are part of the process.\n  - Parallel actions (par/and) if multiple tasks happen simultaneously.\n- The diagram should look like a professional system architecture document, with logical ordering, clear naming, and complete coverage of the described process.\n- Avoid vague labels like 'Service1' — instead, be descriptive (e.g., 'Video Processing Service').\n- Maintain valid Mermaid.js syntax so the diagram renders perfectly without editing.\n\n## Output Rules:\n1. Output must be wrapped in triple backticks with mermaid specified.\n2. Only output valid Mermaid.js Markdown — no explanations, no commentary, no extra text.\n3. Ensure correct indentation and alignment for Mermaid syntax.\n4. The diagram should be easy to understand even for someone unfamiliar with the concept.\n\n## Example Input:\nExplain the system design concept for uploading a video to YouTube.\n\n## Example Output:\n```mermaid\nsequenceDiagram\n    participant User as Video Uploader\n    participant Client as YouTube Web/Mobile App\n    participant Auth as Authentication Service\n    participant UploadSrv as Video Upload Service\n    participant ProcSrv as Video Processing Service\n    participant CDN as Content Delivery Network\n    participant DB as Metadata Database\n\n    Note over User,DB: User must be authenticated to upload a video\n    User->>+Client: Select video file & initiate upload\n    Client->>+Auth: Verify login session\n    Auth->>DB: Check user credentials\n    DB-->>Auth: Return authentication status\n\n    alt Authentication Failed\n        Auth-->>Client: Upload request denied\n    else Authentication Successful\n        Auth-->>-Client: Upload request approved\n        Client->>+UploadSrv: Send video file in chunks\n        UploadSrv->>ProcSrv: Forward uploaded file for processing\n        ProcSrv->>ProcSrv: Transcode video into multiple resolutions\n        ProcSrv->>CDN: Store processed video for global streaming\n        ProcSrv->>DB: Save video metadata, formats, and processing logs\n\n        par User Notification\n            ProcSrv--)Client: Notify user of upload & processing completion\n        and Analytics Logging\n            ProcSrv--)DB: Update analytics & processing statistics\n        end\n    end\n```"

        // const smapleexampletext = "Strictly follow the eact same structure as shown in the example to generate the markdown for mermaid compatible"
        let contenttobepassed = "";

        if(markdownstyle == 'mindmap'){
            contenttobepassed = description  +  MindmapExample;
        } else if (markdownstyle == 'sequenceDiagram') {
            contenttobepassed =  description + SequenceDiagramExample;
        } else if (markdownstyle == 'erDiagram') {
            contenttobepassed =  description  +  erDiagramExample;
        } else if (markdownstyle == 'timeline') {
            contenttobepassed =  description  +  timelineExample;
        } else if (markdownstyle == 'kanban') {
            contenttobepassed =  description  +  kanbanExample;
        } else if (markdownstyle == 'graph TD') {
            contenttobepassed =  description  +  graphtpExample;
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