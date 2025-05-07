"use client"
import Mermaid from "@/components/Mermaid";

export default function Home() {
  const mermaidChart = `    erDiagram
    Wallet {
        string id
        string name
        string type
    }
    User {
        string id
        string username
        string email
        string password
    }
    Asset {
        string id
        string name
        string symbol
        string type
        double balance
    }
    Transaction {
        string id
        string type
        double amount
        timestamp timestamp
    }
    User ||--o{ Wallet : owns
    Wallet ||--o{ Asset : holds
    Wallet ||--o{ Transaction : contains

`

  return (
    <div>
      <h1>Mermaid.js with Next.js</h1>
      <Mermaid chart={mermaidChart} />
    </div>
  );
}
