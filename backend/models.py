from pydantic import BaseModel
from datetime import date 
from typing import Literal, Optional


class Student(BaseModel):
    name: str
    email: str
    avatarcolor: str
    major: str 

class Transaction(BaseModel):
    amount: float
    category: str
    merchant: str
    source: str
    riskscore: Optional[int] = 10
    fraudflag: Optional[bool] = False
    fraudreason: Optional[str] = None


class Transaction(BaseModel):
    amount: float
    average_amount: float  
    recent_count: int     
    created_at: str        



class SpendingStatus(BaseModel):
    category: str
    period: str
    budget_limit: float
    spent: float
    remaining: float
    percentage_used: float
    status: Literal["under", "near", "over"]
    
class Budget(BaseModel):
    user_id: int
    category: str
    period: Literal["weekly", "monthly"]
    limit_amount: float

class BudgetResponse(BaseModel):
    id: int
    user_id: int
    category: str
    period: str
    limit_amount: float
    created_at: str

class LeaderboardSnapshot(BaseModel):
    user_id: int
    total_savings: float
    rank: int
    snapshot_date: date

class LeaderboardSnapshotResponse(BaseModel):
    id: int
    user_id: int
    total_savings: float
    rank: int
    snapshot_date: date
    created_at: str

class InvestmentTip(BaseModel):
    tip_text: str
    category: str | None = None
    is_active: bool = True
    display_date: date | None = None

class InvestmentTipResponse(BaseModel):
    id: int
    tip_text: str
    category: str | None
    is_active: bool
    display_date: date | None
    created_at: str
