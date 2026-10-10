from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.agents.lead_generation.agent import LeadGenerationAgent
from app.core.security.auth import verify_firebase_token
from app.services.serpapi import SerpApiError

router = APIRouter()
lead_generation_agent = LeadGenerationAgent()


class LeadGenerationRequest(BaseModel):
    industry: str = Field(min_length=1, max_length=100)
    location: str = Field(min_length=1, max_length=150)
    target_audience: str = Field(min_length=1, max_length=200)
    limit: int = Field(default=10, ge=1, le=50)


@router.post("/lead-generation")
async def generate_leads(
    request: LeadGenerationRequest,
    decoded_token: dict = Depends(verify_firebase_token),
):
    try:
        result = await lead_generation_agent.run(
            industry=request.industry,
            location=request.location,
            target_audience=request.target_audience,
            limit=request.limit,
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(
            status_code=502,
            detail="Business discovery failed. Please try again later.",
        ) from exc

    return {
        **result,
        "user_id": decoded_token["uid"],
    }