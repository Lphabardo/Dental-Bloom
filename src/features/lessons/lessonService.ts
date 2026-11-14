// src/features/lessons/lessonService.ts
import { Lesson } from './lessonTypes';
import lessonData from '../../content/zfa/lf1/lesson-01-role.json';

export const getFirstLesson = (): Lesson => {
  // Возвращаем наш первый урок по LF 1 в качестве объекта Lesson
  return lessonData as Lesson;
};