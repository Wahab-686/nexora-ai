from fastapi import APIRouter, Depends

from app.core.security.auth import verify_firebase_token

router = APIRouter()

@router.get("/summary")
def dashboard_summary(
    decoded_token: dict = Depends(verify_firebase_token)
):
    return {
        "status": "success",
        "user_id": decoded_token["uid"],
        "metrics": {
            "total_leads": 0,
            "active_bookings": 0,
            "messages": 0,
            "automations": 0,
        },
    }