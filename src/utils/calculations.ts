import type {
  Salary,
  FixedCharge,
  ExceptionalExpense,
  Project,
  BudgetCalculations
} from '../types';
import { THRESHOLDS } from './constants';

/**
 * Calcule le total des revenus (salaires)
 */
export const calculateTotalIncome = (salaries: Salary[]): number => {
  return salaries.reduce((sum, salary) => sum + salary.amount, 0);
};

/**
 * Calcule le total des charges fixes
 */
export const calculateTotalFixedCharges = (charges: FixedCharge[]): number => {
  return charges.reduce((sum, charge) => sum + charge.amount, 0);
};

/**
 * Calcule le total des dépenses exceptionnelles
 */
export const calculateTotalExceptionalExpenses = (expenses: ExceptionalExpense[]): number => {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
};

/**
 * Calcule le total des allocations mensuelles aux projets (impacte le reste à vivre)
 */
export const calculateTotalProjectsAllocated = (projects: Project[]): number => {
  return projects.reduce((sum, project) => sum + project.monthlyAllocation, 0);
};

/**
 * Calcule le total des montants dépensés sur les projets (tous les mois cumulés)
 */
export const calculateTotalProjectsSpent = (projects: Project[]): number => {
  return projects.reduce((sum, project) => sum + project.totalSpent, 0);
};

/**
 * Calcule le reste à vivre
 */
export const calculateRestToLive = (
  totalIncome: number,
  totalFixedCharges: number,
  totalExceptionalExpenses: number,
  totalProjectsAllocated: number
): number => {
  return totalIncome - totalFixedCharges - totalExceptionalExpenses - totalProjectsAllocated;
};

/**
 * Détermine le statut de couleur en fonction du reste à vivre
 */
export const getColorStatus = (
  restToLive: number,
  totalIncome: number
): 'success' | 'warning' | 'danger' => {
  if (totalIncome === 0) return 'danger';

  const percentage = (restToLive / totalIncome) * 100;

  if (percentage > THRESHOLDS.GREEN) return 'success';
  if (percentage > THRESHOLDS.ORANGE) return 'warning';
  return 'danger';
};

/**
 * Calcule le pourcentage restant par rapport aux revenus
 */
export const calculatePercentageRemaining = (
  restToLive: number,
  totalIncome: number
): number => {
  if (totalIncome === 0) return 0;
  return (restToLive / totalIncome) * 100;
};

/**
 * Calcule tous les totaux et métriques du budget
 */
export const calculateBudget = (
  salaries: Salary[],
  fixedCharges: FixedCharge[],
  exceptionalExpenses: ExceptionalExpense[],
  projects: Project[]
): BudgetCalculations => {
  const totalIncome = calculateTotalIncome(salaries);
  const totalFixedCharges = calculateTotalFixedCharges(fixedCharges);
  const totalExceptionalExpenses = calculateTotalExceptionalExpenses(exceptionalExpenses);
  const totalProjectsAllocated = calculateTotalProjectsAllocated(projects);
  const totalProjectsSpent = calculateTotalProjectsSpent(projects);
  const restToLive = calculateRestToLive(
    totalIncome,
    totalFixedCharges,
    totalExceptionalExpenses,
    totalProjectsAllocated
  );
  const colorStatus = getColorStatus(restToLive, totalIncome);
  const percentageRemaining = calculatePercentageRemaining(restToLive, totalIncome);

  return {
    totalIncome,
    totalFixedCharges,
    totalExceptionalExpenses,
    totalProjectsAllocated,
    totalProjectsSpent,
    restToLive,
    colorStatus,
    percentageRemaining,
  };
};
