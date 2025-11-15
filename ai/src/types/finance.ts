export type BudgetPeriod = "weekly" | "monthly";

export interface Budget {
  id: string;
  userId: string;
  category: string;
  period: BudgetPeriod;
  limitAmount: number;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  category: string;
  merchant: string;
  createdAt: string; // ISO string
  source?: string;
  riskScore?: number;
  fraudFlag?: boolean;
  fraudReasons?: string[];
}


