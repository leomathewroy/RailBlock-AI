from app.api.routes.auth import router as auth_router
from app.api.routes.trains import router as trains_router
from app.api.routes.assets import router as assets_router
from app.api.routes.maintenance import router as maintenance_router
from app.api.routes.blocks import router as blocks_router
from app.api.routes.predictions import router as predictions_router
from app.api.routes.optimization import router as optimization_router
from app.api.routes.analytics import router as analytics_router
from app.api.routes.health import router as health_router

__all__ = [
    "auth_router",
    "trains_router",
    "assets_router",
    "maintenance_router",
    "blocks_router",
    "predictions_router",
    "optimization_router",
    "analytics_router",
    "health_router"
]
