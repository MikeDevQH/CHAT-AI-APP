'use client'

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { motion } from "framer-motion";

const Chat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ user: string; text: string }[]>([]);
  const [image, setImage] = useState<File | null>(null); 
  const [error, setError] = useState<string | null>(null);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() && !image) return; 

    setMessages((prevMessages) => [
      ...prevMessages,
      { user: "user", text: input },
    ]);
    setInput("");
    setIsBotTyping(true);

    const formData = new FormData();
    formData.append("message", input);
    if (image) formData.append("image", image); 

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: "bot", text: data.text },
      ]);
      setIsBotTyping(false);
      setImage(null); 
    } catch (error: any) {
      setError(error.message || "Error al obtener respuesta de la IA.");
      setIsBotTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100">
      <header className="text-center py-4 bg-gray-900 shadow-md">
        <h1 className="text-2xl font-bold text-blue-400">ChatAI App</h1>
      </header>
      <div className="flex-1 p-4 overflow-hidden">
        <ScrollArea className="h-full px-4 md:px-20">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              className={`flex items-start mb-4 ${
                message.user === "user" ? "justify-end" : "justify-start"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`flex items-center space-x-2 max-w-[70%]`}>
                <span className="text-2xl">
                  {message.user === "user" ? "👤" : "🤖"}
                </span>
                <div
                  className={`p-3 rounded-2xl shadow-md ${
                    message.user === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-100"
                  }`}
                >
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
          {isBotTyping && (
            <div className="ml-2 text-gray-400 flex items-center">
              <svg className="animate-spin h-5 w-5 mr-1" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 019-9.75V0a10 10 0 100 20v-2.25a8 8 0 01-9-9.75z"
                ></path>
              </svg>
              La IA está escribiendo...
            </div>
          )}
          <div ref={messagesEndRef} />
        </ScrollArea>
      </div>
      <div className="p-4 bg-gray-900">
        <div className="max-w-3xl mx-auto flex space-x-2">
          <Input
            className="flex-1 bg-gray-800 text-gray-100 border-gray-700 focus:border-blue-500 rounded-full"
            placeholder="Escribe un mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
          />
          <Button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 rounded-full p-2"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
      {error && <div className="text-red-500 text-center py-2">{error}</div>}
    </div>
  );
};

export default Chat;
