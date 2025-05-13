import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { sendMessageToAI } from '../services/aiService';

interface Message {
  role: string;
  content: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const ChatInterface = ({ messages, setMessages }: ChatInterfaceProps) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Adiciona a mensagem do usuário ao chat
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Envia a mensagem para a API e obtém a resposta
      const aiResponse = await sendMessageToAI(input, messages);
      
      // Adiciona a resposta da IA ao chat
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.' 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-white rounded-lg shadow-md">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0 mr-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image 
                    src="/avatar-pcp.png" 
                    alt="Avatar do Guru PCP" 
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
            <div 
              className={`max-w-[70%] p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-blue-100 text-blue-900 rounded-br-none' 
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
            {message.role === 'user' && (
              <div className="flex-shrink-0 ml-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-blue-500 flex items-center justify-center text-white">
                  <span>Você</span>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua pergunta sobre PCP..."
            className="flex-1 border border-gray-300 rounded-l-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-r-lg transition-colors duration-300"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Enviar'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
