from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI


app = FastAPI(title="Nexora AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Nexora AI backend is running 🚀"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }
