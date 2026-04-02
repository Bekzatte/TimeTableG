from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from .. import crud, models, schemas
from ..database import get_db

router = APIRouter(prefix="/rooms", tags=["Rooms"])


@router.get("", response_model=list[schemas.RoomRead])
def list_rooms(db: Session = Depends(get_db)):
    return crud.get_all(db, models.Room)


@router.post("", response_model=schemas.RoomRead, status_code=status.HTTP_201_CREATED)
def create_room(payload: schemas.RoomCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_room(db, payload)
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail="Аудитория с таким номером уже существует") from exc


@router.put("/{room_id}", response_model=schemas.RoomRead)
def update_room(room_id: int, payload: schemas.RoomUpdate, db: Session = Depends(get_db)):
    item = crud.get_by_id(db, models.Room, room_id)
    if not item:
        raise HTTPException(status_code=404, detail="Аудитория не найдена")
    try:
        return crud.update_room(db, item, payload)
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail="Аудитория с таким номером уже существует") from exc


@router.delete("/{room_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_room(room_id: int, db: Session = Depends(get_db)):
    item = crud.get_by_id(db, models.Room, room_id)
    if not item:
        raise HTTPException(status_code=404, detail="Аудитория не найдена")
    crud.delete_item(db, item)
