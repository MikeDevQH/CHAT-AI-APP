'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const Chat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ user: string; text: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    
    setMessages((prevMessages) => [...prevMessages, { user: 'user', text: input }]);
    setInput(''); 

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      setMessages((prevMessages) => [...prevMessages, { user: 'bot', text: data.text }]);
    } catch (error: any) {
      setError(error.message || 'Error al obtener respuesta de la IA.');
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto p-5 border border-gray-300 rounded-lg">
  <div className="flex-1 overflow-y-auto mb-5">
    {messages.map((message, index) => (
      <div
        key={index}
        className={`flex mb-2 ${message.user === 'user' ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className={`max-w-[60%] p-2 rounded-lg break-words ${
            message.user === 'user' ? 'bg-teal-800 text-white' : 'bg-green-100 text-black'
          }`}
        >
          <ReactMarkdown>{message.text}</ReactMarkdown>
        </div>
      </div>
    ))}
  </div>
  <div className="flex items-center border-t border-gray-300 pt-2">
    <input
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
      placeholder="Escribe tu mensaje..."
      className="flex-1 p-2 border border-gray-300 rounded-md mr-2"
    />
    <button onClick={sendMessage} className="px-4 py-2 bg-teal-800 text-white rounded-md hover:bg-teal-900">
      Enviar
    </button>
  </div>
  {error && <div className="text-red-500">{error}</div>}
</div>
  )
}

export default Chat;
