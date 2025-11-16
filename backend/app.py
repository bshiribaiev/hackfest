from fastapi import FastAPI, HTTPException
from typing import Literal, Optional
from datetime import date, datetime, timedelta
from decimal import Decimal

from supabase import create_client, Client
from pydantic import BaseModel
import os
from dotenv import load_dotenv

from models import *

load_dotenv()

app = FastAPI()
# Use the key name you actually have in your .env (originally SUPABASE_KEY).
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))


@app.post("/students/")
async def create_student(student: Student):
    data = supabase.table("students").insert({

        "name": student.name,
        "email": student.email,
        "avatarcolor": student.avatarcolor,
        "major": student.major,

    }).execute()
    return data.data


@app.get("/students/")
async def get_students():
    data = supabase.table("students").select("*").execute()
    return data.data


@app.get("/students/{student_id}")
async def get_student(student_id: int):

    data = supabase.table("students").select(
        "*").eq("id", student_id).single().execute()
    if not data.data:
        raise HTTPException(status_code=404, detail="Student not found ")
    return data.data


@app.get("/students/{student_id}/profile")
async def get_student_profile(student_id: int):

    student_response = supabase.table("students").select(
        "*").eq("id", student_id).single().execute()

    if not student_response.data:
        raise HTTPException(status_code=404, detail="Student not found")

    budgets_response = supabase.table("budgets").select(
        "*").eq("user_id", student_id).execute()

    transactions_response = supabase.table("transactions").select(
        "*").eq("student_id", student_id).order("createdat", desc=True).limit(20).execute()

    leaderboard_response = supabase.table("leaderboard_snapshots").select(
        "*").eq("user_id", student_id).order("snapshot_date", desc=True).limit(1).execute()

    # Wallet row holds canonical balance and savings for the user
    wallet_response = supabase.table("wallets").select(
        "*").eq("user_id", student_id).single().execute()

    leaderboard_position = leaderboard_response.data[0] if leaderboard_response.data else None

    # If we have a wallet row, ensure leaderboard savings mirrors wallet.savings
    if wallet_response.data:
        wallet_savings = float(wallet_response.data.get("savings", 0) or 0)
        if leaderboard_position:
            leaderboard_position["total_savings"] = wallet_savings
        else:
            leaderboard_position = {
                "user_id": student_id,
                "total_savings": wallet_savings,
                "rank": 4,
                "snapshot_date": date.today().isoformat(),
            }

    return {
        "student": student_response.data,
        "budgets": budgets_response.data,
        "recent_transactions": transactions_response.data,
        "leaderboard_position": leaderboard_position,
        "wallet": wallet_response.data,
    }


class AIAdviceRequest(BaseModel):
    user_id: int
    message: str
    # optional category the question is about; if not provided we look at all budgets
    category: Optional[str] = None


class AIAdviceResponse(BaseModel):
    status: Literal["GO", "CAREFUL", "NOPE"]
    message: str
    suggestion: Optional[str] = None


def _summarise_spending(user_id: int, category: Optional[str] = None) -> tuple[float, float]:
    """
    Return (total_budget, total_spent_last_7_days) for a user,
    optionally scoped to a single budget category.
    """
    # Fetch budgets for the user
    budgets_query = supabase.table(
        "budgets").select("*").eq("user_id", user_id)
    if category:
        budgets_query = budgets_query.eq("category", category)
    budgets_resp = budgets_query.execute()
    budgets = budgets_resp.data or []

    if not budgets:
        return 0.0, 0.0

    total_budget = float(
        sum(Decimal(str(b.get("limit_amount", 0))) for b in budgets))

    # Last 7 days of transactions
    since = datetime.utcnow() - timedelta(days=7)
    tx_query = (
        supabase.table("transactions")
        .select("*")
        .eq("student_id", user_id)
        .gte("createdat", since.isoformat())
    )
    if category:
        tx_query = tx_query.eq("category", category)
    tx_resp = tx_query.execute()
    txs = tx_resp.data or []

    total_spent = float(sum(Decimal(str(t.get("amount", 0))) for t in txs))
    return total_budget, total_spent


@app.post("/ai/advice", response_model=AIAdviceResponse)
async def ai_advice(payload: AIAdviceRequest) -> AIAdviceResponse:
    """
    Simple "AI" style advice endpoint that looks at the user's budgets and
    recent transactions and returns a friendly status + explanation.
    """
    total_budget, total_spent = _summarise_spending(
        user_id=payload.user_id, category=payload.category
    )

    # No budgets configured
    if total_budget <= 0:
        return AIAdviceResponse(
            status="CAREFUL",
            message="I couldn't find any budgets set up yet, so I can't judge your spending accurately.",
            suggestion="Try creating a simple weekly budget for categories like food, transport, and fun money so I can give more precise advice.",
        )

    ratio = total_spent / total_budget

    if ratio < 0.6:
        status: Literal["GO", "CAREFUL", "NOPE"] = "GO"
        msg = (
            f"You're in good shape: you've used about {ratio:.0%} of your "
            f"${total_budget:,.0f} budget over the last week."
        )
        suggestion = "If you keep this pace you should comfortably stay within your budget."
    elif ratio < 1.0:
        status = "CAREFUL"
        msg = (
            f"You're getting close to your limit, with about {ratio:.0%} of your "
            f"${total_budget:,.0f} budget already spent this week."
        )
        suggestion = "Consider pausing non‑essential purchases for a few days so you stay on track."
    else:
        status = "NOPE"
        msg = (
            f"You've spent around {ratio:.0%} of your ${total_budget:,.0f} budget in the last week, "
            "which is over your current limit."
        )
        suggestion = "It might be a good idea to cut back on non‑essential spending for the rest of the week."

    # You can optionally incorporate the user's question into the message if needed.
    return AIAdviceResponse(status=status, message=msg, suggestion=suggestion)


# transaction endpoints
@app.post("/transactions/")
async def create_transaction(user_id: int, transaction: Transaction):

    # 1. Insert the core transaction record
    data = supabase.table("transactions").insert(
        {
            "student_id": user_id,
            "amount": transaction.amount,
            "category": transaction.category,
            "merchant": transaction.merchant,
            "source": transaction.source,
            "riskscore": transaction.riskscore,
            "fraudflag": transaction.fraudflag,
            "fraudreason": transaction.fraudreason,
        }
    ).execute()

    # 2. Update the canonical wallet balance & savings
    try:
        amount = float(transaction.amount)
        balance_delta = 0.0
        savings_delta = 0.0

        if transaction.category == "top-up":
            # Top ups add funds, but 10% is auto-saved:
            #  - 90% goes to the spendable wallet balance
            #  - 10% goes straight to savings
            balance_delta = amount * 0.90
            savings_delta = amount * 0.10
        elif transaction.category == "save-to-savings":
            # Moves from wallet to savings: balance down, savings up
            balance_delta = -amount
            savings_delta = amount
        else:
            # Sends / spending reduce balance, do not affect savings
            balance_delta = -amount

        # Fetch existing wallet row (if any)
        wallet_resp = (
            supabase.table("wallets")
            .select("*")
            .eq("user_id", user_id)
            .single()
            .execute()
        )
        wallet = wallet_resp.data or {"balance": 0, "savings": 0}

        new_balance = float(wallet.get("balance", 0) or 0) + balance_delta
        new_savings = float(wallet.get("savings", 0) or 0) + savings_delta

        # Upsert wallet row
        supabase.table("wallets").upsert(
            {
                "user_id": user_id,
                "balance": new_balance,
                "savings": new_savings,
                "updated_at": datetime.utcnow().isoformat(),
            },
            on_conflict="user_id",
        ).execute()

        # 3. Also reflect savings in leaderboard snapshots so the leaderboard
        #    stays in sync with the wallet.
        snap_resp = (
            supabase.table("leaderboard_snapshots")
            .select("*")
            .eq("user_id", user_id)
            .order("snapshot_date", desc=True)
            .limit(1)
            .execute()
        )
        last = snap_resp.data[0] if snap_resp.data else None
        new_rank = int(last["rank"]) if last and "rank" in last else 4

        supabase.table("leaderboard_snapshots").insert(
            {
                "user_id": user_id,
                "total_savings": new_savings,
                "rank": new_rank,
                "snapshot_date": date.today().isoformat(),
            }
        ).execute()
    except Exception as e:
        # Don't break the main transaction if the savings snapshot fails;
        # this is best-effort for the demo.
        print("Failed to update savings snapshot:", e)

    return data.data


@app.get("/transactions/{user_id}")
async def get_transactions(user_id: int, limit: int = 50):

    data = supabase.table("transactions").select("*").eq(
        "student_id", user_id
    ).order("createdat", desc=True).limit(limit).execute()
    return data.data


@app.get("/transactions/{user_id}/category/{category}")
async def get_transactions_by_category(user_id: int, category: str):

    data = supabase.table("transactions").select("*").eq(
        "student_id", user_id
    ).eq("category", category).order("createdat", desc=True).execute()
    return data.data


@app.post("/fraud-check")
async def fraud_check(tx: FraudCheckTransaction):
    score = 0
    reasons = []

    if tx.amount > tx.average_amount * 3:
        score += 40
        reasons.append("Unusually large amount")

    if tx.recent_count > 5:
        score += 40
        reasons.append("Many transactions in last 10 minutes")

    hour = datetime.fromisoformat(tx.created_at.replace("Z", "")).hour
    if 1 <= hour <= 5:
        score += 20
        reasons.append("Unusual overnight transaction")

    fraud_flag = score > 70

    return {
        "fraud_flag": fraud_flag,
        "risk_score": score,
        "reasons": reasons,
    }

# budget endpoints


@app.post("/budgets/")
async def create_budget(user_id: int, budget: Budget):

    existing = supabase.table("budgets").select("*").eq(
        "user_id", user_id
    ).eq("category", budget.category).eq("period", budget.period).execute()

    if existing.data:
        raise HTTPException(
            status_code=400,
            detail=f"Budget already exists for {budget.category} ({budget.period})"
        )

    data = supabase.table("budgets").insert({
        "user_id": user_id,
        "category": budget.category,
        "period": budget.period,
        "limit_amount": budget.limit_amount
    }).execute()
    return data.data


@app.get("/budgets/{user_id}")
async def get_budgets(user_id: int):

    data = supabase.table("budgets").select(
        "*").eq("user_id", user_id).execute()
    return data.data


@app.put("/budgets/{budget_id}")
async def update_budget(budget_id: int, limit_amount: float):

    data = supabase.table("budgets").update({
        "limit_amount": limit_amount
    }).eq("id", budget_id).execute()
    return data.data


@app.delete("/budgets/{budget_id}")
async def delete_budget(budget_id: int):

    data = supabase.table("budgets").delete().eq("id", budget_id).execute()
    return {"message": "Budget deleted successfully"}

# expense tracking endpoints


@app.get("/spending-tracker/{user_id}")
async def get_spending_tracker(user_id: int):

    budgets_response = supabase.table("budgets").select(
        "*").eq("user_id", user_id).execute()
    budgets = budgets_response.data

    if not budgets:
        return {"user_id": user_id, "budgets": [], "message": "No budgets found"}

    spending_statuses = []

    for budget in budgets:

        now = datetime.now()

        if budget['period'] == 'weekly':
            start_date = (now - timedelta(days=now.weekday())).date()
        else:
            start_date = now.replace(day=1).date()

        transactions_response = supabase.table("transactions"). select("amount").eq(
            "student_id", user_id
        ).eq(
            "category", budget['category']
        ).gte(
            "createdat", start_date.isoformat()
        ).execute()

        spent = sum(float(t['amount']) for t in transactions_response.data)
        budget_limit = float(budget['limit_amount'])
        remaining = budget_limit - spent
        percentage_used = (spent / budget_limit *
                           100) if budget_limit > 0 else 0

        if percentage_used >= 100:
            status = "over"
        elif percentage_used >= 80:
            status = "near"
        else:
            status = "under"

        spending_statuses.append({
            "budget_id": budget['id'],
            "category": budget['category'],
            "period": budget['period'],
            "budget_limit": budget_limit,
            "spent": round(spent, 2),
            "remaining": round(remaining, 2),
            "percentage_used": round(percentage_used, 2),
            "status": status
        })

        return {
            "user_id": user_id,
            "budgets": spending_statuses
        }
