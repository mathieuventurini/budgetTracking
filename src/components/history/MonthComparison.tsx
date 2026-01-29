import React, { useMemo } from 'react';
import { History, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from '../ui/Card';
import { useBudget } from '../../contexts/BudgetContext';
import { formatCurrency, formatMonthShort } from '../../utils/formatters';
import { calculateBudget } from '../../utils/calculations';
import { MONTHS_TO_KEEP } from '../../utils/constants';

export const MonthComparison: React.FC = () => {
  const { getHistory } = useBudget();

  const comparisonData = useMemo(() => {
    const history = getHistory(MONTHS_TO_KEEP);

    return history.reverse().map((monthData, index, array) => {
      const calculations = calculateBudget(
        monthData.salaries,
        monthData.fixedCharges,
        monthData.exceptionalExpenses,
        monthData.projects
      );

      let variation = 0;
      if (index > 0) {
        const prevCalculations = calculateBudget(
          array[index - 1].salaries,
          array[index - 1].fixedCharges,
          array[index - 1].exceptionalExpenses,
          array[index - 1].projects
        );
        variation = calculations.restToLive - prevCalculations.restToLive;
      }

      return {
        month: formatMonthShort(monthData.month),
        revenus: calculations.totalIncome,
        charges: calculations.totalFixedCharges,
        depenses: calculations.totalExceptionalExpenses,
        projets: calculations.totalProjectsAllocated,
        reste: calculations.restToLive,
        variation,
        colorStatus: calculations.colorStatus,
      };
    });
  }, [getHistory]);

  const getVariationIcon = (variation: number) => {
    if (variation > 0) return <TrendingUp size={16} className="text-success" />;
    if (variation < 0) return <TrendingDown size={16} className="text-danger" />;
    return <Minus size={16} className="text-textLight" />;
  };

  const getVariationColor = (variation: number) => {
    if (variation > 0) return 'text-success';
    if (variation < 0) return 'text-danger';
    return 'text-textLight';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-success/10 text-success';
      case 'warning':
        return 'bg-warning/10 text-warning';
      case 'danger':
        return 'bg-danger/10 text-danger';
      default:
        return 'bg-gray-100 text-text';
    }
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-lg">
          <History className="text-primary" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-text">Historique comparatif</h2>
          <p className="text-sm text-textLight">Derniers 6 mois</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 font-semibold text-text">Mois</th>
              <th className="text-right py-3 px-2 font-semibold text-text">Revenus</th>
              <th className="text-right py-3 px-2 font-semibold text-text">Charges</th>
              <th className="text-right py-3 px-2 font-semibold text-text">Dépenses</th>
              <th className="text-right py-3 px-2 font-semibold text-text">Projets</th>
              <th className="text-right py-3 px-2 font-semibold text-text">Reste</th>
              <th className="text-right py-3 px-2 font-semibold text-text">Variation</th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((row, index) => (
              <tr
                key={row.month}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-2 font-medium text-text">{row.month}</td>
                <td className="text-right py-3 px-2 text-success">
                  {formatCurrency(row.revenus)}
                </td>
                <td className="text-right py-3 px-2 text-warning">
                  {formatCurrency(row.charges)}
                </td>
                <td className="text-right py-3 px-2 text-danger">
                  {formatCurrency(row.depenses)}
                </td>
                <td className="text-right py-3 px-2 text-primary">
                  {formatCurrency(row.projets)}
                </td>
                <td className="text-right py-3 px-2">
                  <span className={`inline-block px-2 py-1 rounded-lg font-semibold ${getStatusColor(row.colorStatus)}`}>
                    {formatCurrency(row.reste)}
                  </span>
                </td>
                <td className="text-right py-3 px-2">
                  {index > 0 && (
                    <div className={`flex items-center justify-end gap-1 ${getVariationColor(row.variation)}`}>
                      {getVariationIcon(row.variation)}
                      <span className="font-medium">
                        {Math.abs(row.variation).toFixed(0)}€
                      </span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
