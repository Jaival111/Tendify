from database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Date, Enum
from sqlalchemy.orm import relationship
import enum

class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    subjects = relationship("Subject", back_populates="user")

class AttendanceStatus(str, enum.Enum):
    ATTENDED = "attended"
    MISSED = "missed"

class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    user = relationship("User", back_populates="subjects")
    attendances = relationship("Attendance", back_populates="subject")

class Attendance(Base):
    __tablename__ = "attendances"

    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    date = Column(Date)
    status = Column(Enum(AttendanceStatus))
    subject = relationship("Subject", back_populates="attendances")