"use client"
import Mermaid from "@/components/Mermaid";
import useDataStore from "@/lib/useStore";
import { useRouter } from "next/navigation";
import { LucideStepBack } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Home() {

  const data = useDataStore((state) => state.data);
  const router = useRouter()

  async function downloadInPdfFormat(){
    try {
  
      const res = await fetch("/api/genereatePdf",{
        method : 'POST',
        headers : {
          'Content-Type': 'application/json'
        },
        body : JSON.stringify({ description:data?.description || "generatedDiagram" })
      });
  
      if(!res.ok){
        console.log("Failed to generate PDF")
        const errorText = await res.text();
            toast({
              title : errorText,
              className:'w-[300px] text-sm'
            })
            return;
      }
  
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
  
      const link = document.createElement('a');
      link.href = url;
      link.download = `${data?.description}.pdf`;
      document.body.appendChild(link);  
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('PDF generation failed:', error);
    }
  }

  const cleanedMermaid = data?.markdowndata
  .replace(/^```mermaid\s*/i, "") 
  .replace(/```$/, "")           
  .trim();
  
  const mermaidChart = `   ${cleanedMermaid}
 `


  return (
    <div className="min-h-screen p-2 bg-white">
      <div className="grid grid-cols-2 items-center content-center z-50">
         <div className="col-start-1 col-end-2 flex flex-col gap-2">
            <div className="flex gap-2 items-center">
                <LucideStepBack className="size-7 p-2 bg-violet-400 rounded-full stroke-white cursor-pointer" onClick={() => router.back()}  />
                <p className="text-sm max-w-60 flex-wrap">Generated diagram.</p>
            </div>
            <p className="max-w-1/2 text-sm">{data?.description}</p>
         </div>
        <div className="col-start-2 col-end-3 flex justify-end" onClick={downloadInPdfFormat}>
            <button>
                <p  className=" bg-violet-600 px-8 py-1 text-sm text-white rounded text-center inline-grid">Download pdf</p>
            </button>
        </div>
      </div>
      <Mermaid chart={mermaidChart}/>
    </div>
  );
}
