import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Loader2, Bot, User } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendChatMessage } from '../services/geminiService';

interface ChatBotProps {
  file: File | null;
}

const ChatBot: React.FC<ChatBotProps> = ({ file }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '안녕하세요! 업로드하신 보고서에 대해 궁금한 점이 있으신가요?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await sendChatMessage(messages, input, file);
    
    const botMsg: ChatMessage = { role: 'model', text: responseText };
    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-xl hover:bg-blue-700 transition-all duration-300 z-50 ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200 transition-all duration-300 z-50 transform origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-blue-600 text-white rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            <span className="font-semibold">AI 보고서 도우미</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-gray-200' : 'bg-blue-100'}`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-gray-600" /> : <Bot className="w-5 h-5 text-blue-600" />}
              </div>
              <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-2">
               <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                 <Bot className="w-5 h-5 text-blue-600" />
               </div>
               <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm">
                 <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-gray-100 bg-white rounded-b-2xl">
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={file ? "보고서에 대해 질문하세요..." : "파일을 먼저 업로드하세요"}
              disabled={!file}
              className="flex-1 bg-transparent border-none outline-none text-sm disabled:text-gray-400"
            />
            <button 
              onClick={handleSend} 
              disabled={!file || !input.trim() || isLoading}
              className="text-blue-600 hover:text-blue-700 disabled:text-gray-400"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatBot;
