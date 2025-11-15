import { PurchaseAdviceRequest, PurchaseAdviceResponse } from "../types/ai";
import { Budget, Transaction } from "../types/finance";
import { getUserBudgets, getRecentTransactions } from "../services/budgetService";
import { generateChatJsonResponse } from "../clients/llmClient";

interface BudgetContext {
  category: string;
  period: string;
  limitAmount: number;
  spentSoFar: number;
  remaining: number;
}

interface AdvisorContextJson {
  userId: string;
  message: string;
  price: number | null;
  category: string;
  budgets: BudgetContext[];
  overallWeeklyRemaining: number | null;
  recentTransactionCount: number;
  totalSpentLastWeek: number;
}

function calculateBudgetUsage(
  budgets: Budget[],
  transactions: Transaction[],
  category: string,
): { budgetContexts: BudgetContext[]; overallWeeklyRemaining: number | null; totalSpentLastWeek: number } {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const recent = transactions.filter((t) => new Date(t.createdAt) >= oneWeekAgo);

  const totalSpentLastWeek = recent.reduce((sum, t) => sum + t.amount, 0);

  const budgetContexts: BudgetContext[] = budgets
    .filter((b) => b.period === "weekly")
    .map((b) => {
      const spent = recent
        .filter((t) => (b.category === "overall" ? true : t.category === b.category))
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        category: b.category,
        period: b.period,
        limitAmount: b.limitAmount,
        spentSoFar: spent,
        remaining: Math.max(0, b.limitAmount - spent),
      };
    });

  const overallBudget = budgetContexts.find((b) => b.category === "overall");

  return {
    budgetContexts,
    overallWeeklyRemaining: overallBudget ? overallBudget.remaining : null,
    totalSpentLastWeek,
  };
}

function buildAdvisorContextJson(
  input: PurchaseAdviceRequest,
  budgets: Budget[],
  transactions: Transaction[],
): AdvisorContextJson {
  const category = input.category ?? "general";
  const { budgetContexts, overallWeeklyRemaining, totalSpentLastWeek } =
    calculateBudgetUsage(budgets, transactions, category);

  return {
    userId: input.userId,
    message: input.message,
    price: typeof input.price === "number" ? input.price : null,
    category,
    budgets: budgetContexts,
    overallWeeklyRemaining,
    recentTransactionCount: transactions.length,
    totalSpentLastWeek,
  };
}

function buildAdvisorPrompt(contextJson: AdvisorContextJson): {
  systemPrompt: string;
  userPrompt: string;
} {
  const systemPrompt = [
    "You are SmartSave Campus, a friendly money coach for college students.",
    "Give simple, non-technical money guidance.",
    "Use only the budget and spending data provided.",
    "Do NOT give investing, tax, or stock-picking advice.",
    'Always choose one status label: "GO", "CAREFUL", or "NOPE".',
    "Keep your explanation in clear, friendly language.",
    "Respond ONLY with a compact JSON object and nothing else.",
    'JSON shape: { "status": "GO" | "CAREFUL" | "NOPE", "message": string, "suggestion"?: string }.',
    "Message and suggestion must each be 1–2 sentences max.",
  ].join(" ");

  const userPrompt = [
    "Here is the context JSON for this student and purchase:",
    "```json",
    JSON.stringify(contextJson),
    "```",
    "",
    "Use this data to decide if the purchase fits their budgets.",
    "- If the purchase comfortably fits the relevant budget and overall weekly budget, use status \"GO\".",
    "- If it fits but leaves them very tight or slightly over, use status \"CAREFUL\".",
    "- If it clearly pushes them over budget or looks risky, use status \"NOPE\".",
    "Explain your reasoning briefly in the message using the numbers from the JSON.",
    "Optionally add a specific, practical suggestion in the suggestion field (e.g. wait until next week, choose a cheaper option, or skip it).",
  ].join("\n");

  return { systemPrompt, userPrompt };
}

function parseAdvisorResponse(raw: string): PurchaseAdviceResponse {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("AI_RESPONSE_PARSE_ERROR");
  }

  if (
    !parsed ||
    typeof parsed !== "object" ||
    !("status" in parsed) ||
    !("message" in parsed)
  ) {
    throw new Error("AI_RESPONSE_INVALID_SHAPE");
  }

  const obj = parsed as { status: string; message: string; suggestion?: string };

  const allowedStatuses = new Set(["GO", "CAREFUL", "NOPE"]);
  if (!allowedStatuses.has(obj.status)) {
    throw new Error("AI_RESPONSE_INVALID_STATUS");
  }

  return {
    status: obj.status as PurchaseAdviceResponse["status"],
    message: String(obj.message),
    suggestion: typeof obj.suggestion === "string" ? obj.suggestion : undefined,
  };
}

export async function generatePurchaseAdvice(
  input: PurchaseAdviceRequest,
): Promise<PurchaseAdviceResponse> {
  const budgets = await getUserBudgets(input.userId);
  const transactions = await getRecentTransactions(input.userId, 7);

  const contextJson = buildAdvisorContextJson(input, budgets, transactions);
  const { systemPrompt, userPrompt } = buildAdvisorPrompt(contextJson);

  const raw = await generateChatJsonResponse(systemPrompt, userPrompt);
  return parseAdvisorResponse(raw);
}


