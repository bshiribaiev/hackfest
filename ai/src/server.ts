import dotenv from "dotenv";

// Load environment variables (including GEMINI_API_KEY) before anything else.
dotenv.config();

import { app } from "./app";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`SmartSave Campus backend listening on port ${PORT}`);
});

