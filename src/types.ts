export type TransactionType = 'income' | 'expense';

export type PaymentMethod = 'cash' | 'transfer' | 'credit_card' | 'other';

export interface Transaction {
  id: string;
  userId: string;
  userEmail?: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  note?: string;
  paymentMethod?: PaymentMethod;
  createdAt: string;
  updatedAt?: string;
}

export interface CategoryInfo {
  id: string;
  label: string;
  type: TransactionType;
  iconName: string;
  color: string;
  bgColor: string;
}

export interface MonthlySummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  savingsRate: number;
  transactionCount: number;
  averageDailyExpense: number;
  highestExpenseCategory: {
    category: string;
    amount: number;
  } | null;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  color: string;
  count: number;
}

export interface DailyComparison {
  day: number;
  dateString: string;
  income: number;
  expense: number;
}

export interface MonthlyTrendData {
  monthKey: string; // YYYY-MM
  monthLabel: string;
  income: number;
  expense: number;
  savings: number;
}

export interface MonthlyBudget {
  id?: string;
  userId: string;
  month: string; // YYYY-MM
  budgetAmount: number;
}
