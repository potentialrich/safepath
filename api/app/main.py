import threading
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .api.router import router as api_router
from .data.graph_engine import initialize_graph_engine

app = FastAPI(title=settings.APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

@app.on_event("startup")
async def startup_event():
    # Run the heavy graph loading in a background thread so the server
    # can bind its port immediately (critical for Render's port detection).
    thread = threading.Thread(
        target=initialize_graph_engine,
        args=(settings.CRIME_CSV_PATH,),
        daemon=True
    )
    thread.start()
    print("[*] Graph engine loading in background thread...")
