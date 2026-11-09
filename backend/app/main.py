from contextlib import asynccontextmanager
from fastapi import Depends, FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.ml.prep_time_model import get_model
from app.api.auth import router as auth_router
from app.api.outlets import router as outlets_router
from app.api.menu import router as menu_router
from app.api.orders import router as orders_router
from app.api.payments import router as payments_router
from app.api.websockets import router as ws_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions
    print(f"🚀 Starting {settings.PROJECT_NAME} in [{settings.ENVIRONMENT}] mode...")
    # Preload scikit-learn model
    try:
        get_model()
        print("🧠 AI Kitchen Prep-Time Model preloaded successfully.")
    except Exception as e:
        print(f"⚠️ Warning preloading ML model: {e}")
    yield
    # Shutdown actions
    print(f"🛑 Shutting down {settings.PROJECT_NAME}...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all dev origins including frontend port 5173
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routers
app.include_router(auth_router, prefix="/api")
app.include_router(outlets_router, prefix="/api")
app.include_router(menu_router, prefix="/api")
app.include_router(orders_router, prefix="/api")
app.include_router(payments_router, prefix="/api")
app.include_router(ws_router)


@app.get("/health", tags=["Health"], status_code=status.HTTP_200_OK)
async def health_check():
    """Liveness probe: returns OK if the web server process is responsive."""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT,
    }


@app.get("/health/db", tags=["Health"], status_code=status.HTTP_200_OK)
async def db_health_check(db: AsyncSession = Depends(get_db)):
    """Readiness probe: validates live connectivity to PostgreSQL."""
    result = await db.execute(text("SELECT 1"))
    value = result.scalar()
    return {
        "status": "connected",
        "database": "postgresql",
        "probe_result": value,
    }
