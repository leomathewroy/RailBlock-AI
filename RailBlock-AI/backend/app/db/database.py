import os
import logging
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from sqlalchemy import text
from app.core.config import settings

logger = logging.getLogger(__name__)

Base = declarative_base()

# Choose database URL
db_url = os.environ.get("DATABASE_URL", settings.DATABASE_URL)

# Fallback mechanism: check if we should use SQLite
use_sqlite = os.environ.get("USE_SQLITE", "false").lower() == "true" or "sqlite" in db_url

if not use_sqlite:
    # Test if PostgreSQL is reachable synchronously or via quick test
    try:
        import socket
        # Quick port check on postgres server
        host = "localhost"
        port = 5432
        if "@" in db_url:
            host_port = db_url.split("@")[-1].split("/")[0]
            if ":" in host_port:
                host, port = host_port.split(":")
                port = int(port)
            else:
                host = host_port
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(0.8)
        result = sock.connect_ex((host, port))
        sock.close()
        if result != 0:
            logger.warning(f"PostgreSQL server not detected at {host}:{port}. Falling back to SQLite local database.")
            db_url = settings.SQLITE_FALLBACK_URL
    except Exception as e:
        logger.warning(f"Could not verify PostgreSQL connection: {e}. Using SQLite fallback.")
        db_url = settings.SQLITE_FALLBACK_URL

connect_args = {}
if "sqlite" in db_url:
    connect_args["check_same_thread"] = False

engine = create_async_engine(
    db_url,
    echo=False,
    future=True,
    connect_args=connect_args
)

async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False
)

async def get_db():
    async with async_session_maker() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

async def init_db():
    """Create all tables if they do not exist."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
