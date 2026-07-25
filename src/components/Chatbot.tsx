import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Sparkles } from 'lucide-react';
import { Message } from '../types';
import { cn } from '../lib/utils';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Olá! Sou o assistente virtual da CLA VENDAS. Como posso ajudar você hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', text: data.text }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { role: 'assistant', text: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 p-4 rounded-full shadow-2xl transition-all duration-300 z-50",
          "bg-[#F57C00] hover:bg-orange-600 text-white",
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        )}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      <div
        className={cn(
          "fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl transition-all duration-300 z-50 overflow-hidden flex flex-col",
          isOpen ? "scale-100 opacity-100 border border-gray-200" : "scale-0 opacity-0 pointer-events-none"
        )}
        style={{ height: '500px', maxHeight: 'calc(100vh - 48px)' }}
      >
        <div className="bg-[#2F2F2F] text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#F57C00]" />
            <span className="font-semibold">Assistente CLA VENDAS</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={cn(
                "max-w-[85%] rounded-2xl p-3 text-sm shadow-sm",
                msg.role === 'user' 
                  ? "bg-[#F57C00] text-white self-end ml-auto rounded-tr-none" 
                  : "bg-white text-gray-800 self-start border border-gray-100 rounded-tl-none"
              )}
            >
              {msg.text}
            </div>
          ))}
          {isLoading && (
            <div className="bg-white text-gray-800 self-start border border-gray-100 rounded-2xl rounded-tl-none p-3 max-w-[85%] shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#F57C00]" />
              <span className="text-sm text-gray-500">Pensando...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 bg-white border-t border-gray-100">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua dúvida..."
              className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F57C00] focus:border-transparent text-sm"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 bg-[#F57C00] text-white rounded-full hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
