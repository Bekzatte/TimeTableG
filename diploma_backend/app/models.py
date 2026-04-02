from __future__ import annotations

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .database import Base


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    code = Column(String(50), nullable=False, unique=True, index=True)
    credits = Column(Integer, nullable=False)
    hours = Column(Integer, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    schedules = relationship("Schedule", back_populates="course")


class Teacher(Base):
    __tablename__ = "teachers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True, index=True)
    phone = Column(String(100), nullable=True)
    specialization = Column(String(255), nullable=False)
    max_hours_per_week = Column(Integer, nullable=False, default=20)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    schedules = relationship("Schedule", back_populates="teacher")


class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    number = Column(String(50), nullable=False, unique=True, index=True)
    capacity = Column(Integer, nullable=False)
    building = Column(String(255), nullable=False)
    type = Column(String(50), nullable=False)
    equipment = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    schedules = relationship("Schedule", back_populates="room")


class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(Integer, primary_key=True, index=True)
    day = Column(DateTime(timezone=False), nullable=False, index=True)
    start_hour = Column(Integer, nullable=False)
    end_hour = Column(Integer, nullable=False)

    course_id = Column(Integer, ForeignKey("courses.id", ondelete="SET NULL"), nullable=True)
    teacher_id = Column(Integer, ForeignKey("teachers.id", ondelete="SET NULL"), nullable=True)
    room_id = Column(Integer, ForeignKey("rooms.id", ondelete="SET NULL"), nullable=True)

    course_name = Column(String(255), nullable=False)
    teacher_name = Column(String(255), nullable=False)
    room_number = Column(String(50), nullable=False)
    group = Column(String(50), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    course = relationship("Course", back_populates="schedules")
    teacher = relationship("Teacher", back_populates="schedules")
    room = relationship("Room", back_populates="schedules")
