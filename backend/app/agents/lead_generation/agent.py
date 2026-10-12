import re
from typing import Any
from urllib.parse import urlparse

from app.agents.base import BaseAgent
from app.services.serpapi import search_businesses, SerpApiError


GENERIC_INDUSTRY_WORDS = {
    "company", "companies", "business", "businesses",
    "service", "services", "firm", "firms",
}


def normalize_text(value: str | None) -> str:
    """Normalize text for consistent matching."""
    return re.sub(r"[^a-z0-9]+", " ", (value or "").lower()).strip()


def normalize_domain(website: str | None) -> str | None:
    """Normalize a website to its domain."""
    if not website:
        return None

    value = website.strip()
    if not value:
        return None

    if "://" not in value:
        value = f"https://{value}"

    domain = urlparse(value).hostname

    if not domain:
        return None

    domain = domain.lower().removeprefix("www.")
    return domain or None


def industry_matches(business: dict, industry: str) -> bool:
    """Check whether the name or category mentions an industry keyword."""
    terms = set(normalize_text(industry).split())
    terms -= GENERIC_INDUSTRY_WORDS

    searchable_text = normalize_text(
        f"{business.get('name') or ''} "
        f"{business.get('category') or ''}"
    )
    searchable_terms = set(searchable_text.split())

    return bool(terms & searchable_terms)


def score_business(business: dict, industry: str) -> dict:
    """Score a business using transparent, rule-based signals."""
    score = 20
    reasons = []

    if industry_matches(business, industry):
        score += 30
        reasons.append("Industry keyword match: +30")

    if normalize_domain(business.get("website")):
        score += 20
        reasons.append("Website available: +20")

    if business.get("phone"):
        score += 15
        reasons.append("Phone number available: +15")

    try:
        rating = float(business.get("rating") or 0)
    except (TypeError, ValueError):
        rating = 0

    if rating >= 4:
        score += 10
        reasons.append("Rating of 4.0 or higher: +10")
    elif rating >= 3.5:
        score += 5
        reasons.append("Rating of 3.5 or higher: +5")

    try:
        reviews = int(business.get("reviews") or 0)
    except (TypeError, ValueError):
        reviews = 0

    if reviews >= 20:
        score += 5
        reasons.append("At least 20 reviews: +5")
    elif reviews >= 5:
        score += 3
        reasons.append("At least 5 reviews: +3")

    score = min(score, 100)

    has_contact = bool(
        normalize_domain(business.get("website"))
        or business.get("phone")
    )

    qualified = (
        industry_matches(business, industry)
        and has_contact
        and score >= 55
    )

    if not reasons:
        reasons.append("No additional scoring signals found")

    return {
        **business,
        "score": score,
        "qualification_status": "qualified" if qualified else "review",
        "score_reasons": reasons,
    }


def deduplicate_businesses(businesses: list[dict]) -> list[dict]:
    """Remove likely duplicates using place ID, domain, and name/address."""
    unique = []
    seen_place_ids = set()
    seen_domains = set()
    seen_name_addresses = set()

    for business in businesses:
        place_id = business.get("place_id")
        domain = normalize_domain(business.get("website"))

        name = normalize_text(business.get("name"))
        address = normalize_text(business.get("address"))

        name_address = (
            (name, address)
            if name and address
            else None
        )

        duplicate = (
            (place_id and place_id in seen_place_ids)
            or (domain and domain in seen_domains)
            or (
                name_address
                and name_address in seen_name_addresses
            )
        )

        if duplicate:
            continue

        unique.append(business)

        if place_id:
            seen_place_ids.add(place_id)

        if domain:
            seen_domains.add(domain)

        if name_address:
            seen_name_addresses.add(name_address)

    return unique


class LeadGenerationAgent(BaseAgent):
    name = "lead-generation-agent"

    async def run(
        self,
        industry: str,
        location: str,
        target_audience: str,
        limit: int = 10,
    ) -> dict[str, Any]:
        """Discover, deduplicate, qualify, and score businesses."""

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

        unique_businesses = deduplicate_businesses(businesses)

        scored_businesses = [
            score_business(business, industry)
            for business in unique_businesses
        ]

        scored_businesses.sort(
            key=lambda business: business["score"],
            reverse=True,
        )

        qualified_count = sum(
            business["qualification_status"] == "qualified"
            for business in scored_businesses
        )

        return {
            "status": "success",
            "agent": self.name,
            "request": {
                "industry": industry,
                "location": location,
                "target_audience": target_audience,
                "limit": limit,
            },
            "leads": scored_businesses,
            "total_found": len(businesses),
            "unique_found": len(unique_businesses),
            "qualified_count": qualified_count,
            "message": (
                "Business discovery and scoring completed."
                if scored_businesses
                else "No businesses were found for this search."
            ),
        }