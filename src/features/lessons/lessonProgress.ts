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






const ACTIVITY_KEY = 'dental_bloom_activity_days';

const dayKey = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const getActivityDays = (): string[] => {
  try {
    const raw = localStorage.getItem(ACTIVITY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const recordActivity = () => {
  const today = dayKey(new Date());
  const days = getActivityDays();
  if (!days.includes(today)) {
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify([...days, today]));
  }
  window.dispatchEvent(new Event('lessonProgressUpdated'));
};

export const getStreak = (): number => {
  const days = new Set(getActivityDays());
  const cursor = new Date();
  if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};