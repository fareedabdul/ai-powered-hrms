from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import engine, Base

# Import ALL models (important for table creation)
from app.models import employee, leave, attendance, performance, recruitment, onboarding

# Import routers
from app.routes.employee_routes import router as employee_router
from app.routes.leave_routes import router as leave_router
from app.routes.performance_routes import router as performance_router
from app.routes.recruitment_routes import router as recruitment_router
from app.routes.onboarding_routes import router as onboarding_router

# ✅ App init
app = FastAPI(title="HRMS API", version="1.0")

# ✅ CORS (for React frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to frontend URL after deploy
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Create tables
Base.metadata.create_all(bind=engine)

# ✅ Include routes
app.include_router(employee_router, prefix="/employees", tags=["Employees"])
app.include_router(leave_router, prefix="/leaves", tags=["Leaves"])
app.include_router(performance_router, prefix="/performance", tags=["Performance"])
app.include_router(recruitment_router, prefix="/recruitment", tags=["Recruitment"])
app.include_router(onboarding_router, prefix="/onboarding", tags=["Onboarding"])

# ✅ Health check route
@app.get("/")
def home():
    return {"message": "HRMS Backend Running 🚀"}

# ✅ Optional: health check for deployment platforms
@app.get("/health")
def health_check():
    return {"status": "ok"}