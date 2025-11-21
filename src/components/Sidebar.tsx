import React from 'react';
import { Icons } from './icons';
import type { User } from '../types';

interface SidebarProps {
    currentUser: User;
    currentView: string;
    onNavigate: (view: string) => void;
    onLogout: () => void;
    onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    currentUser,
    currentView,
    onNavigate,
    onLogout,
    onOpenSettings
}) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Icons.Home },
        { id: 'properties', label: 'Imóveis', icon: Icons.Building },
        { id: 'owners', label: 'Proprietários', icon: Icons.Users },
        { id: 'tenants', label: 'Inquilinos', icon: Icons.User },
    ];

    if (currentUser.role === 'admin') {
        menuItems.push({ id: 'users', label: 'Usuários', icon: Icons.Settings });
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    return (
        <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                    <Icons.Building className="w-8 h-8" />
                    Vendo Ideias
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                        {currentUser.photoUrl ? (
                            <img
                                src={currentUser.photoUrl}
                                alt={currentUser.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-blue-600 font-bold">
                                {getInitials(currentUser.name)}
                            </span>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {currentUser.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                            {currentUser.email}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={onOpenSettings}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                        <Icons.Settings className="w-4 h-4" />
                        Config
                    </button>
                    <button
                        onClick={onLogout}
                        className="flex items-center justify-center px-3 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Sair"
                    >
                        <Icons.LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};
