import React from "react";  
import { motion } from "framer-motion";  
import ReactMarkdown from "react-markdown";  
import { ScrollArea } from "@/components/ui/scroll-area";  
import { User, Bot } from "lucide-react";  

interface Message {  
  user: string;  
  text: string;  
  image?: string;  
}  

interface ChatBodyProps {  
  messages: Message[];  
  isBotTyping: boolean;  
  messagesEndRef: React.RefObject<HTMLDivElement>;  
}  

export default function ChatBody({  
  messages,  
  isBotTyping,  
  messagesEndRef,  
}: ChatBodyProps) {  
  const UserIcon = () => <User className="h-8 w-8 text-blue-500" />;  
  const BotIcon = () => <Bot className="h-8 w-8 text-blue-500" />;  

  return (  
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
            <div className="flex items-start space-x-2 max-w-[70%]">  
              {message.user === "user" ? <UserIcon /> : <BotIcon />}  
              <div className="flex flex-col ">  
                {message.image && (  
                  <img  
                    src={message.image}  
                    alt="preview"  
                    className="w-32 h-auto rounded-lg mb-2"  
                  />  
                )}  
                <div  
                  className={`p-3 rounded-2xl shadow-md ${  
                    message.user === "user"  
                      ? "bg-blue-800 text-white"   
                      : "bg-gray-900 text-white"  
                  }`}  
                >  
                  {message.text.startsWith("```") ? (   
                    <pre className="bg-gray-800 p-2 rounded-lg">  
                      <code>  
                        <ReactMarkdown>{message.text}</ReactMarkdown>  
                      </code>  
                    </pre>  
                  ) : (  
                    <ReactMarkdown>{message.text}</ReactMarkdown>  
                  )}  
                </div>  
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
  );  
}