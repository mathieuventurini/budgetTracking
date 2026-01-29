import React from 'react';
import { Wallet, History } from 'lucide-react';
import { Button } from '../ui/Button';
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
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Wallet size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Budget mensuel</h1>
              <p className="text-white/80 text-sm">{formatMonth(currentMonth)}</p>
            </div>
          </div>

          <button
            onClick={onShowHistory}
            className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
          >
            <History size={20} />
            {showingHistory ? 'Voir le budget' : 'Historique'}
          </button>
        </div>
      </div>
    </header>
  );
};
