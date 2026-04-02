/**
 * Mock данные для тестирования фронтенда
 * Эти данные используются вместо реального API
 * Позже будут заменены на реальные запросы к бэкенду
 */

let mockCourses = [
  {
    id: 1,
    name: "Математический анализ",
    code: "MATH101",
    credits: 4,
    hours: 60,
    description:
      "Введение в математический анализ и дифференциальные уравнения",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Линейная алгебра",
    code: "MATH201",
    credits: 3,
    hours: 45,
    description: "Основы матричной алгебры и векторных пространств",
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Дискретная математика",
    code: "MATH301",
    credits: 3,
    hours: 45,
    description: "Комбинаторика, теория графов, логика",
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Программирование на Python",
    code: "CS101",
    credits: 4,
    hours: 60,
    description: "Основы программирования и алгоритмы",
    created_at: new Date().toISOString(),
  },
];

let mockTeachers = [
  {
    id: 1,
    name: "Петр Иванович Сидоров",
    email: "p.sidorov@university.edu",
    phone: "+7 (999) 123-45-67",
    specialization: "Математика",
    max_hours_per_week: 20,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Анна Сергеевна Петрова",
    email: "a.petrova@university.edu",
    phone: "+7 (999) 234-56-78",
    specialization: "Информатика",
    max_hours_per_week: 18,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Иван Александрович Смирнов",
    email: "i.smirnov@university.edu",
    phone: "+7 (999) 345-67-89",
    specialization: "Математика",
    max_hours_per_week: 22,
    created_at: new Date().toISOString(),
  },
];

let mockRooms = [
  {
    id: 1,
    number: "101",
    capacity: 30,
    building: "Главный корпус",
    type: "lecture",
    equipment: "Проектор, интерактивная доска",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    number: "102",
    capacity: 25,
    building: "Главный корпус",
    type: "practical",
    equipment: "Компьютеры, доска",
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    number: "201",
    capacity: 40,
    building: "Учебный корпус №1",
    type: "lecture",
    equipment: "Проектор, экран",
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    number: "301",
    capacity: 20,
    building: "Учебный корпус №2",
    type: "lab",
    equipment: "Лабораторное оборудование",
    created_at: new Date().toISOString(),
  },
];

let mockSchedules = [
  {
    id: 1,
    day: new Date(2026, 0, 8),
    start_hour: 8,
    end_hour: 9,
    course_id: 1,
    teacher_id: 1,
    room_id: 1,
    course_name: "Математический анализ",
    teacher_name: "Петр Иванович Сидоров",
    room_number: "101",
    group: "1-А",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    day: new Date(2026, 0, 8),
    start_hour: 10,
    end_hour: 11,
    course_id: 4,
    teacher_id: 2,
    room_id: 2,
    course_name: "Программирование на Python",
    teacher_name: "Анна Сергеевна Петрова",
    room_number: "102",
    group: "1-Б",
    created_at: new Date().toISOString(),
  },
];

let courseIdCounter = 5;
let teacherIdCounter = 4;
let roomIdCounter = 5;
let scheduleIdCounter = 3;

/**
 * Mock API для Courses
 */
export const mockCourseAPI = {
  getAll: async () => {
    // Имитация задержки сети
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { data: [...mockCourses] };
  },

  create: async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const newCourse = {
      ...data,
      id: courseIdCounter++,
      created_at: new Date().toISOString(),
    };
    mockCourses.push(newCourse);
    return { data: newCourse };
  },

  update: async (id, data) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const index = mockCourses.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Курс не найден");
    mockCourses[index] = { ...mockCourses[index], ...data, id };
    return { data: mockCourses[index] };
  },

  delete: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    mockCourses = mockCourses.filter((c) => c.id !== id);
    return { data: null };
  },
};

/**
 * Mock API для Teachers
 */
export const mockTeacherAPI = {
  getAll: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { data: [...mockTeachers] };
  },

  create: async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const newTeacher = {
      ...data,
      id: teacherIdCounter++,
      created_at: new Date().toISOString(),
    };
    mockTeachers.push(newTeacher);
    return { data: newTeacher };
  },

  update: async (id, data) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const index = mockTeachers.findIndex((t) => t.id === id);
    if (index === -1) throw new Error("Преподаватель не найден");
    mockTeachers[index] = { ...mockTeachers[index], ...data, id };
    return { data: mockTeachers[index] };
  },

  delete: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    mockTeachers = mockTeachers.filter((t) => t.id !== id);
    return { data: null };
  },
};

/**
 * Mock API для Rooms
 */
export const mockRoomAPI = {
  getAll: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { data: [...mockRooms] };
  },

  create: async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const newRoom = {
      ...data,
      id: roomIdCounter++,
      created_at: new Date().toISOString(),
    };
    mockRooms.push(newRoom);
    return { data: newRoom };
  },

  update: async (id, data) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const index = mockRooms.findIndex((r) => r.id === id);
    if (index === -1) throw new Error("Комната не найдена");
    mockRooms[index] = { ...mockRooms[index], ...data, id };
    return { data: mockRooms[index] };
  },

  delete: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    mockRooms = mockRooms.filter((r) => r.id !== id);
    return { data: null };
  },
};

/**
 * Mock API для Schedules
 */
export const mockScheduleAPI = {
  getAll: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { data: mockSchedules };
  },

  create: async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const newSchedule = {
      ...data,
      id: scheduleIdCounter++,
      created_at: new Date().toISOString(),
    };
    mockSchedules.push(newSchedule);
    return { data: newSchedule };
  },

  update: async (id, data) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const index = mockSchedules.findIndex((s) => s.id === id);
    if (index === -1) throw new Error("Расписание не найдено");
    mockSchedules[index] = { ...mockSchedules[index], ...data, id };
    return { data: mockSchedules[index] };
  },

  delete: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    mockSchedules = mockSchedules.filter((s) => s.id !== id);
    return { data: null };
  },

  generate: async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Генерируем тестовое расписание
    const generated = [];
    const startDate = new Date(2026, 0, 8); // 8 января 2026

    for (let day = 0; day < 5; day++) {
      for (let hour = 8; hour < 16; hour++) {
        if (Math.random() > 0.6) {
          // 40% вероятность класса в каждом слоте
          generated.push({
            id: scheduleIdCounter++,
            day: new Date(startDate.getTime() + day * 24 * 60 * 60 * 1000),
            start_hour: hour,
            end_hour: hour + 1,
            course_id: Math.floor(Math.random() * mockCourses.length) + 1,
            teacher_id: Math.floor(Math.random() * mockTeachers.length) + 1,
            room_id: Math.floor(Math.random() * mockRooms.length) + 1,
            course_name:
              mockCourses[Math.floor(Math.random() * mockCourses.length)].name,
            teacher_name:
              mockTeachers[Math.floor(Math.random() * mockTeachers.length)]
                .name,
            room_number:
              mockRooms[Math.floor(Math.random() * mockRooms.length)].number,
            group: ["1-А", "1-Б", "2-А", "2-Б"][Math.floor(Math.random() * 4)],
            created_at: new Date().toISOString(),
          });
        }
      }
    }

    mockSchedules = generated;
    return { data: generated };
  },
};

/**
 * Auth Mock API
 * Имитация API для аутентификации
 * В реальном приложении это будет подключено к бэкенду
 */

// Хранилище пользователей (имитация БД)
let mockUsers = [
  {
    id: 1,
    email: "admin@university.kz",
    password: "admin123",
    displayName: "Admin User",
    role: "admin",
  },
  {
    id: 2,
    email: "teacher@university.kz",
    password: "teacher123",
    displayName: "Петр Иванович",
    role: "teacher",
  },
  {
    id: 3,
    email: "student@university.kz",
    password: "student123",
    displayName: "Арман Касымов",
    role: "student",
  },
];

export const mockAuthAPI = {
  login: async (email, password) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = mockUsers.find(
      (u) => u.email === email && u.password === password,
    );

    if (!user) {
      throw new Error("Неверный email или пароль");
    }

    const { password: _, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      token: `token_${user.id}_${Date.now()}`,
    };
  },

  register: async (email, password, displayName, role) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (mockUsers.some((u) => u.email === email)) {
      throw new Error("Пользователь с таким email уже существует");
    }

    const newUser = {
      id: mockUsers.length + 1,
      email,
      password,
      displayName,
      role,
    };

    mockUsers.push(newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    return {
      ...userWithoutPassword,
      token: `token_${newUser.id}_${Date.now()}`,
    };
  },

  logout: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return { success: true };
  },
};

export default {
  mockCourseAPI,
  mockTeacherAPI,
  mockRoomAPI,
  mockScheduleAPI,
  mockAuthAPI,
};
