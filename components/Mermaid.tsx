"use client"
import React, { useEffect,useState } from 'react';
import mermaid from 'mermaid';

const Mermaid = ({ chart }) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && chart) {
      mermaid.initialize({ startOnLoad: true });
      mermaid.contentLoaded();
    }
  }, [isClient,chart]);

  if (!isClient) {
    return null;
  }

  return (
    <div className="mermaid">
      {chart}
    </div>
  );
};

export default Mermaid;

