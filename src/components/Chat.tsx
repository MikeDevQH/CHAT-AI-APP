"use client";

import { useState, useEffect, useRef } from "react";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatBody from "@/components/chat/ChatBody";
import ChatInput from "@/components/chat/ChatInput";

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { user: string; text: string; image?: string }[]
  >([]);
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const openFileExplorer = () => {
    fileInputRef.current?.click(); 
  };

  const sendMessage = async () => {
    if (!input.trim() && image) return;
    if (!input.trim() && !image) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { user: "user", text: input, image: imagePreview || undefined },
    ]);
    setInput("");
    setImage(null);
    setImagePreview(null);
    setIsBotTyping(true);
    setError(null);

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
    } catch (error: any) {
      setError(error.message || "Error al obtener respuesta de la IA.");
      setIsBotTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100">
      <ChatHeader />
      <ChatBody
        messages={messages}
        isBotTyping={isBotTyping}
        messagesEndRef={messagesEndRef}
      />
      <ChatInput
        input={input}
        setInput={setInput}
        handleImageChange={handleImageChange}
        sendMessage={sendMessage}
        imagePreview={imagePreview}
        openFileExplorer={openFileExplorer}
        fileInputRef={fileInputRef}     />
      {error && <div className="text-red-500 text-center py-2">{error}</div>}
    </div>
  );
}
