// src/features/lessons/lessonService.ts
import type { Lesson } from './lessonTypes';
import lessonData from '../../content/zfa/lf1/lesson-01-role.json';

export const getFirstLesson = (): Lesson => {
  return lessonData as Lesson;
};