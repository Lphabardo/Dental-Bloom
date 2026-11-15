import { supabase } from '../../lib/supabase';
import { ALL_LESSONS } from './lessonService';

const CACHE_KEY = 'dental_bloom_remote_lessons_cache';

const isValidLesson = (l: any): boolean =>
  !!l &&
  typeof l.id === 'string' &&
  typeof l.title === 'string' &&
  Array.isArray(l.learningGoals) &&
  Array.isArray(l.sections) &&
  Array.isArray(l.vocabulary) &&
  Array.isArray(l.exercises);

const addLessons = (items: any[]): boolean => {
  const list = ALL_LESSONS as any[];
  let added = false;
  for (const l of items) {
    if (!isValidLesson(l)) {
      console.warn('Урок пропущен: неверный формат', l?.id);
      continue;
    }
    if (list.some((x) => x.id === l.id)) continue;
    list.push(l);
    added = true;
  }
  return added;
};

export const loadRemoteLessons = async () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) addLessons(JSON.parse(cached));
  } catch {
    // кэш недоступен — не страшно
  }

  try {
    const { data, error } = await supabase
      .from('lessons')
      .select('data')
      .eq('published', true)
      .order('sort_order', { ascending: true });

    if (error || !data) return;

    const items = data.map((row: any) => row.data);
    localStorage.setItem(CACHE_KEY, JSON.stringify(items));
    if (addLessons(items)) {
      window.dispatchEvent(new Event('lessonProgressUpdated'));
    }
  } catch {
    // нет интернета — остаются встроенные уроки
  }
};