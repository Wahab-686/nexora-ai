from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.exceptions import global_exception_handler

app = FastAPI(
    title = settings.app_name,
    version = settings.app_version,
    debug = settings.debug
)

app.add_exception_handler(Exception, global_exception_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins = [settings.frontend_url],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

app.include_router(
    api_router,
    prefix = "/api/v1"
)


@app.get("/")
def root():
    return {
        "message": "Nexora AI backend is running 🚀",
        "version": settings.app_version
    }