const COMPLETED_KEY = 'dental_bloom_completed_lessons';

export const getCompletedLessons = (): string[] => {
  try {
    const raw = localStorage.getItem(COMPLETED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const markLessonCompleted = (lessonId: string) => {
  const completed = getCompletedLessons();
  if (!completed.includes(lessonId)) {
    const updated = [...completed, lessonId];
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('lessonProgressUpdated'));
  }
};

export const isLessonCompleted = (lessonId: string): boolean => {
  return getCompletedLessons().includes(lessonId);
};