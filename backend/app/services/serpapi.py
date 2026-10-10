import httpx

from app.core.config import settings


SERPAPI_URL = "https://serpapi.com/search.json"


class SerpApiError(Exception):
    """Raised when SerpApi cannot complete a business search."""


async def search_businesses(
    industry: str,
    location: str,
    target_audience: str,
    limit: int = 10,
) -> list[dict]:
    """Search Google Maps for businesses through SerpApi."""

    if not settings.serpapi_api_key:
        raise SerpApiError("SerpApi API key is not configured.")

    query = (
        f"{industry} businesses serving {target_audience} "
        f"in {location}"
    )

    params = {
        "engine": "google_maps",
        "type": "search",
        "q": query,
        "api_key": settings.serpapi_api_key,
        "hl": "en",
    }

    try:
        async with httpx.AsyncClient(timeout=25.0) as client:
            response = await client.get(
                SERPAPI_URL,
                params=params,
            )
            response.raise_for_status()
            data = response.json()

    except httpx.TimeoutException as exc:
        raise SerpApiError("The business search timed out.") from exc

    except httpx.HTTPStatusError as exc:
        raise SerpApiError(
            f"SerpApi returned HTTP {exc.response.status_code}."
        ) from exc

    except httpx.RequestError as exc:
        raise SerpApiError(
            "Could not connect to the business search provider."
        ) from exc

    except ValueError as exc:
        raise SerpApiError(
            "The business search provider returned invalid JSON."
        ) from exc

    if data.get("error"):
        raise SerpApiError(
            "The business search provider reported an error."
        )

    results = data.get("local_results") or []
    businesses = []

    for item in results[:limit]:
        businesses.append(
            {
                "name": item.get("title"),
                "address": item.get("address"),
                "phone": item.get("phone"),
                "website": item.get("website"),
                "rating": item.get("rating"),
                "reviews": item.get("reviews"),
                "category": item.get("type"),
                "place_id": item.get("place_id"),
                "maps_url": item.get("link"),
            }
        )

    return businesses