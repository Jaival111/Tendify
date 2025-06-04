from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from typing import Annotated
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from routers import auth_router, subject_router
import models

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://tendify.onrender.com",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]
)

app.include_router(auth_router.router)
app.include_router(subject_router.router)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
db_dependency = Annotated[Session, Depends(get_db)]

models.Base.metadata.create_all(bind=engine)

