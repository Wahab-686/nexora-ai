from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.core.database import supabase
from app.core.security.auth import verify_firebase_token

router = APIRouter()


class LeadCreate(BaseModel):
    name: str
    email: str
    company: str | None = None


@router.post("")
def create_lead(
    lead: LeadCreate,
    decoded_token: dict = Depends(verify_firebase_token),
):
    user_id = decoded_token["uid"]

    lead_data = {
        "user_id": user_id,
        "name": lead.name,
        "email": lead.email,
        "company": lead.company,
    }

    result = (
        supabase
        .table("leads")
        .insert(lead_data)
        .execute()
    )

    return {
        "status": "success",
        "lead": result.data[0] if result.data else None,
    }


@router.get("")
def get_leads(
    decoded_token: dict = Depends(verify_firebase_token),
):
    user_id = decoded_token["uid"]

    result = (
        supabase
        .table("leads")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )

    return {
        "status": "success",
        "leads": result.data,
    }