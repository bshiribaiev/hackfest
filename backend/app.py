from fastapi import FastAPI, HTTPException
from typing import Literal
from datetime import date 
from decimal import Decimal 
from supabase import create_client, Client 
from pydantic import BaseModel
import os 
from dotenv import load_dotenv
from datetime import datetime, timedelta
from models import *

load_dotenv()

app = FastAPI()
supabase: Client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))



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

    data = supabase.table("students").select("*").eq("id", student_id).single().execute()
    if not data.data:
        raise HTTPException(status_code=404, detail="Student not found ")
    return data.data

@app.get("/students/{student_id}/profile")
async def get_student_profile(student_id: int):

    student_response = supabase.table("students").select("*").eq("id", student_id).single().execute()

    if not student_response.data:
        raise HTTPException(status_code=404, detail="Student not found")
    
    budgets_response = supabase.table("budgets").select("*").eq("user_id", student_id).execute()

    transactions_response = supabase.table("transactions").select("*").eq("student_id", student_id).order("createdat", desc=True).limit(20).execute()

    leaderboard_response = supabase.table("leaderboard_snapshots").select("*").eq("user_id", student_id).order("snapshot_date", desc=True).limit(1).execute()

    return {
        "student": student_response.data,
        "budgets": budgets_response.data,
        "recent_transactions": transactions_response.data,
        "leaderboard_position": leaderboard_response.data[0] if leaderboard_response.data else None
    }

#transaction endpoints 
@app.post("/transactions/")
async def create_transaction(user_id: int, transaction: Transaction):

    data = supabase.table("transactions").insert({
        "student_id": user_id,
        "amount": transaction.amount,
        "category": transaction.category,
        "merchant": transaction.merchant,
        "source": transaction.source,
        "riskscore": transaction.riskscore,
        "fraudflag": transaction.fraudflag,
        "fraudreason": transaction.fraudreason
    }).execute()

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
def fraud_check(tx: Transaction):
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

#budget endpoints
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

    data = supabase.table("budgets").select("*").eq("user_id", user_id).execute()
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

#expense tracking endpoints 
@app.get("/spending-tracker/{user_id}")
async def get_spending_tracker(user_id: int):

    budgets_response = supabase.table("budgets").select("*").eq("user_id", user_id).execute()
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
        percentage_used = (spent / budget_limit * 100) if budget_limit > 0 else 0

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
