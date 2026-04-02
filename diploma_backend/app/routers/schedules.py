from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import crud, models, schemas
from ..database import get_db
from ..services.schedule_generator import generate_schedule

router = APIRouter(prefix="/schedules", tags=["Schedules"])


@router.get("", response_model=list[schemas.ScheduleRead])
def list_schedules(db: Session = Depends(get_db)):
    return crud.get_all(db, models.Schedule)


@router.post("", response_model=schemas.ScheduleRead, status_code=status.HTTP_201_CREATED)
def create_schedule(payload: schemas.ScheduleCreate, db: Session = Depends(get_db)):
    return crud.create_schedule(db, payload)


@router.put("/{schedule_id}", response_model=schemas.ScheduleRead)
def update_schedule(schedule_id: int, payload: schemas.ScheduleUpdate, db: Session = Depends(get_db)):
    item = crud.get_by_id(db, models.Schedule, schedule_id)
    if not item:
        raise HTTPException(status_code=404, detail="Запись расписания не найдена")
    return crud.update_schedule(db, item, payload)


@router.delete("/{schedule_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_schedule(schedule_id: int, db: Session = Depends(get_db)):
    item = crud.get_by_id(db, models.Schedule, schedule_id)
    if not item:
        raise HTTPException(status_code=404, detail="Запись расписания не найдена")
    crud.delete_item(db, item)


@router.post("/generate", response_model=list[schemas.ScheduleRead])
def generate_new_schedule(payload: schemas.ScheduleGenerateRequest, db: Session = Depends(get_db)):
    try:
        generated = generate_schedule(db, payload)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return crud.replace_schedules(db, generated)
