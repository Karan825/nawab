from contextlib import asynccontextmanager
from fastapi import Depends, FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions
    print(f"🚀 Starting {settings.PROJECT_NAME} in [{settings.ENVIRONMENT}] mode...")
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
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
    # Execute a simple, lightweight probe query
    result = await db.execute(text("SELECT 1"))
    value = result.scalar()
    return {
        "status": "connected",
        "database": "postgresql",
        "probe_result": value,
    }