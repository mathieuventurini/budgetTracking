import { useMemo } from 'react';
import type { MonthlyData, BudgetCalculations } from '../types';
import { calculateBudget } from '../utils/calculations';

/**
 * Hook personnalisé pour calculer automatiquement les totaux du budget
 */
export const useBudgetCalculations = (
  monthlyData: MonthlyData | null
): BudgetCalculations => {
  return useMemo(() => {
    if (!monthlyData) {
      return {
        totalIncome: 0,
        totalFixedCharges: 0,
        totalExceptionalExpenses: 0,
        totalProjectsAllocated: 0,
        totalProjectsSpent: 0,
        restToLive: 0,
        colorStatus: 'danger',
        percentageRemaining: 0,
      };
    }

    return calculateBudget(
      monthlyData.salaries,
      monthlyData.fixedCharges,
      monthlyData.exceptionalExpenses,
      monthlyData.projects
    );
  }, [monthlyData]);
};
