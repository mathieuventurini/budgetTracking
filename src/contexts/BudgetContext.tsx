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
import { useFirestore } from '../hooks/useFirestore';
import { useBudgetCalculations } from '../hooks/useBudgetCalculations';

interface BudgetContextType {
  // État
  currentMonth: string;
  monthlyData: MonthlyData | null;
  calculations: BudgetCalculations;
  loading: boolean;
  error: string | null;

  // Navigation
  changeMonth: (month: string) => void;
  getHistory: (n?: number) => Promise<MonthlyData[]>;

  // CRUD Salaires
  updateSalary: (id: string, amount: number) => Promise<void>;

  // CRUD Charges fixes
  addFixedCharge: (description: string, amount: number) => Promise<void>;
  updateFixedCharge: (id: string, description: string, amount: number) => Promise<void>;
  deleteFixedCharge: (id: string) => Promise<void>;

  // CRUD Dépenses
  addExceptionalExpense: (description: string, amount: number, date: string) => Promise<void>;
  updateExceptionalExpense: (id: string, description: string, amount: number, date: string) => Promise<void>;
  deleteExceptionalExpense: (id: string) => Promise<void>;

  // CRUD Projets
  addProject: (name: string, totalBudget: number, monthlyAllocation: number, status: ProjectStatus) => Promise<void>;
  updateProject: (id: string, name: string, totalBudget: number, monthlyAllocation: number, status: ProjectStatus) => Promise<void>;
  updateProjectAllocation: (id: string, monthlyAllocation: number) => Promise<void>;
  updateProjectStatus: (id: string, status: ProjectStatus) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
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
    loading,
    error,
  } = useFirestore();

  const calculations = useBudgetCalculations(monthlyData);

  // CRUD Salaires
  const updateSalary = async (id: string, amount: number) => {
    if (!monthlyData) return;

    const updatedSalaries = monthlyData.salaries.map(salary =>
      salary.id === id ? { ...salary, amount } : salary
    );

    await saveMonthData({
      ...monthlyData,
      salaries: updatedSalaries,
    });
  };

  // CRUD Charges fixes
  const addFixedCharge = async (description: string, amount: number) => {
    if (!monthlyData) return;

    const newCharge: FixedCharge = {
      id: uuidv4(),
      description,
      amount,
    };

    await saveMonthData({
      ...monthlyData,
      fixedCharges: [...monthlyData.fixedCharges, newCharge],
    });
  };

  const updateFixedCharge = async (id: string, description: string, amount: number) => {
    if (!monthlyData) return;

    const updatedCharges = monthlyData.fixedCharges.map(charge =>
      charge.id === id ? { ...charge, description, amount } : charge
    );

    await saveMonthData({
      ...monthlyData,
      fixedCharges: updatedCharges,
    });
  };

  const deleteFixedCharge = async (id: string) => {
    if (!monthlyData) return;

    await saveMonthData({
      ...monthlyData,
      fixedCharges: monthlyData.fixedCharges.filter(charge => charge.id !== id),
    });
  };

  // CRUD Dépenses
  const addExceptionalExpense = async (description: string, amount: number, date: string) => {
    if (!monthlyData) return;

    const newExpense: ExceptionalExpense = {
      id: uuidv4(),
      description,
      amount,
      date,
    };

    await saveMonthData({
      ...monthlyData,
      exceptionalExpenses: [...monthlyData.exceptionalExpenses, newExpense],
    });
  };

  const updateExceptionalExpense = async (id: string, description: string, amount: number, date: string) => {
    if (!monthlyData) return;

    const updatedExpenses = monthlyData.exceptionalExpenses.map(expense =>
      expense.id === id ? { ...expense, description, amount, date } : expense
    );

    await saveMonthData({
      ...monthlyData,
      exceptionalExpenses: updatedExpenses,
    });
  };

  const deleteExceptionalExpense = async (id: string) => {
    if (!monthlyData) return;

    await saveMonthData({
      ...monthlyData,
      exceptionalExpenses: monthlyData.exceptionalExpenses.filter(expense => expense.id !== id),
    });
  };

  // CRUD Projets
  const addProject = async (
    name: string,
    totalBudget: number,
    monthlyAllocation: number,
    status: ProjectStatus
  ) => {
    if (!monthlyData) return;

    const newProject: Project = {
      id: uuidv4(),
      name,
      totalBudget,
      monthlyAllocation,
      status,
      createdAt: new Date().toISOString(),
    };

    await saveMonthData({
      ...monthlyData,
      projects: [...monthlyData.projects, newProject],
    });
  };

  const updateProject = async (
    id: string,
    name: string,
    totalBudget: number,
    monthlyAllocation: number,
    status: ProjectStatus
  ) => {
    if (!monthlyData) return;

    const updatedProjects = monthlyData.projects.map(project =>
      project.id === id
        ? { ...project, name, totalBudget, monthlyAllocation, status }
        : project
    );

    await saveMonthData({
      ...monthlyData,
      projects: updatedProjects,
    });
  };

  const updateProjectAllocation = async (id: string, monthlyAllocation: number) => {
    if (!monthlyData) return;

    const updatedProjects = monthlyData.projects.map(project =>
      project.id === id ? { ...project, monthlyAllocation } : project
    );

    await saveMonthData({
      ...monthlyData,
      projects: updatedProjects,
    });
  };

  const updateProjectStatus = async (id: string, status: ProjectStatus) => {
    if (!monthlyData) return;

    const updatedProjects = monthlyData.projects.map(project =>
      project.id === id ? { ...project, status } : project
    );

    await saveMonthData({
      ...monthlyData,
      projects: updatedProjects,
    });
  };

  const deleteProject = async (id: string) => {
    if (!monthlyData) return;

    await saveMonthData({
      ...monthlyData,
      projects: monthlyData.projects.filter(project => project.id !== id),
    });
  };

  const value: BudgetContextType = {
    currentMonth,
    monthlyData,
    calculations,
    loading,
    error,
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
