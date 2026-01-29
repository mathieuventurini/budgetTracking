import React from 'react';
import {
  DollarSign,
  FileText,
  ShoppingBag,
  FolderKanban,
  Wallet,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { useBudget } from '../../contexts/BudgetContext';
import { formatCurrency } from '../../utils/formatters';

export const MonthOverview: React.FC = () => {
  const { calculations } = useBudget();
  const {
    totalIncome,
    totalFixedCharges,
    totalExceptionalExpenses,
    totalProjectsAllocated,
    restToLive,
  } = calculations;

  const cards = [
    {
      label: 'Revenus',
      value: totalIncome,
      icon: <DollarSign size={24} />,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Charges fixes',
      value: totalFixedCharges,
      icon: <FileText size={24} />,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      label: 'Dépenses',
      value: totalExceptionalExpenses,
      icon: <ShoppingBag size={24} />,
      color: 'text-danger',
      bgColor: 'bg-danger/10',
    },
    {
      label: 'Projets',
      value: totalProjectsAllocated,
      icon: <FolderKanban size={24} />,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Summary cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <Card key={index} className="flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className={`p-3 rounded-lg ${card.bgColor}`}>
              <div className={card.color}>{card.icon}</div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-textLight font-medium">{card.label}</p>
              <p className={`text-2xl font-bold ${card.color}`}>
                {formatCurrency(card.value)}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Reste à vivre highlight */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-primary/20 rounded-xl">
              <Wallet className="text-primary" size={32} />
            </div>
            <div>
              <p className="text-lg text-text font-medium">Reste à vivre</p>
              <p className="text-sm text-textLight">Après toutes les dépenses</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-primary">
              {formatCurrency(restToLive)}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
