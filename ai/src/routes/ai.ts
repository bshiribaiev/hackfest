import express from "express";
import { z } from "zod";
import { generatePurchaseAdvice } from "../ai/purchaseAdvisor";
import { getDailyInvestmentAdvice } from "../ai/dailyAdvice";
import { PurchaseAdviceRequest } from "../types/ai";

const router = express.Router();

const purchaseAdviceSchema = z.object({
  userId: z.string().min(1),
  message: z.string().min(1),
  price: z.number().nonnegative().optional(),
  category: z.string().min(1).optional(),
});

router.post("/ai/purchase-advice", async (req, res) => {
  const parseResult = purchaseAdviceSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      error: "Invalid request body.",
      details: parseResult.error.flatten(),
    });
  }

  const payload: PurchaseAdviceRequest = parseResult.data;

  try {
    const advice = await generatePurchaseAdvice(payload);
    return res.json(advice);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error while generating advice.";

    if (message === "GEMINI_API_KEY_MISSING") {
      return res.status(500).json({
        error: "AI service is not configured. Please set GEMINI_API_KEY.",
      });
    }

    if (message.startsWith("AI_RESPONSE_")) {
      return res.status(502).json({
        error: "AI response could not be understood. Please try again.",
      });
    }

    return res.status(500).json({
      error: "Failed to generate purchase advice.",
    });
  }
});

router.get("/advice/daily", (_req, res) => {
  const advice = getDailyInvestmentAdvice(new Date());
  return res.json(advice);
});

export default router;


