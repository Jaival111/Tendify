from database import Base
from sqlalchemy import Column, Integer, String, ForeignKey

class Student(Base):
    __tablename__ = "student"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)

class Subject(Base):
    __tablename__ = "subject"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student.id"), index=True)
    subject_id = Column(Integer, ForeignKey("subject.id"), index=True)
    date = Column(String, index=True)
    status = Column(String)  # Present or Absent