
import React from 'react';
import type { AIInsightsData } from '../types';
import { InfoIcon, AlertTriangleIcon } from './IconComponents';

interface AIInsightsProps {
  data: AIInsightsData;
}

export const AIInsights: React.FC<AIInsightsProps> = ({ data }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-indigo-50/50 p-5 rounded-xl border border-indigo-100">
        <h4 className="text-sm font-bold text-indigo-800 uppercase tracking-wider mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
          Summary
        </h4>
        <p className="text-slate-700 text-base leading-relaxed">{data.summary}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50/30 p-5 rounded-xl border border-blue-100/50 h-full">
          <h4 className="text-md font-bold text-slate-800 mb-4 flex items-center">
            <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg mr-3">
              <InfoIcon className="w-5 h-5" />
            </div>
            Key Observations
          </h4>
          <ul className="space-y-3">
            {data.keyObservations.map((obs, index) => (
              <li key={index} className="flex items-start text-sm text-slate-600">
                <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></span>
                <span className="leading-relaxed">{obs}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-amber-50/30 p-5 rounded-xl border border-amber-100/50 h-full">
          <h4 className="text-md font-bold text-slate-800 mb-4 flex items-center">
            <div className="p-1.5 bg-amber-100 text-amber-600 rounded-lg mr-3">
              <AlertTriangleIcon className="w-5 h-5" />
            </div>
            Data Quality Issues
          </h4>
          {data.dataQualityIssues.length > 0 ? (
            <ul className="space-y-3">
              {data.dataQualityIssues.map((issue, index) => (
                <li key={index} className="flex items-start text-sm text-slate-600">
                  <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-amber-400 rounded-full flex-shrink-0"></span>
                  <span className="leading-relaxed">{issue}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <p className="text-sm font-medium text-slate-600">No major issues detected</p>
              <p className="text-xs text-slate-400 mt-1">Your data looks clean!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};