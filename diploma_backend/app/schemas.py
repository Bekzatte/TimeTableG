from __future__ import annotations

from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class CourseBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    code: str = Field(min_length=1, max_length=50)
    credits: int = Field(ge=1, le=20)
    hours: int = Field(ge=1, le=500)
    description: Optional[str] = None


class CourseCreate(CourseBase):
    pass


class CourseUpdate(CourseBase):
    pass


class CourseRead(CourseBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime


class TeacherBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    email: EmailStr
    phone: Optional[str] = None
    specialization: str = Field(min_length=1, max_length=255)
    max_hours_per_week: int = Field(ge=1, le=80)


class TeacherCreate(TeacherBase):
    pass


class TeacherUpdate(TeacherBase):
    pass


class TeacherRead(TeacherBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime


class RoomBase(BaseModel):
    number: str = Field(min_length=1, max_length=50)
    capacity: int = Field(ge=1, le=1000)
    building: str = Field(min_length=1, max_length=255)
    type: Literal["lecture", "practical", "lab"]
    equipment: Optional[str] = None


class RoomCreate(RoomBase):
    pass


class RoomUpdate(RoomBase):
    pass


class RoomRead(RoomBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime


class ScheduleBase(BaseModel):
    day: datetime
    start_hour: int = Field(ge=8, le=20)
    end_hour: int = Field(ge=9, le=21)
    course_id: Optional[int] = None
    teacher_id: Optional[int] = None
    room_id: Optional[int] = None
    course_name: str = Field(min_length=1, max_length=255)
    teacher_name: str = Field(min_length=1, max_length=255)
    room_number: str = Field(min_length=1, max_length=50)
    group: str = Field(min_length=1, max_length=50)


class ScheduleCreate(ScheduleBase):
    pass


class ScheduleUpdate(ScheduleBase):
    pass


class ScheduleRead(ScheduleBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime


class ScheduleGenerateRequest(BaseModel):
    semester: int = Field(ge=1, le=12)
    year: int = Field(ge=2020, le=2100)
    algorithm: Literal["greedy", "genetic", "simulated_annealing", "cp_sat"] = "greedy"
