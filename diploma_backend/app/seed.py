from __future__ import annotations

from sqlalchemy.orm import Session

from . import models


def seed_data(db: Session) -> None:
    if db.query(models.Course).first():
        return

    courses = [
        models.Course(
            name="Математический анализ",
            code="MATH101",
            credits=4,
            hours=60,
            description="Введение в математический анализ и дифференциальные уравнения",
        ),
        models.Course(
            name="Линейная алгебра",
            code="MATH201",
            credits=3,
            hours=45,
            description="Основы матричной алгебры и векторных пространств",
        ),
        models.Course(
            name="Дискретная математика",
            code="MATH301",
            credits=3,
            hours=45,
            description="Комбинаторика, теория графов, логика",
        ),
        models.Course(
            name="Программирование на Python",
            code="CS101",
            credits=4,
            hours=60,
            description="Основы программирования и алгоритмы",
        ),
    ]

    teachers = [
        models.Teacher(
            name="Петр Иванович Сидоров",
            email="p.sidorov@university.edu",
            phone="+7 (999) 123-45-67",
            specialization="Математика",
            max_hours_per_week=20,
        ),
        models.Teacher(
            name="Анна Сергеевна Петрова",
            email="a.petrova@university.edu",
            phone="+7 (999) 234-56-78",
            specialization="Информатика",
            max_hours_per_week=18,
        ),
        models.Teacher(
            name="Иван Александрович Смирнов",
            email="i.smirnov@university.edu",
            phone="+7 (999) 345-67-89",
            specialization="Математика",
            max_hours_per_week=22,
        ),
    ]

    rooms = [
        models.Room(
            number="101",
            capacity=30,
            building="Главный корпус",
            type="lecture",
            equipment="Проектор, интерактивная доска",
        ),
        models.Room(
            number="102",
            capacity=25,
            building="Главный корпус",
            type="practical",
            equipment="Компьютеры, доска",
        ),
        models.Room(
            number="201",
            capacity=40,
            building="Учебный корпус №1",
            type="lecture",
            equipment="Проектор, экран",
        ),
        models.Room(
            number="301",
            capacity=20,
            building="Учебный корпус №2",
            type="lab",
            equipment="Лабораторное оборудование",
        ),
    ]

    db.add_all(courses + teachers + rooms)
    db.commit()
