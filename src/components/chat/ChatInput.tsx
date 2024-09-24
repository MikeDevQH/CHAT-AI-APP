import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip, X } from "lucide-react";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sendMessage: () => void;
  imagePreview: string | null;
  openFileExplorer: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  isBotTyping: boolean;
  clearImage: () => void;
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
  clearImage, // Recibimos la función para limpiar la imagen desde las props
}: ChatInputProps) {
  const [image, setImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false); // Bandera para la animación de carga
  const [charCount, setCharCount] = useState(0); // Contador de caracteres
  const maxCharLimit = 1000; // Límite de caracteres, ajustable

  // Actualizar el contador de caracteres cada vez que cambie el input
  useEffect(() => {
    setCharCount(input.length);
  }, [input]);

  // Simulación de carga de imagen
  const handleSendMessage = () => {
    if (imagePreview) {
      setIsUploading(true);
      setTimeout(() => {
        sendMessage(); // Enviar mensaje después de simular la carga
        setIsUploading(false);
      }, 2000); // Simulamos un retardo de 2 segundos
    } else {
      sendMessage();
    }
  };

  return (
    <>
      <div>
        {/* Previsualización de imagen con botón de cancelar */}
        {imagePreview && (
          <div className="mt-2 flex justify-center items-center space-x-2 m-2 ">
            <img
              src={imagePreview}
              alt="Previsualización"
              className="w-32 h-auto rounded-lg"
            />
            <Button
              onClick={clearImage} // función de eliminar imagen
              className="bg-[var(--button-background)]  hover:bg-red-500 p-2 rounded-full"
            >
              <X className="h-5 w-5 text-[var(--button-icon-color)]" />
            </Button>
          </div>
        )}
      </div>
      <div className="p-4 bg-[var(--input-container-background)]">
        <div className="max-w-3xl mx-auto flex space-x-2 items-center p-2 bg-[var(--input-background)] rounded-full">
          <Input
            className="h-10 flex-1 text-[var(--input-text)] border-[var(--input-border)] rounded-full placeholder-[var(--input-placeholder)] border-none"
            placeholder="Escribe un mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !isBotTyping && handleSendMessage()
            }
            disabled={isBotTyping || isUploading} // Deshabilitar cuando el bot escribe o se está subiendo imagen
            maxLength={maxCharLimit}
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
            className="bg-[var(--button-background)] hover:bg-[var(--button-hover-background)] rounded-full p-2"
            disabled={isBotTyping || isUploading} // Deshabilitar cuando el bot escribe o se está subiendo imagen
          >
            <Paperclip className="h-5 w-5 text-[var(--button-icon-color)]" />
          </Button>

          <Button
            onClick={handleSendMessage}
            disabled={
              !input.trim() || isBotTyping || isUploading
            } // Deshabilitar si no hay mensaje, el bot está escribiendo o subiendo imagen
            className={`rounded-full p-2 ${
              (!input.trim() && !imagePreview) || isBotTyping || isUploading
                ? "bg-[var(--button-disabled-background)] text-[var(--button-icon-color)] opacity-[var(--button-disabled-opacity)] cursor-[var(--button-disabled-cursor)]"
                : "bg-[var(--button-background)] hover:bg-[var(--button-hover-background)] text-[var(--button-icon-color)]"
            }`}
          >
            {isUploading ? (
              <div className="loader h-5 w-5 border-2 border-t-2 border-gray-100 rounded-full animate-spin"></div>
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Contador de caracteres */}
        <div className="text-gray-400 text-sm mb-10fixed">
          {charCount}/{maxCharLimit} caracteres
        </div>
      </div>
    </>
  );
}
