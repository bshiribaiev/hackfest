import { DailyAdviceResponse } from "../types/ai";

const SAFE_TIPS: string[] = [
  "Try to save a small, fixed amount from each paycheck to slowly build an emergency fund.",
  "Avoid carrying high-interest credit card debt; paying it down early can save you a lot in interest.",
  "Before spending on wants, make sure essentials like rent, food, and transport are covered.",
  "Compare prices and student discounts before big purchases to avoid overpaying.",
  "Set a simple monthly savings goal and track your progress to stay motivated.",
  "Understand any fees on your bank accounts or cards so you can avoid unnecessary charges.",
  "Building a habit of saving is more important than the amount; even a few dollars a week adds up.",
  "Keep a basic budget of your income and key expenses so you always know what you can safely spend.",
  "Try to keep a small cash buffer in your account to avoid overdraft fees.",
  "Think in terms of trade-offs: buying one thing now may mean skipping something more important later.",
];

function pickTipForDate(date: Date): string {
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();

  // Simple deterministic hash to pick a tip for the day.
  const hash = (day + month * 31 + year) % SAFE_TIPS.length;
  return SAFE_TIPS[hash];
}

export function getDailyInvestmentAdvice(date: Date = new Date()): DailyAdviceResponse {
  const tip = pickTipForDate(date);

  return {
    date: date.toISOString().slice(0, 10),
    tip,
  };
}


