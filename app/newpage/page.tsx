"use client"
import Mermaid from "@/components/Mermaid";

export default function Home() {
  const mermaidChart = `
     graph TD
      A[Start] --> B{Is it working?}
      B -- Yes --> C[Great!]
      B -- No --> D[Try again]
      C --> E[Finish]
  `;

  return (
    <div>
      <h1>Mermaid.js with Next.js</h1>
      <Mermaid chart={mermaidChart} />
    </div>
  );
}
