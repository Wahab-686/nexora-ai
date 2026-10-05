from fastapi import APIRouter

from app.api.v1.routes.health import router as health_router
from app.api.v1.routes import dashboard
from app.api.v1.routes import leads

api_router = APIRouter()

api_router.include_router(health_router)

api_router.include_router(
    dashboard.router,
    prefix="/dashboard",
    tags=["Dashboard"],
)

api_router.include_router(
    leads.router,
    prefix="/leads",
    tags=["Leads"],
)