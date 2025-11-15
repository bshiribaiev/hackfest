## SmartSave Campus Backend (AI Features)

This backend provides AI-powered features for the **SmartSave Campus** React Native app, focused on:

- Purchase advisor (campus money coach)
- Daily investment education tip (safe, generic advice)

### Tech stack

- Node.js + TypeScript
- Express
- OpenAI (or compatible) API

### Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root:

```bash
OPENAI_API_KEY=your_openai_api_key_here
PORT=3000
```

3. Run in development:

```bash
npm run dev
```

### Key endpoints

- **POST** `/ai/purchase-advice`

  - Body:
    ```json
    {
      "userId": "demo-user-1",
      "message": "Should I buy this $40 hoodie?",
      "price": 40,
      "category": "shopping"
    }
    ```
  - Response:
    ```json
    {
      "status": "CAREFUL",
      "message": "You only have $25 left in your fun budget this week, so this hoodie would push you over.",
      "suggestion": "Wait until next week or choose a cheaper option to stay on track."
    }
    ```

- **GET** `/advice/daily`
  - Response:
    ```json
    {
      "date": "2025-11-14",
      "tip": "Try to save a small, fixed amount from each paycheck to build an emergency fund over time."
    }
    ```

### Notes

- Budgets and transactions are currently stubbed in `src/services/budgetService.ts`.
  - **TODO**: Replace with real database queries.
- AI calls use the OpenAI client in `src/clients/llmClient.ts`.
  - **TODO**: Ensure `OPENAI_API_KEY` is set in your environment.

# hackfest
