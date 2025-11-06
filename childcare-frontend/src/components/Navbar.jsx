import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Menu, LogOut, User } from "lucide-react";

export default function Navbar({ title, onMenuClick }) {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="bg-slate-800 shadow-lg border-b border-slate-700 sticky top-0 z-30">
      <div className="px-6 sm:px-8 lg:px-12 py-4 flex justify-between items-center">
        {/* Left side - Mobile menu button and title */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-300" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white capitalize">{title}</h1>
            <p className="text-sm text-gray-400">Welcome back, {user?.name}</p>
          </div>
        </div>

        {/* Right side - User info and actions */}
        <div className="flex items-center space-x-8">
          {/* User profile */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-500 rounded-full flex items-center justify-center shadow-md">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-white">{user?.name}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
            </div>
          </div>

          {/* Logout button - Enhanced styling */}
          <button
            onClick={logout}
            className="group flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-red-500/50 hover:scale-105 active:scale-95 relative overflow-hidden"
          >
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            
            {/* Icon and text */}
            <LogOut className="w-4 h-4 relative z-10 transform group-hover:translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline relative z-10">Logout</span>
            
            {/* Shine effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12"></div>
          </button>
        </div>
      </div>
    </header>
  );
}
