from typing import Any

from app.agents.base import BaseAgent
from app.services.serpapi import search_businesses, SerpApiError


class LeadGenerationAgent(BaseAgent):
    name = "lead-generation-agent"

    async def run(
        self,
        industry: str,
        location: str,
        target_audience: str,
        limit: int = 10,
    ) -> dict[str, Any]:
        """Discover real businesses using SerpApi."""

        industry = industry.strip()
        location = location.strip()
        target_audience = target_audience.strip()

        if not industry:
            raise ValueError("Industry is required.")

        if not location:
            raise ValueError("Location is required.")

        if not target_audience:
            raise ValueError("Target audience is required.")

        if not 1 <= limit <= 50:
            raise ValueError("Limit must be between 1 and 50.")

        try:
            businesses = await search_businesses(
                industry=industry,
                location=location,
                target_audience=target_audience,
                limit=limit,
            )
        except SerpApiError as exc:
            raise RuntimeError(
                "Business discovery failed. Please try again later."
            ) from exc

        return {
            "status": "success",
            "agent": self.name,
            "request": {
                "industry": industry,
                "location": location,
                "target_audience": target_audience,
                "limit": limit,
            },
            "leads": businesses,
            "total_found": len(businesses),
            "message": (
                "Business discovery completed."
                if businesses
                else "No businesses were found for this search."
            ),
        }