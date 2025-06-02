from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Annotated
import models
import schemas
import database
from routers.auth_router import get_current_user
from pydantic import BaseModel
from datetime import date

router = APIRouter(
    prefix="/api/subjects",
    tags=["subjects"]
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
db_dependency = Annotated[Session, Depends(get_db)]

@router.post("/", response_model=schemas.Subject)
def create_subject(
    subject: schemas.SubjectCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_subject = models.Subject(
        name=subject.name,
        user_id=current_user.id
    )
    db.add(db_subject)
    try:
        db.commit()
        db.refresh(db_subject)
        return db_subject
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Subject with this name already exists for this user")

@router.get("/", response_model=List[schemas.Subject])
def get_subjects(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return db.query(models.Subject).filter(models.Subject.user_id == current_user.id).all()

@router.delete("/{subject_id}")
def delete_subject(
    subject_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    subject = db.query(models.Subject).filter(
        models.Subject.id == subject_id,
        models.Subject.user_id == current_user.id
    ).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    # Delete all attendance records for this subject
    db.query(models.Attendance).filter(models.Attendance.subject_id == subject_id).delete()
    
    # Delete the subject
    db.delete(subject)
    db.commit()
    return {"message": "Subject deleted successfully"}

@router.get("/{subject_id}/attendance", response_model=schemas.AttendanceStats)
def get_subject_attendance(
    subject_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    subject = db.query(models.Subject).filter(
        models.Subject.id == subject_id,
        models.Subject.user_id == current_user.id
    ).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    attendances = db.query(models.Attendance).filter(
        models.Attendance.subject_id == subject_id
    ).all()

    total_classes = len(attendances)
    attended_classes = sum(1 for a in attendances if a.status == models.AttendanceStatus.ATTENDED)
    missed_classes = total_classes - attended_classes
    attendance_percentage = (attended_classes / total_classes * 100) if total_classes > 0 else 0

    return {
        "total_classes": total_classes,
        "attended_classes": attended_classes,
        "missed_classes": missed_classes,
        "attendance_percentage": attendance_percentage
    }

@router.post("/{subject_id}/attendance", response_model=schemas.Attendance)
def create_or_update_attendance(
    subject_id: int,
    attendance: schemas.AttendanceCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    subject = db.query(models.Subject).filter(
        models.Subject.id == subject_id,
        models.Subject.user_id == current_user.id
    ).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    # Check if attendance already exists for this date
    existing_attendance = db.query(models.Attendance).filter(
        models.Attendance.subject_id == subject_id,
        models.Attendance.date == attendance.date
    ).first()

    if existing_attendance:
        # Update existing attendance
        existing_attendance.status = attendance.status
        db.commit()
        db.refresh(existing_attendance)
        return existing_attendance
    else:
        # Create new attendance
        db_attendance = models.Attendance(
            subject_id=subject_id,
            date=attendance.date,
            status=attendance.status
        )
        db.add(db_attendance)
        db.commit()
        db.refresh(db_attendance)
        return db_attendance

@router.get("/{subject_id}/attendance/status", response_model=schemas.AttendanceStatusResponse)
def get_attendance_status(
    subject_id: int,
    date: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    subject = db.query(models.Subject).filter(
        models.Subject.id == subject_id,
        models.Subject.user_id == current_user.id
    ).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    attendance = db.query(models.Attendance).filter(
        models.Attendance.subject_id == subject_id,
        models.Attendance.date == date
    ).first()

    return {"status": attendance.status if attendance else None}

class AttendanceDelete(BaseModel):
    date: date
    subject_id: int

@router.delete("/{subject_id}/attendance")
def delete_attendance(
    subject_id: int,
    attendance: AttendanceDelete,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    subject = db.query(models.Subject).filter(
        models.Subject.id == subject_id,
        models.Subject.user_id == current_user.id
    ).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    attendance_record = db.query(models.Attendance).filter(
        models.Attendance.subject_id == subject_id,
        models.Attendance.date == attendance.date
    ).first()

    if not attendance_record:
        raise HTTPException(status_code=404, detail="Attendance record not found")

    db.delete(attendance_record)
    db.commit()
    return {"message": "Attendance record deleted successfully"} 