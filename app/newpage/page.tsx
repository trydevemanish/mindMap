"use client"
import Mermaid from "@/components/Mermaid";

export default function Home() {
  const mermaidChart = `    mindmap
root((Full Stack Developer Learning Path))
    Frontend
        HTML
        CSS
        JavaScript
        React
        Angular
        Vue.js
    Backend
        Node.js
        Python
        Java
        PHP
        Databases
            SQL
            NoSQL
            MongoDB
            PostgreSQL
            MySQL
    DevOps
        Linux
        Docker
        Kubernetes
        CI/CD
        AWS
        Azure
        GCP
    Databases
        SQL
        NoSQL
        MongoDB
        PostgreSQL
        MySQL
`

  return (
    <div>
      <h1>Mermaid.js with Next.js</h1>
      <Mermaid chart={mermaidChart} />
    </div>
  );
}
