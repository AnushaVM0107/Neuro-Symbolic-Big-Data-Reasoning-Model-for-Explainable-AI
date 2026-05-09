
import React from 'react';
import { BrainCircuitIcon, LogOutIcon } from './IconComponents';

interface HeaderProps {
  onLogout?: () => void;
  userEmail?: string | null;
}

export const Header: React.FC<HeaderProps> = ({ onLogout, userEmail }) => {
  return (
    <header className="sticky top-0 z-50 glass border-b border-white/20 shadow-sm">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center group cursor-pointer">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-2.5 rounded-2xl shadow-lg shadow-indigo-200 mr-4 group-hover:scale-110 transition-transform duration-300">
            <BrainCircuitIcon className="h-7 w-7 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tight font-heading leading-tight">
              <span className="text-gradient">Explainable AI</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Neural-Symbolic Reasoning</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {userEmail && (
            <div className="hidden lg:flex flex-col items-end mr-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Authorized User</span>
              <span className="text-xs font-bold text-slate-600 leading-none">{userEmail}</span>
            </div>
          )}

          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Documentation</a>
          </nav>

          {onLogout && (
            <button
              onClick={onLogout}
              className="group flex items-center justify-center gap-2 bg-slate-50 text-slate-600 hover:text-red-600 hover:bg-red-50 font-bold py-2.5 px-4 rounded-xl border border-slate-100 hover:border-red-100 transition-all active:scale-95 shadow-sm"
            >
              <LogOutIcon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              <span className="text-xs uppercase tracking-widest hidden sm:inline">Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
