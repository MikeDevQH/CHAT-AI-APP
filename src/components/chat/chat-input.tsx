import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip } from "lucide-react";
import { useState } from "react";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sendMessage: () => void;
  imagePreview: string | null;
  openFileExplorer: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  isBotTyping: boolean; 
}

export default function ChatInput({
  input,
  setInput,
  handleImageChange,
  sendMessage,
  imagePreview,
  openFileExplorer,
  fileInputRef,
  isBotTyping,  
}: ChatInputProps) {
  const [image, setImage] = useState<File | null>(null);

  return (
    <div className="p-4 bg-gray-900">
      <div className="max-w-3xl mx-auto flex space-x-2">
        <Input
          className=" h-10 flex-1 bg-gray-800 text-gray-100 border-gray-700 focus:border-blue-500 rounded-full"
          placeholder="Escribe un mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && !isBotTyping && sendMessage()} // Deshabilitar cuando el bot está escribiendo
          disabled={isBotTyping} // Deshabilitar el campo de entrada mientras el bot está escribiendo
        />
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        <Button
          onClick={openFileExplorer}
          className="bg-gray-800 hover:bg-blue-800 rounded-full p-2 mt-1"
          disabled={isBotTyping} // Deshabilitar el botón de adjuntar imágenes
        >
          <Paperclip className="h-5 w-5 text-gray-400" />
        </Button>
        <Button
          onClick={sendMessage}
          disabled={(!input.trim() && !image) || isBotTyping} // Deshabilitar si el bot está escribiendo
          className={`rounded-full p-2 ${
            (!input.trim() && !image) || isBotTyping
              ? "bg-gray-800 opacity-50 cursor-not-allowed mt-1"
              : "bg-gray-800 hover:bg-blue-700 mt-1"
          }`}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
      {imagePreview && (
        <div className="mt-2 flex justify-center">
          <img
            src={imagePreview}
            alt="Previsualización"
            className="w-32 h-auto rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
