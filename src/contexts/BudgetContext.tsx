import React, { createContext, useContext, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type {
  MonthlyData,
  FixedCharge,
  ExceptionalExpense,
  Project,
  BudgetCalculations,
  ProjectStatus,
} from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useBudgetCalculations } from '../hooks/useBudgetCalculations';

interface BudgetContextType {
  // État
  currentMonth: string;
  monthlyData: MonthlyData | null;
  calculations: BudgetCalculations;

  // Navigation
  changeMonth: (month: string) => void;
  getHistory: (n?: number) => MonthlyData[];

  // CRUD Salaires
  updateSalary: (id: string, amount: number) => void;

  // CRUD Charges fixes
  addFixedCharge: (description: string, amount: number) => void;
  updateFixedCharge: (id: string, description: string, amount: number) => void;
  deleteFixedCharge: (id: string) => void;

  // CRUD Dépenses exceptionnelles
  addExceptionalExpense: (description: string, amount: number, date: string) => void;
  updateExceptionalExpense: (id: string, description: string, amount: number, date: string) => void;
  deleteExceptionalExpense: (id: string) => void;

  // CRUD Projets
  addProject: (name: string, totalBudget: number, totalSpent: number, monthlyAllocation: number, status: ProjectStatus) => void;
  updateProject: (id: string, name: string, totalBudget: number, totalSpent: number, monthlyAllocation: number, status: ProjectStatus) => void;
  updateProjectAllocation: (id: string, monthlyAllocation: number) => void;
  updateProjectStatus: (id: string, status: ProjectStatus) => void;
  deleteProject: (id: string) => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget doit être utilisé à l\'intérieur d\'un BudgetProvider');
  }
  return context;
};

interface BudgetProviderProps {
  children: ReactNode;
}

export const BudgetProvider: React.FC<BudgetProviderProps> = ({ children }) => {
  const {
    currentMonth,
    monthlyData,
    saveMonthData,
    changeMonth,
    getHistory,
  } = useLocalStorage();

  const calculations = useBudgetCalculations(monthlyData);

  // CRUD Salaires
  const updateSalary = (id: string, amount: number) => {
    if (!monthlyData) return;

    const updatedSalaries = monthlyData.salaries.map(salary =>
      salary.id === id ? { ...salary, amount } : salary
    );

    saveMonthData({
      ...monthlyData,
      salaries: updatedSalaries,
    });
  };

  // CRUD Charges fixes
  const addFixedCharge = (description: string, amount: number) => {
    if (!monthlyData) return;

    const newCharge: FixedCharge = {
      id: uuidv4(),
      description,
      amount,
    };

    saveMonthData({
      ...monthlyData,
      fixedCharges: [...monthlyData.fixedCharges, newCharge],
    });
  };

  const updateFixedCharge = (id: string, description: string, amount: number) => {
    if (!monthlyData) return;

    const updatedCharges = monthlyData.fixedCharges.map(charge =>
      charge.id === id ? { ...charge, description, amount } : charge
    );

    saveMonthData({
      ...monthlyData,
      fixedCharges: updatedCharges,
    });
  };

  const deleteFixedCharge = (id: string) => {
    if (!monthlyData) return;

    saveMonthData({
      ...monthlyData,
      fixedCharges: monthlyData.fixedCharges.filter(charge => charge.id !== id),
    });
  };

  // CRUD Dépenses exceptionnelles
  const addExceptionalExpense = (description: string, amount: number, date: string) => {
    if (!monthlyData) return;

    const newExpense: ExceptionalExpense = {
      id: uuidv4(),
      description,
      amount,
      date,
    };

    saveMonthData({
      ...monthlyData,
      exceptionalExpenses: [...monthlyData.exceptionalExpenses, newExpense],
    });
  };

  const updateExceptionalExpense = (id: string, description: string, amount: number, date: string) => {
    if (!monthlyData) return;

    const updatedExpenses = monthlyData.exceptionalExpenses.map(expense =>
      expense.id === id ? { ...expense, description, amount, date } : expense
    );

    saveMonthData({
      ...monthlyData,
      exceptionalExpenses: updatedExpenses,
    });
  };

  const deleteExceptionalExpense = (id: string) => {
    if (!monthlyData) return;

    saveMonthData({
      ...monthlyData,
      exceptionalExpenses: monthlyData.exceptionalExpenses.filter(expense => expense.id !== id),
    });
  };

  // CRUD Projets
  const addProject = (
    name: string,
    totalBudget: number,
    totalSpent: number,
    monthlyAllocation: number,
    status: ProjectStatus
  ) => {
    if (!monthlyData) return;

    const newProject: Project = {
      id: uuidv4(),
      name,
      totalBudget,
      totalSpent,
      monthlyAllocation,
      status,
      createdAt: new Date().toISOString(),
    };

    saveMonthData({
      ...monthlyData,
      projects: [...monthlyData.projects, newProject],
    });
  };

  const updateProject = (
    id: string,
    name: string,
    totalBudget: number,
    totalSpent: number,
    monthlyAllocation: number,
    status: ProjectStatus
  ) => {
    if (!monthlyData) return;

    const updatedProjects = monthlyData.projects.map(project =>
      project.id === id
        ? { ...project, name, totalBudget, totalSpent, monthlyAllocation, status }
        : project
    );

    saveMonthData({
      ...monthlyData,
      projects: updatedProjects,
    });
  };

  const updateProjectAllocation = (id: string, monthlyAllocation: number) => {
    if (!monthlyData) return;

    const updatedProjects = monthlyData.projects.map(project =>
      project.id === id ? { ...project, monthlyAllocation } : project
    );

    saveMonthData({
      ...monthlyData,
      projects: updatedProjects,
    });
  };

  const updateProjectStatus = (id: string, status: ProjectStatus) => {
    if (!monthlyData) return;

    const updatedProjects = monthlyData.projects.map(project =>
      project.id === id ? { ...project, status } : project
    );

    saveMonthData({
      ...monthlyData,
      projects: updatedProjects,
    });
  };

  const deleteProject = (id: string) => {
    if (!monthlyData) return;

    saveMonthData({
      ...monthlyData,
      projects: monthlyData.projects.filter(project => project.id !== id),
    });
  };

  const value: BudgetContextType = {
    currentMonth,
    monthlyData,
    calculations,
    changeMonth,
    getHistory,
    updateSalary,
    addFixedCharge,
    updateFixedCharge,
    deleteFixedCharge,
    addExceptionalExpense,
    updateExceptionalExpense,
    deleteExceptionalExpense,
    addProject,
    updateProject,
    updateProjectAllocation,
    updateProjectStatus,
    deleteProject,
  };

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
};
