
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { Loader } from './components/Loader';
import { Dashboard } from './components/Dashboard';
import { analyzeCsvForDashboard } from './services/localAnalysisService';
import { getAIInsights } from './services/analysisService';
import type { DashboardData, AIInsightsData } from './types';
import { SparklesIcon } from './components/IconComponents';

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [csvContent, setCsvContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  const [insights, setInsights] = useState<AIInsightsData | null>(null);
  const [isInsightsLoading, setIsLoadingInsights] = useState<boolean>(false);
  const [insightsError, setInsightsError] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setFileName(selectedFile.name);
    setDashboardData(null);
    setError(null);
    setCsvContent(null);
    setInsights(null);
    setInsightsError(null);
  };

  const handleAnalyzeClick = useCallback(async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setDashboardData(null);
    setInsights(null);
    setInsightsError(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        if (event.target && typeof event.target.result === 'string') {
          const content = event.target.result;
          setCsvContent(content);
          const result = await analyzeCsvForDashboard(content);
          setDashboardData(result);
        } else {
          throw new Error('Failed to read file content.');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(`Analysis failed: ${errorMessage}`);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      setError('Error reading file.');
      setIsLoading(false);
    };
    reader.readAsText(file);
  }, [file]);

  const handleGetInsights = useCallback(async () => {
    if (!csvContent) {
      setInsightsError("CSV data is not available to analyze.");
      return;
    }
    setIsLoadingInsights(true);
    setInsightsError(null);
    setInsights(null);
    try {
      const result = await getAIInsights(csvContent);
      setInsights(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred with the AI service.';
      setInsightsError(errorMessage);
      console.error(err);
    } finally {
      setIsLoadingInsights(false);
    }
  }, [csvContent]);

  const resetState = () => {
    setFile(null);
    setFileName(null);
    setDashboardData(null);
    setError(null);
    setIsLoading(false);
    setCsvContent(null);
    setInsights(null);
    setInsightsError(null);
    setIsLoadingInsights(false);
  }

  return (
    <div className="min-h-screen font-sans text-slate-800">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {!dashboardData ? (
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-4 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold border border-indigo-100 mb-2">
                <SparklesIcon className="w-4 h-4" />
                <span>Next-Gen Data Analysis</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tight leading-tight">
                Turn your <span className="text-gradient">CSV Data</span> into <br />
                Actionable Insights.
              </h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
                Upload your datasets and let our Neural-Symbolic Reasoning engine
                provide you with a comprehensive dashboard and AI-driven deep analysis.
              </p>
            </div>

            <div className="max-w-3xl mx-auto glass-card p-1 sm:p-2 rounded-[2.5rem]">
              <div className="bg-white/80 p-8 sm:p-10 rounded-[2.25rem] shadow-xl">
                <div className="flex flex-col items-stretch gap-6">
                  <FileUpload onFileSelect={handleFileSelect} fileName={fileName} isLoading={isLoading} />

                  <button
                    onClick={handleAnalyzeClick}
                    disabled={!file || isLoading}
                    className="w-full btn-primary text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-indigo-200 flex items-center justify-center gap-3 disabled:bg-slate-300 disabled:shadow-none transition-all duration-300 hover:-translate-y-1"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="w-5 h-5" />
                        <span>Processing Dataset...</span>
                      </>
                    ) : (
                      <>
                        <span>Generate Dashboard</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </button>

                  {error && (
                    <div className="animate-fade-in-up text-red-600 bg-red-50 border border-red-100 rounded-xl p-4 text-center font-medium">
                      {error}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              {[
                { title: 'Local Processing', desc: 'Secure data analysis right in your browser.', icon: '🔒' },
                { title: 'Interactive Charts', desc: 'Dynamic visualizations with Chart.js.', icon: '📊' },
                { title: 'AI Reasoning', desc: 'Deep insights with Gemini AI technology.', icon: '🧠' }
              ].map((feature, i) => (
                <div key={i} className="glass-card p-6 rounded-3xl text-center space-y-3">
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold font-heading">{feature.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            <Dashboard
              data={dashboardData}
              fileName={fileName || 'CSV Data'}
              onReset={resetState}
              onGetInsights={handleGetInsights}
              insightsData={insights}
              isInsightsLoading={isInsightsLoading}
              insightsError={insightsError}
            />
          </div>
        )}
      </main>

      <footer className="mt-20 border-t border-white/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-gradient font-black text-xl font-heading">Explainable AI</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">
            &copy; {new Date().getFullYear()} Neural-Symbolic Reasoning Platform.
          </p>
        </div>
      </footer>
    </div>
  );
}