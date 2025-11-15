// services/fraud.ts
import { PrismaClient, Transaction } from "@prisma/client";

const prisma = new PrismaClient();

export interface FraudResult {
  fraudFlag: boolean;
  riskScore: number;
  fraudReasons: string[];
}

/**
 * Simple explainable fraud rules:
 * - Amount > 3× user average
 * - More than 5 tx in last 10 minutes
 * - Unusual time (1am–5am)
 */
export async function checkFraud(
  userId: number,
  tx: Transaction
): Promise<FraudResult> {
  const history = await prisma.transaction.findMany({
    where: { userId },
  });

  const avg =
    history.reduce((sum, t) => sum + t.amount, 0) /
    (history.length || 1);

  let score = 0;
  const reasons: string[] = [];

  // Rule 1 — amount unusually high
  if (tx.amount > avg * 3) {
    score += 40;
    reasons.push("Amount is much higher than usual.");
  }

  // Rule 2 — too many transactions in a short window
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  const recent = history.filter(
    (t) => new Date(t.createdAt) > tenMinutesAgo
  );

  if (recent.length > 5) {
    score += 40;
    reasons.push("Many transactions in a short time.");
  }

  // Rule 3 — overnight transactions
  const hour = new Date(tx.createdAt).getHours();
  if (hour >= 1 && hour <= 5) {
    score += 20;
    reasons.push("Purchase at unusual time (1am–5am).");
  }

  const fraudFlag = score > 70;

  return {
    fraudFlag,
    riskScore: score,
    fraudReasons: reasons,
  };
}
