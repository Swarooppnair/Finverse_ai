import React from 'react';
import { Bell, Search, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    return (
        <header className="h-16 flex items-center justify-between px-8 py-4">
            <div className="flex items-center bg-white/5 rounded-full px-4 py-2 w-96 border border-white/10">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input
                    type="text"
                    placeholder="Ask Finverse anything..."
                    className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-gray-500"
                />
            </div>

            <div className="flex items-center space-x-4">
                <button
                    onClick={() => navigate('/settings')}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-full text-sm font-bold hover:opacity-90 transition-opacity"
                >
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade
                </button>
                <button className="relative p-2 rounded-full hover:bg-white/10 transition-colors">
                    <Bell className="w-5 h-5 text-gray-300" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
                </button>
            </div>
        </header>
    );
};

export default Header;
