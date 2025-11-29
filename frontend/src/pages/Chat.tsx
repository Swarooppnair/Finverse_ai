import React from 'react';
import ChatBox from '../components/ChatBox';

const Chat = () => {
    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-white">AI CFO Chat</h1>
                <p className="text-gray-400">Get personalized financial advice powered by Gemini 2.5</p>
            </div>
            <div className="flex-1">
                <ChatBox />
            </div>
        </div>
    );
};

export default Chat;
