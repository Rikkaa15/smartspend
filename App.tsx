
import React, { useState, useEffect, useCallback } from 'react';
import { Transaction, Category, AIInsight } from './types';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import AIInsightsPanel from './components/AIInsightsPanel';
import AddTransactionModal from './components/AddTransactionModal';
import { getAIInsights } from './services/geminiService';

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', amount: 45.50, category: Category.FOOD, description: 'Lunch at Joe\'s', date: '2024-05-15' },
  { id: '2', amount: 1200, category: Category.BILLS, description: 'Rent', date: '2024-05-01' },
  { id: '3', amount: 65.00, category: Category.SHOPPING, description: 'New Sneakers', date: '2024-05-10' },
  { id: '4', amount: 15.20, category: Category.TRANSPORT, description: 'Uber ride', date: '2024-05-12' },
  { id: '5', amount: 30.00, category: Category.ENTERTAINMENT, description: 'Movie tickets', date: '2024-05-14' },
];

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('smartspend_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  useEffect(() => {
    localStorage.setItem('smartspend_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const fetchInsights = useCallback(async () => {
    if (transactions.length === 0) return;
    setIsLoadingInsights(true);
    const result = await getAIInsights(transactions);
    setInsights(result);
    setIsLoadingInsights(false);
  }, [transactions]);

  useEffect(() => {
    fetchInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...t, id: Math.random().toString(36).substr(2, 9) };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-indigo-900">SmartSpend</h1>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full font-medium flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Expense
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Dashboard & Chart */}
        <div className="lg:col-span-2 space-y-8">
          <Dashboard transactions={transactions} />
          <TransactionList transactions={transactions} onDelete={deleteTransaction} />
        </div>

        {/* Right Column: AI Insights */}
        <div className="space-y-8">
          <AIInsightsPanel 
            insights={insights} 
            isLoading={isLoadingInsights} 
            onRefresh={fetchInsights}
          />
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <AddTransactionModal 
          onClose={() => setIsModalOpen(false)} 
          onAdd={addTransaction} 
        />
      )}
    </div>
  );
}
