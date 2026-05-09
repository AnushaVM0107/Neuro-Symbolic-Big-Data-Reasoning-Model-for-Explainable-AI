
import React from 'react';
import type { DashboardData, AIInsightsData } from '../types';
import { KPICard } from './KPICard';
import { ChartComponent } from './ChartComponent';
import { DataTable } from './DataTable';
import { RefreshCwIcon, SparklesIcon } from './IconComponents';
import { AIInsights } from './AIInsights';
import { Loader } from './Loader';

interface DashboardProps {
  data: DashboardData;
  fileName: string;
  onReset: () => void;
  onGetInsights: () => void;
  insightsData: AIInsightsData | null;
  isInsightsLoading: boolean;
  insightsError: string | null;
}

export const Dashboard: React.FC<DashboardProps> = ({
  data,
  fileName,
  onReset,
  onGetInsights,
  insightsData,
  isInsightsLoading,
  insightsError
}) => {
  return (
    <div className="space-y-12 animate-fade-in pb-20">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 glass p-6 rounded-[2.5rem] border-white/40">
        <div>
          <h2 className="text-3xl font-black text-slate-800 font-heading tracking-tight">
            Analysis Dashboard
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <p className="text-slate-500 font-semibold text-sm">Active Session: <span className="text-indigo-600 underline underline-offset-4 decoration-indigo-200">{fileName}</span></p>
          </div>
        </div>
        <button
          onClick={onReset}
          className="group flex items-center justify-center gap-3 bg-white text-slate-700 font-bold py-3.5 px-6 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-200 hover:text-indigo-600 hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300"
        >
          <RefreshCwIcon className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700 ease-in-out" />
          <span>New Analysis</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.kpis.map((kpi, index) => (
          <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <KPICard {...kpi} />
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <div className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
          <h3 className="text-2xl font-black text-slate-800 font-heading tracking-tight">Visual Analysis</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {data.charts.map((chartInfo, index) => (
            <div key={index} className="glass-card p-8 rounded-[2.5rem] animate-fade-in-up" style={{ animationDelay: `${(index + 3) * 0.1}s` }}>
              <div className="mb-6">
                <h4 className="text-lg font-bold text-slate-800 font-heading mb-1">{chartInfo.title}</h4>
                <div className="w-12 h-1 bg-indigo-100 rounded-full"></div>
              </div>
              <ChartComponent {...chartInfo} />
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="relative overflow-hidden p-1 rounded-[3rem] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-2xl shadow-indigo-100 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
        <div className="bg-white/95 backdrop-blur-xl p-8 sm:p-12 rounded-[2.9rem]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-indigo-50 pb-10 mb-10">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-widest border border-indigo-100">
                <SparklesIcon className="w-3.5 h-3.5" />
                <span>AI Core Engine</span>
              </div>
              <h3 className="text-3xl font-black text-slate-800 font-heading tracking-tight flex items-center gap-3 text-gradient">
                Intelligent Reasoning
              </h3>
              <p className="text-slate-500 font-medium max-w-xl">
                Our Neural-Symbolic Reasoning engine analyzes patterns and anomalies to provide structural insights from your data.
              </p>
            </div>
            <button
              onClick={onGetInsights}
              disabled={isInsightsLoading}
              className="w-full md:w-auto btn-primary flex items-center justify-center gap-3 text-white font-black py-4 px-10 rounded-[1.5rem] shadow-xl shadow-indigo-200/50 hover:-translate-y-1 active:scale-95 disabled:bg-slate-300 disabled:shadow-none transition-all duration-300"
            >
              {isInsightsLoading ? (
                <>
                  <Loader className="w-5 h-5" />
                  <span className="animate-pulse">Reasoning...</span>
                </>
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5" />
                  <span>Generate AI Insights</span>
                </>
              )}
            </button>
          </div>

          <div className="min-h-[120px]">
            {isInsightsLoading && (
              <div className="flex flex-col items-center justify-center py-16 space-y-6">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 border-4 border-indigo-50 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-t-indigo-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-4 bg-indigo-50 rounded-full animate-pulse flex items-center justify-center">
                    <SparklesIcon className="w-6 h-6 text-indigo-400" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-indigo-600 font-black text-lg font-heading tracking-tight">AI is Thinking...</p>
                  <p className="text-slate-400 text-sm font-medium mt-1">Cross-referencing symbolic patterns with statistical data</p>
                </div>
              </div>
            )}

            {insightsError && (
              <div className="bg-red-50 border border-red-100 rounded-[2rem] p-8 text-center animate-fade-in">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-red-800 font-black text-xl font-heading mb-2">Analysis Interrupted</p>
                <p className="text-red-600/70 font-medium">{insightsError}</p>
              </div>
            )}

            {insightsData && (
              <div className="animate-fade-in-up">
                <AIInsights data={insightsData} />
              </div>
            )}

            {!isInsightsLoading && !insightsData && !insightsError && (
              <div className="text-center py-12 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
                  <SparklesIcon className="w-8 h-8 text-indigo-400 opacity-50" />
                </div>
                <p className="text-slate-400 font-bold font-heading text-lg">Ready for AI Analysis</p>
                <p className="text-slate-400/60 text-sm font-medium">Click the button above to start building the reasoning model.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Data Table Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <div className="w-2 h-8 bg-slate-200 rounded-full group-hover:bg-slate-400 transition-colors"></div>
          <h3 className="text-2xl font-black text-slate-800 font-heading tracking-tight">Structured Data</h3>
        </div>
        <div className="glass-card overflow-hidden rounded-[2.5rem]">
          <DataTable data={data.tableData} />
        </div>
      </div>
    </div>
  );
};