import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { useBudget } from '../../contexts/BudgetContext';
import { formatMonth, getCurrentMonth } from '../../utils/formatters';

export const MonthSelector: React.FC = () => {
  const { currentMonth, changeMonth } = useBudget();

  const handlePrevMonth = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    date.setMonth(date.getMonth() - 1);
    const newMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    // Ne pas aller avant février 2026 (démarrage du projet)
    if (newMonth >= '2026-02') {
      changeMonth(newMonth);
    }
  };

  const handleNextMonth = () => {
    const [year, month] = currentMonth.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    date.setMonth(date.getMonth() + 1);
    const newMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    // Ne pas aller au-delà du mois actuel
    const now = getCurrentMonth();
    if (newMonth <= now) {
      changeMonth(newMonth);
    }
  };

  const handleCurrentMonth = () => {
    changeMonth(getCurrentMonth());
  };

  const isCurrentMonth = currentMonth === getCurrentMonth();
  const canGoNext = currentMonth < getCurrentMonth();
  const canGoPrev = currentMonth > '2026-02';

  return (
    <div className="flex items-center justify-center gap-4 p-4 bg-surface rounded-xl shadow-md">
      <Button
        variant="secondary"
        size="md"
        onClick={handlePrevMonth}
        disabled={!canGoPrev}
      >
        <ChevronLeft size={20} />
      </Button>

      <div className="text-center min-w-[200px]">
        <h2 className="text-2xl font-bold text-text">
          {formatMonth(currentMonth)}
        </h2>
        {!isCurrentMonth && (
          <button
            onClick={handleCurrentMonth}
            className="text-sm text-primary hover:underline mt-1"
          >
            Revenir au mois actuel
          </button>
        )}
      </div>

      <Button
        variant="secondary"
        size="md"
        onClick={handleNextMonth}
        disabled={!canGoNext}
      >
        <ChevronRight size={20} />
      </Button>
    </div>
  );
};
