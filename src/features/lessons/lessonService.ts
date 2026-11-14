import lesson01 from '../../content/zfa/lf1/lesson-01-role.json';
import lesson02 from '../../content/zfa/lf1/lesson-02-arbeitszeit.json';

export const ALL_LESSONS = [lesson01, lesson02];

export const getAllLessons = () => ALL_LESSONS;

export const getLessonById = (id: string) => {
  return ALL_LESSONS.find((l) => l.id === id) || lesson01;
};

export const getFirstLesson = () => lesson01;