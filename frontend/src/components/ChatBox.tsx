import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import axios from 'axios';
import clsx from 'clsx';

interface Message {
    id: string;
    sender: 'user' | 'ai';
    text: string;
    timestamp: Date;
}

import { useData } from '../context/DataContext';

const ChatBox = () => {
    const { settings } = useData();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            sender: 'ai',
            text: 'Hello! I am your Autonomous CFO. How can I assist you with your finances today?',
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await axios.post('https://kylan-unbricked-superdevilishly.ngrok-free.dev/api/chat', {
                message: userMessage.text,
                context: { user_id: 'swaroop_001' }, // Mock context
                api_key: settings.apiKey
            });

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'ai',
                text: response.data.response,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'ai',
                text: "I'm sorry, I encountered an error connecting to my brain. Please try again.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white/5 rounded-xl border border-white/10 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={clsx(
                            "flex items-start space-x-3 max-w-[80%]",
                            msg.sender === 'user' ? "ml-auto flex-row-reverse space-x-reverse" : ""
                        )}
                    >
                        <div className={clsx(
                            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                            msg.sender === 'ai' ? "bg-primary" : "bg-secondary"
                        )}>
                            {msg.sender === 'ai' ? <Bot size={16} /> : <User size={16} />}
                        </div>
                        <div className={clsx(
                            "p-3 rounded-2xl text-sm",
                            msg.sender === 'ai'
                                ? "bg-white/10 text-white rounded-tl-none"
                                : "bg-primary text-white rounded-tr-none"
                        )}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex items-center space-x-2 text-gray-400 text-sm ml-12">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-white/10 bg-white/5">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask for financial advice..."
                        className="flex-1 bg-transparent border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading}
                        className="p-2 bg-primary hover:bg-primary/80 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
