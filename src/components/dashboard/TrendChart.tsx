import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { Card } from '../ui/Card';
import { useBudget } from '../../contexts/BudgetContext';
import { formatCurrency, formatMonthShort } from '../../utils/formatters';
import { calculateBudget } from '../../utils/calculations';
import { MONTHS_TO_KEEP } from '../../utils/constants';

export const TrendChart: React.FC = () => {
  const { getHistory } = useBudget();

  const chartData = useMemo(() => {
    const history = getHistory(MONTHS_TO_KEEP);

    return history.reverse().map(monthData => {
      const calculations = calculateBudget(
        monthData.salaries,
        monthData.fixedCharges,
        monthData.exceptionalExpenses,
        monthData.projects
      );

      return {
        month: formatMonthShort(monthData.month),
        restToLive: calculations.restToLive,
        totalIncome: calculations.totalIncome,
      };
    });
  }, [getHistory]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-text mb-1">{payload[0].payload.month}</p>
          <p className="text-sm text-primary">
            Revenus: {formatCurrency(payload[0].payload.totalIncome)}
          </p>
          <p className="text-sm text-success">
            Reste: {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-lg">
          <TrendingUp className="text-primary" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-text">Tendance sur 6 mois</h2>
          <p className="text-sm text-textLight">Évolution du reste à vivre</p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRestToLive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="month"
              stroke="#6B7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#6B7280"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `${Math.round(value)}€`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="restToLive"
              stroke="#10B981"
              strokeWidth={3}
              fill="url(#colorRestToLive)"
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
