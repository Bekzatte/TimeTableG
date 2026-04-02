from __future__ import annotations

from typing import Iterable, TypeVar

from sqlalchemy.orm import Session

from . import models, schemas

ModelT = TypeVar("ModelT")


def get_all(db: Session, model: type[ModelT]) -> list[ModelT]:
    return db.query(model).order_by(model.id.asc()).all()


def get_by_id(db: Session, model: type[ModelT], item_id: int) -> ModelT | None:
    return db.query(model).filter(model.id == item_id).first()


def create_course(db: Session, data: schemas.CourseCreate) -> models.Course:
    item = models.Course(**data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def update_course(db: Session, item: models.Course, data: schemas.CourseUpdate) -> models.Course:
    for key, value in data.model_dump().items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


def create_teacher(db: Session, data: schemas.TeacherCreate) -> models.Teacher:
    item = models.Teacher(**data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def update_teacher(db: Session, item: models.Teacher, data: schemas.TeacherUpdate) -> models.Teacher:
    for key, value in data.model_dump().items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


def create_room(db: Session, data: schemas.RoomCreate) -> models.Room:
    item = models.Room(**data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def update_room(db: Session, item: models.Room, data: schemas.RoomUpdate) -> models.Room:
    for key, value in data.model_dump().items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


def create_schedule(db: Session, data: schemas.ScheduleCreate) -> models.Schedule:
    item = models.Schedule(**data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def update_schedule(db: Session, item: models.Schedule, data: schemas.ScheduleUpdate) -> models.Schedule:
    for key, value in data.model_dump().items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


def replace_schedules(db: Session, schedules: Iterable[schemas.ScheduleCreate]) -> list[models.Schedule]:
    db.query(models.Schedule).delete()
    created: list[models.Schedule] = []
    for entry in schedules:
        item = models.Schedule(**entry.model_dump())
        db.add(item)
        created.append(item)
    db.commit()
    for item in created:
        db.refresh(item)
    return created


def delete_item(db: Session, item: ModelT) -> None:
    db.delete(item)
    db.commit()
