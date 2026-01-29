import React from 'react';
import { Wallet, History } from 'lucide-react';
import { useBudget } from '../../contexts/BudgetContext';
import { formatMonth } from '../../utils/formatters';

interface HeaderProps {
  onShowHistory: () => void;
  showingHistory: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onShowHistory, showingHistory }) => {
  const { currentMonth } = useBudget();

  return (
    <header className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Wallet className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em' }}>
                BUDGET MENSUEL
              </h1>
              <p className="text-white/80 text-xs sm:text-sm">{formatMonth(currentMonth)}</p>
            </div>
          </div>

          <button
            onClick={onShowHistory}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-xl font-medium text-sm sm:text-base"
          >
            <History size={18} />
            <span>{showingHistory ? 'Voir le budget' : 'Historique'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
