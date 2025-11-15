import express from "express";
import aiRouter from "./routes/ai";

export const app = express();

app.use(express.json());

// Mount AI-related routes
app.use(aiRouter);

// Simple health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

