const REVIEW_KEY = 'dental_bloom_review_state';
const LEVEL_DAYS = [0, 3, 7, 14]; // через сколько дней показать после "Знаю"

type ReviewState = Record<string, { level: number; due: string }>;

const dayKey = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const inDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return dayKey(d);
};

const load = (): ReviewState => {
  try {
    const raw = localStorage.getItem(REVIEW_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const save = (state: ReviewState) => {
  localStorage.setItem(REVIEW_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event('lessonProgressUpdated'));
};

// Пора ли показывать карточку (новая карточка тоже "пора")
export const isDue = (cardKey: string): boolean => {
  const s = load()[cardKey];
  return !s || s.due <= dayKey(new Date());
};

// Кнопка "Знаю"
export const markKnown = (cardKey: string) => {
  const state = load();
  const level = Math.min((state[cardKey]?.level ?? 0) + 1, LEVEL_DAYS.length - 1);
  state[cardKey] = { level, due: inDays(LEVEL_DAYS[level]) };
  save(state);
};

// Кнопка "Сложно"
export const markHard = (cardKey: string) => {
  const state = load();
  const level = state[cardKey]?.level ?? 0;
  state[cardKey] = { level, due: inDays(1) };
  save(state);
};

// Кнопка "Не помню"
export const markForgot = (cardKey: string) => {
  const state = load();
  state[cardKey] = { level: 0, due: inDays(0) };
  save(state);
};