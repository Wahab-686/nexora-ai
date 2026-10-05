from fastapi import APIRouter, Depends

from app.core.database import supabase
from app.core.security.auth import verify_firebase_token

router = APIRouter()


@router.get("/summary")
def dashboard_summary(
    decoded_token: dict = Depends(verify_firebase_token),
):
    user_id = decoded_token["uid"]

    leads_result = (
        supabase
        .table("leads")
        .select("id", count="exact")
        .eq("user_id", user_id)
        .execute()
    )

    total_leads = leads_result.count or 0

    return {
        "status": "success",
        "user_id": user_id,
        "metrics": {
            "total_leads": total_leads,
            "active_bookings": 0,
            "messages": 0,
            "automations": 0,
        },
    }