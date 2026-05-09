
import React from 'react';
import type { KPIData } from '../types';

export const KPICard: React.FC<KPIData> = ({ title, value, icon: Icon }) => {
  return (
    <div className="glass-card p-7 rounded-[2rem] group relative overflow-hidden">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-50/50 rounded-full blur-2xl group-hover:bg-indigo-100 transition-colors duration-500"></div>

      <div className="flex items-center gap-x-6 relative z-10">
        <div className="flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-[1.25rem] bg-indigo-50 group-hover:bg-indigo-600 transition-all duration-500 ease-out shadow-sm group-hover:shadow-indigo-200">
          <Icon className="h-8 w-8 text-indigo-600 group-hover:text-white transition-colors duration-500" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.1em] mb-1.5">{title}</p>
          <p className="text-3xl font-black text-slate-800 font-heading tracking-tight">{value}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className="flex h-1.5 w-1.5 rounded-full bg-green-500"></span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Metric</span>
      </div>
    </div>
  );
};
