import React, { useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { useBudget } from '../../contexts/BudgetContext';
import { formatCurrency } from '../../utils/formatters';

export const SalaryInput: React.FC = () => {
  const { monthlyData, updateSalary } = useBudget();
  const [localValues, setLocalValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (monthlyData) {
      const values: Record<string, string> = {};
      monthlyData.salaries.forEach(salary => {
        values[salary.id] = salary.amount.toString();
      });
      setLocalValues(values);
    }
  }, [monthlyData]);

  const handleChange = (id: string, value: string) => {
    setLocalValues(prev => ({ ...prev, [id]: value }));
  };

  const handleBlur = (id: string) => {
    const value = localValues[id] || '0';
    const numValue = parseFloat(value.replace(',', '.').replace(/\s/g, '')) || 0;
    updateSalary(id, numValue);
  };

  if (!monthlyData) return null;

  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-gradient-to-br from-success/20 to-emerald-200/30 rounded-xl shadow-sm">
          <DollarSign className="text-success" size={24} />
        </div>
        <h2 className="text-xl font-bold text-text">Revenus mensuels</h2>
      </div>

      <div className="space-y-4">
        {monthlyData.salaries.map((salary) => (
          <div key={salary.id}>
            <Input
              type="number"
              label={salary.name}
              value={localValues[salary.id] || ''}
              onChange={(e) => handleChange(salary.id, e.target.value)}
              onBlur={() => handleBlur(salary.id)}
              placeholder="0.00"
              step="0.01"
              min="0"
              fullWidth
            />
            {salary.amount > 0 && (
              <p className="mt-1 text-sm text-textLight">
                {formatCurrency(salary.amount)}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-text">Total revenus</span>
          <span className="text-2xl font-bold text-success">
            {formatCurrency(monthlyData.salaries.reduce((sum, s) => sum + s.amount, 0))}
          </span>
        </div>
      </div>
    </Card>
  );
};
