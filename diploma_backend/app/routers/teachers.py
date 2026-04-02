from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from .. import crud, models, schemas
from ..database import get_db

router = APIRouter(prefix="/teachers", tags=["Teachers"])


@router.get("", response_model=list[schemas.TeacherRead])
def list_teachers(db: Session = Depends(get_db)):
    return crud.get_all(db, models.Teacher)


@router.post("", response_model=schemas.TeacherRead, status_code=status.HTTP_201_CREATED)
def create_teacher(payload: schemas.TeacherCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_teacher(db, payload)
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail="Преподаватель с таким email уже существует") from exc


@router.put("/{teacher_id}", response_model=schemas.TeacherRead)
def update_teacher(teacher_id: int, payload: schemas.TeacherUpdate, db: Session = Depends(get_db)):
    item = crud.get_by_id(db, models.Teacher, teacher_id)
    if not item:
        raise HTTPException(status_code=404, detail="Преподаватель не найден")
    try:
        return crud.update_teacher(db, item, payload)
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail="Преподаватель с таким email уже существует") from exc


@router.delete("/{teacher_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_teacher(teacher_id: int, db: Session = Depends(get_db)):
    item = crud.get_by_id(db, models.Teacher, teacher_id)
    if not item:
        raise HTTPException(status_code=404, detail="Преподаватель не найден")
    crud.delete_item(db, item)
