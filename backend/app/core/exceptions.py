from fastapi import Request
from fastapi.responses import JSONResponse

from app.core.logging import logger

async def global_exception_handler(
    request: Request,
    exc: Exception
) -> JSONResponse:
    logger.exception(
        "Unhandled exception on %s %s",
        request.method,
        request.url.path
    )

    return JSONResponse(
        status_code = 500,
        content = {
            "success": False,
            "message": "Internal server error",
            "data": None
        }
    )