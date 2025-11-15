// routes/fraud.ts
import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

/**
 * List recent flagged transactions
 */
router.get("/fraud-alerts", async (req, res) => {
  const userId = 1; // mock user for demo

  const alerts = await prisma.transaction.findMany({
    where: { userId, fraudFlag: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  res.json(alerts);
});

export default router;
