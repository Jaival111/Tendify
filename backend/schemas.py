from pydantic import BaseModel, EmailStr
from datetime import date
from typing import List
from models import AttendanceStatus

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr

    class Config:
        from_attributes = True

class SubjectBase(BaseModel):
    name: str

class SubjectCreate(SubjectBase):
    pass

class Subject(SubjectBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class AttendanceBase(BaseModel):
    date: date
    status: AttendanceStatus

class AttendanceCreate(AttendanceBase):
    subject_id: int

class Attendance(AttendanceBase):
    id: int
    subject_id: int

    class Config:
        from_attributes = True

class SubjectWithAttendance(Subject):
    attendances: List[Attendance]
    user_id: int

class AttendanceStats(BaseModel):
    total_classes: int
    attended_classes: int
    missed_classes: int
    attendance_percentage: float

class AttendanceStatusResponse(BaseModel):
    status: AttendanceStatus | None
