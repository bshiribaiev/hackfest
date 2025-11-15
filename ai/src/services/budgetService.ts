import { Budget, Transaction } from "../types/finance";


export async function getUserBudgets(userId: string): Promise<Budget[]> {
  // Stubbed demo budgets for hackathon purposes.
  // In production, fetch from your budgets table by userId.
  return [
    {
      id: "demo-fun-weekly",
      userId,
      category: "shopping",
      period: "weekly",
      limitAmount: 100,
    },
    {
      id: "demo-food-weekly",
      userId,
      category: "food",
      period: "weekly",
      limitAmount: 80,
    },
    {
      id: "demo-overall-weekly",
      userId,
      category: "overall",
      period: "weekly",
      limitAmount: 200,
    },
  ];
}

export async function getRecentTransactions(
  userId: string,
  _days: number = 7,
): Promise<Transaction[]> {
  // Stub transactions. In production, query your transactions table
  // for records within the last N days for this user.
  const now = new Date();
  const isoNow = now.toISOString();

  return [
    {
      id: "t1",
      userId,
      amount: 15,
      category: "food",
      merchant: "Campus Cafe",
      createdAt: isoNow,
    },
    {
      id: "t2",
      userId,
      amount: 20,
      category: "shopping",
      merchant: "Bookstore",
      createdAt: isoNow,
    },
  ];
}


