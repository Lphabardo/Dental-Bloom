// Vite автоматически собирает все .json файлы из папки content и всех вложенных папок
const lessonModules = import.meta.glob('../../content/**/*.json', { eager: true });

export const ALL_LESSONS = Object.values(lessonModules)
  .map((mod: any) => mod.default || mod)
  .sort((a, b) => a.id.localeCompare(b.id));

export const getAllLessons = () => ALL_LESSONS;

export const getLessonById = (id: string) => {
  const found = ALL_LESSONS.find((l) => l.id === id);
  if (!found) {
    throw new Error(`Урок с ID "${id}" не найден`);
  }
  return found;
};

export const getFirstLesson = () => ALL_LESSONS[0];

export type ReviewCard = {
  key: string;
  lang: 'de' | 'en';
  article?: string;
  front: string;
  speakText: string;
  translationRu: string;
  extra: string;
};

export const getReviewCards = (completedIds: string[]): ReviewCard[] =>
  ALL_LESSONS
    .filter((l) => completedIds.includes(l.id))
    .flatMap((l) =>
      (l.vocabulary || []).flatMap((v: any): ReviewCard[] => {
        const cards: ReviewCard[] = [];
        const isEnglishOnly = l.id.startsWith('eng-');

        // Немецкая карточка (создаем, если это не чисто английский урок)
        if (!isEnglishOnly && v.term) {
          const fullDe = v.article ? `${v.article} ${v.term}` : v.term;
          cards.push({
            key: `${l.id}:${v.id}:de`,
            lang: 'de',
            article: v.article,
            front: v.term,
            speakText: fullDe.replace('/', ','),
            translationRu: v.translationRu,
            extra: v.simpleDefinitionDe || '',
          });
        }

        // Английская карточка (создаем, если есть enTerm)
        if (v.enTerm) {
          const fullDeExtra = v.article ? `${v.article} ${v.term}` : v.term;
          cards.push({
            key: `${l.id}:${v.id}:en`,
            lang: 'en',
            front: v.enTerm,
            speakText: v.enAudio || v.enTerm,
            translationRu: v.translationRu,
            extra: isEnglishOnly ? (v.simpleDefinitionDe || '') : fullDeExtra,
          });
        }

        return cards;
      })
    );