from fastapi import FastAPI

app = FastAPI(title="Nexora AI API")


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
