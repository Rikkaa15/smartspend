
import React from 'react';
import { AIInsight } from '../types';

interface AIInsightsPanelProps {
  insights: AIInsight[];
  isLoading: boolean;
  onRefresh: () => void;
}

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ insights, isLoading, onRefresh }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="text-indigo-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-bold">AI Financial Insights</h3>
        </div>
        <button 
          onClick={onRefresh}
          disabled={isLoading}
          className="text-slate-400 hover:text-indigo-600 disabled:opacity-50 transition-colors"
        >
          <svg className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center py-12 text-slate-400">
            <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-sm">Gemini is analyzing your data...</p>
          </div>
        ) : insights.length === 0 ? (
          <p className="text-slate-400 text-sm italic text-center py-8">
            Add more transactions to get personalized insights.
          </p>
        ) : (
          insights.map((insight, idx) => (
            <div 
              key={idx} 
              className={`p-4 rounded-xl border-l-4 ${
                insight.type === 'saving' ? 'bg-emerald-50 border-emerald-500' :
                insight.type === 'warning' ? 'bg-amber-50 border-amber-500' :
                'bg-blue-50 border-blue-500'
              }`}
            >
              <h4 className="font-bold text-slate-900 text-sm mb-1">{insight.title}</h4>
              <p className="text-slate-600 text-xs leading-relaxed">{insight.content}</p>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-50">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-xl text-white">
          <p className="text-xs opacity-90 font-medium mb-1">PRO TIP</p>
          <p className="text-sm font-semibold leading-snug">
            Try saying "Spent ₹500 on dinner at Barbeque Nation" in the add modal to quickly log expenses!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsPanel;
