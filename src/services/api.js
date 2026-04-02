import {
  mockCourseAPI,
  mockTeacherAPI,
  mockRoomAPI,
  mockScheduleAPI,
} from "./mockData";

/**
 * Mock API - используется для тестирования фронтенда
 * Легко переключается на реальный API путем раскомментирования кода ниже
 */

// API endpoints для Courses
export const courseAPI = mockCourseAPI;

// API endpoints для Teachers
export const teacherAPI = mockTeacherAPI;

// API endpoints для Rooms/Classrooms
export const roomAPI = mockRoomAPI;

// API endpoints для Timetable/Schedule
export const scheduleAPI = mockScheduleAPI;

export default {
  courseAPI,
  teacherAPI,
  roomAPI,
  scheduleAPI,
};

/**
 * ===== ПЕРЕКЛЮЧЕНИЕ НА РЕАЛЬНЫЙ API =====
 *
 * Когда бэкенд будет готов, замените импорты на реальные API:
 *
 * import axios from 'axios';
 *
 * const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
 *
 * const api = axios.create({
 *   baseURL: API_BASE_URL,
 *   headers: {
 *     'Content-Type': 'application/json',
 *   },
 * });
 *
 * export const courseAPI = {
 *   getAll: () => api.get('/courses'),
 *   create: (data) => api.post('/courses', data),
 *   update: (id, data) => api.put(`/courses/${id}`, data),
 *   delete: (id) => api.delete(`/courses/${id}`),
 * };
 * ... и так далее для остальных
 */
