from __future__ import annotations

from collections import defaultdict
from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from .. import models, schemas

GROUPS = ["1-А", "1-Б", "2-А", "2-Б"]
ROOM_TYPE_BY_ALGO = {
    "greedy": ["lecture", "practical", "lab"],
    "genetic": ["practical", "lecture", "lab"],
    "simulated_annealing": ["lab", "lecture", "practical"],
}


def generate_schedule(db: Session, payload: schemas.ScheduleGenerateRequest) -> list[schemas.ScheduleCreate]:
    if payload.algorithm == "greedy":
        return generate_schedule_greedy(db, payload)
    elif payload.algorithm == "cp_sat":
        return generate_schedule_cp_sat(db, payload)
    else:
        raise ValueError(f"Алгоритм '{payload.algorithm}' пока не поддерживается")


def generate_schedule_greedy(db: Session, payload: schemas.ScheduleGenerateRequest) -> list[schemas.ScheduleCreate]:
    courses = db.query(models.Course).order_by(models.Course.id.asc()).all()
    teachers = db.query(models.Teacher).order_by(models.Teacher.id.asc()).all()
    rooms = db.query(models.Room).order_by(models.Room.id.asc()).all()

    if not courses:
        raise ValueError("Нет дисциплин. Сначала добавьте хотя бы один курс.")
    if not teachers:
        raise ValueError("Нет преподавателей. Сначала добавьте хотя бы одного преподавателя.")
    if not rooms:
        raise ValueError("Нет аудиторий. Сначала добавьте хотя бы одну аудиторию.")

    start_date = _first_monday(payload.year)
    teacher_hours: dict[int, int] = defaultdict(int)
    teacher_busy: set[tuple[int, int, int]] = set()
    room_busy: set[tuple[int, int, int]] = set()
    group_busy: set[tuple[str, int, int]] = set()
    entries: list[schemas.ScheduleCreate] = []

    room_priority = ROOM_TYPE_BY_ALGO.get(payload.algorithm, ROOM_TYPE_BY_ALGO["greedy"])
    sorted_rooms = sorted(rooms, key=lambda r: room_priority.index(r.type) if r.type in room_priority else 99)

    for day_idx in range(5):
        current_day = start_date + timedelta(days=day_idx)
        for group in GROUPS:
            assigned_today = 0
            hour = 8
            while hour < 16 and assigned_today < 2:
                selected = None
                for course in courses:
                    teacher = _pick_teacher(teachers, course, teacher_hours, teacher_busy, day_idx, hour)
                    if teacher is None:
                        continue
                    room = _pick_room(sorted_rooms, room_busy, day_idx, hour)
                    if room is None:
                        continue
                    if (group, day_idx, hour) in group_busy:
                        continue
                    selected = (course, teacher, room)
                    break

                if selected is not None:
                    course, teacher, room = selected
                    teacher_hours[teacher.id] += 1
                    teacher_busy.add((teacher.id, day_idx, hour))
                    room_busy.add((room.id, day_idx, hour))
                    group_busy.add((group, day_idx, hour))
                    entries.append(
                        schemas.ScheduleCreate(
                            day=datetime(current_day.year, current_day.month, current_day.day),
                            start_hour=hour,
                            end_hour=hour + 1,
                            course_id=course.id,
                            teacher_id=teacher.id,
                            room_id=room.id,
                            course_name=course.name,
                            teacher_name=teacher.name,
                            room_number=room.number,
                            group=group,
                        )
                    )
                    assigned_today += 1
                    hour += 2
                else:
                    hour += 1

    return entries


def generate_schedule_cp_sat(db: Session, payload: schemas.ScheduleGenerateRequest) -> list[schemas.ScheduleCreate]:
    raise ValueError("Алгоритм cp_sat пока не подключен")


def _first_monday(year: int) -> datetime:
    date = datetime(year, 1, 1)
    while date.weekday() != 0:
        date += timedelta(days=1)
    return date


def _pick_teacher(
    teachers: list[models.Teacher],
    course: models.Course,
    teacher_hours: dict[int, int],
    teacher_busy: set[tuple[int, int, int]],
    day_idx: int,
    hour: int,
) -> models.Teacher | None:
    specialization_matches = [
        teacher
        for teacher in teachers
        if teacher.specialization.lower() in course.name.lower()
        or course.name.lower() in teacher.specialization.lower()
    ]
    pool = specialization_matches or teachers
    pool = sorted(pool, key=lambda teacher: (teacher_hours[teacher.id], teacher.id))

    for teacher in pool:
        if teacher_hours[teacher.id] >= teacher.max_hours_per_week:
            continue
        if (teacher.id, day_idx, hour) in teacher_busy:
            continue
        return teacher
    return None


def _pick_room(
    rooms: list[models.Room],
    room_busy: set[tuple[int, int, int]],
    day_idx: int,
    hour: int,
) -> models.Room | None:
    for room in rooms:
        if (room.id, day_idx, hour) not in room_busy:
            return room
    return None