from fastapi import FastAPI, HTTPException
from typing import Literal
from datetime import date 
from decimal import Decimal 
from supabase import create_client, Client 
from pydantic import BaseModel
import os 
from dotenv import load_dotenv
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
    """Get all transactions for a user"""
    data = supabase.table("transactions").select("*").eq(
        "student_id", user_id
    ).order("createdat", desc=True).limit(limit).execute()
    return data.data

@app.get("/transactions/{user_id}/category/{category}")
async def get_transactions_by_category(user_id: int, category: str):
    """Get transactions filtered by category"""
    data = supabase.table("transactions").select("*").eq(
        "student_id", user_id
    ).eq("category", category).order("createdat", desc=True).execute()
    return data.data

#budget endpoints
