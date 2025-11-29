import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, FileText, PieChart, Settings, Shield, Activity, Bot, Brain } from 'lucide-react';
import clsx from 'clsx';

const Sidebar = () => {
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'AI CFO Chat', path: '/chat', icon: MessageSquare },
        { name: 'Tax & Reports', path: '/reports', icon: FileText },
        { name: 'Goals', path: '/goals', icon: PieChart },
        { name: 'Agent Swarm', path: '/agent-monitoring', icon: Bot },
        { name: 'FinDrop AI', path: '/findrop', icon: Activity },
        { name: 'FinTwin', path: '/fintwin', icon: Brain },
        { name: 'Settings', path: '/settings', icon: Settings },
    ];

    return (
        <div className="w-64 h-full glass-panel m-4 mr-0 flex flex-col border-r border-white/10">
            <div className="p-6 flex items-center space-x-2">
                <Shield className="w-8 h-8 text-primary" />
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    Finverse
                </span>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={clsx(
                                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                                isActive
                                    ? "bg-primary/20 text-white shadow-lg shadow-primary/10"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <Icon className={clsx("w-5 h-5", isActive ? "text-primary" : "text-gray-400 group-hover:text-white")} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/10">
                <div className="flex items-center space-x-3 px-4 py-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center font-bold">
                        S
                    </div>
                    <div>
                        <p className="text-sm font-medium">Swaroop</p>
                        <p className="text-xs text-gray-500">Premium Plan</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
