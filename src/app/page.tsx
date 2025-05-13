"use client";

import { useState } from "react";
import ChatInterface from "../components/ChatInterface";
import Header from "../components/Header";

export default function Home() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([
    {
      role: "assistant",
      content: "Olá! Sou o Guru PCP, seu assistente virtual especializado em Planejamento e Controle da Produção. Como posso ajudar você hoje?"
    }
  ]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        <ChatInterface messages={messages} setMessages={setMessages} />
      </div>
    </main>
  );
}
