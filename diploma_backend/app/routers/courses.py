from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from .. import crud, models, schemas
from ..database import get_db

router = APIRouter(prefix="/courses", tags=["Courses"])


@router.get("", response_model=list[schemas.CourseRead])
def list_courses(db: Session = Depends(get_db)):
    return crud.get_all(db, models.Course)


@router.post("", response_model=schemas.CourseRead, status_code=status.HTTP_201_CREATED)
def create_course(payload: schemas.CourseCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_course(db, payload)
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail="Курс с таким кодом уже существует") from exc


@router.put("/{course_id}", response_model=schemas.CourseRead)
def update_course(course_id: int, payload: schemas.CourseUpdate, db: Session = Depends(get_db)):
    item = crud.get_by_id(db, models.Course, course_id)
    if not item:
        raise HTTPException(status_code=404, detail="Курс не найден")
    try:
        return crud.update_course(db, item, payload)
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail="Курс с таким кодом уже существует") from exc


@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_course(course_id: int, db: Session = Depends(get_db)):
    item = crud.get_by_id(db, models.Course, course_id)
    if not item:
        raise HTTPException(status_code=404, detail="Курс не найден")
    crud.delete_item(db, item)
