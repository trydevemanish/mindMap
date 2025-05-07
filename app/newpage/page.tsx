"use client"
import Mermaid from "@/components/Mermaid";
import useDataStore from "@/lib/useStore";
import { useEffect } from "react";

export default function Home() {

  const data = useDataStore((state) => state.data);

  console.log('mermaidchartdata',data)

  const mermaidChart = `${data}`

  return (
    <div>
      <h1>Mermaid.js with Next.js</h1>
      <Mermaid chart={mermaidChart} />
    </div>
  );
}
