export interface Salary {
  id: string;
  name: string;
  amount: number;
}

export interface FixedCharge {
  id: string;
  description: string;
  amount: number;
}

export interface ExceptionalExpense {
  id: string;
  description: string;
  amount: number;
  date: string;
}

export type ProjectStatus = 'en-cours' | 'termine' | 'en-pause';

export interface Project {
  id: string;
  name: string;
  totalBudget: number;          // Budget total du projet (n'impacte pas le reste à vivre)
  monthlyAllocation: number;     // Montant alloué ce mois (impacte le reste à vivre)
  status: ProjectStatus;
  createdAt: string;
}

export interface MonthlyData {
  id: string;
  month: string;
  salaries: Salary[];
  fixedCharges: FixedCharge[];
  exceptionalExpenses: ExceptionalExpense[];
  projects: Project[];
  createdAt: string;
  updatedAt: string;
}

export interface BudgetCalculations {
  totalIncome: number;
  totalFixedCharges: number;
  totalExceptionalExpenses: number;
  totalProjectsAllocated: number;
  restToLive: number;
  colorStatus: 'success' | 'warning' | 'danger';
  percentageRemaining: number;
}
