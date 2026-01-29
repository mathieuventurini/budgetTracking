import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Wallet } from 'lucide-react';
import { Card } from '../ui/Card';
import { useBudget } from '../../contexts/BudgetContext';
import { formatCurrency } from '../../utils/formatters';

export const RestToLiveGauge: React.FC = () => {
  const { calculations, monthlyData } = useBudget();
  const { restToLive, colorStatus, percentageRemaining } = calculations;

  // Vérifie si les deux salaires ont été renseignés
  const areSalariesEntered = monthlyData?.salaries.every(salary => salary.amount > 0) ?? false;

  const getStatusConfig = () => {
    // Si les salaires ne sont pas renseignés, affiche un message neutre
    if (!areSalariesEntered) {
      return {
        color: 'text-gray-500',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-300',
        icon: <Wallet size={48} />,
        message: 'En attente des salaires',
      };
    }

    switch (colorStatus) {
      case 'success':
        return {
          color: 'text-success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success',
          icon: <TrendingUp size={48} />,
          message: 'Situation financière saine',
        };
      case 'warning':
        return {
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning',
          icon: <AlertTriangle size={48} />,
          message: 'Attention aux dépenses',
        };
      case 'danger':
        return {
          color: 'text-danger',
          bgColor: 'bg-danger/10',
          borderColor: 'border-danger',
          icon: <TrendingDown size={48} />,
          message: restToLive < 0 ? 'Budget dépassé' : 'Budget très serré',
        };
    }
  };

  const config = getStatusConfig();

  // Calcul pour la jauge circulaire
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const progressPercentage = Math.max(0, Math.min(percentageRemaining, 100));
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <Card className="text-center space-y-6">
      <h2 className="text-2xl font-bold text-text">Reste à vivre</h2>

      {/* Circular gauge */}
      <div className="relative inline-flex items-center justify-center">
        <svg width="280" height="280" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="140"
            cy="140"
            r={radius}
            stroke="#E5E7EB"
            strokeWidth="20"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="140"
            cy="140"
            r={radius}
            stroke={`var(--color-${colorStatus})`}
            strokeWidth="20"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              '--color-success': '#10B981',
              '--color-warning': '#F59E0B',
              '--color-danger': '#EF4444',
            } as any}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`${config.color} mb-2`}>
            {config.icon}
          </div>
          <p className={`text-4xl font-bold ${config.color}`}>
            {formatCurrency(restToLive)}
          </p>
          <p className="text-sm text-textLight mt-2">
            {percentageRemaining.toFixed(1)}% des revenus
          </p>
        </div>
      </div>

      {/* Status message */}
      <div className={`p-4 ${config.bgColor} ${config.borderColor} border-2 rounded-xl`}>
        <p className={`font-semibold ${config.color}`}>
          {config.message}
        </p>
      </div>
    </Card>
  );
};
