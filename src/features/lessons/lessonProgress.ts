// src/features/lessons/lessonProgress.ts

export type UserProgress = {
  completedLessons: string[];
  vocabularyKnown: string[];
};

const STORAGE_KEY = 'dental_bloom_progress_v1';

export const getProgress = (): UserProgress => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load progress', e);
  }
  return { completedLessons: [], vocabularyKnown: [] };
};

export const markLessonCompleted = (lessonId: string) => {
  const progress = getProgress();
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save progress', e);
    }
  }
};

export const isLessonCompleted = (lessonId: string): boolean => {
  return getProgress().completedLessons.includes(lessonId);
};