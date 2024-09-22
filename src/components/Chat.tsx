'use client'

import { useState, useEffect, useRef } from "react";
import ChatHeader from "@/components/chat/chat-header";
import ChatBody from "@/components/chat/chat-body";
import ChatInput from "@/components/chat/chat-input";

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { user: string; text: string; image?: string }[]
  >([]);
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [botMessageRetry, setBotMessageRetry] = useState<{
    message?: string;
    image?: string;
  } | null>(null); // Para reintentar la respuesta de la IA
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
  
    // Añadir el mensaje del usuario al chat
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
  
      // Añadir el mensaje de la IA al chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: "bot", text: data.text },
      ]);
      setBotMessageRetry(null); // Si la respuesta del bot es exitosa, limpiar el estado de retry
      setIsBotTyping(false);
    } catch (error: any) {
      // Si el error ocurre al enviar el mensaje del usuario
      if (!botMessageRetry) {
        // Eliminar el mensaje fallido del chat
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.text !== input)
        );
        // Restaurar el mensaje fallido en el input
        setInput(input);
        setError("Error al enviar el mensaje, vuelve a intentarlo.");
      } else {
        // Si falla la generación de la respuesta del bot, permitir reintentar
        setBotMessageRetry({ message: input, image: imagePreview || undefined });
        setError("Error al generar la respuesta de la IA, vuelve a intentarlo.");
      }
      setIsBotTyping(false);
    }
  };
  

  const retryBotMessage = async () => {
    if (!botMessageRetry) return;
  
    // Añadir de nuevo el mensaje del usuario
    setMessages((prevMessages) => [
      ...prevMessages,
      { user: "user", text: botMessageRetry.message || "", image: botMessageRetry.image },
    ]);
    setBotMessageRetry(null);
    setError(null);
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
        fileInputRef={fileInputRef}
        isBotTyping={isBotTyping}
      />
      {error && (
        <div className="text-red-500 text-center py-2">
          {error}{" "}
          {botMessageRetry && (
            <button
              onClick={retryBotMessage}
              className="text-blue-400 hover:underline"
            >
              Reintentar
            </button>
          )}
        </div>
      )}
    </div>
  );
}
