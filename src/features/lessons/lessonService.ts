import lesson01 from '../../content/zfa/lf1/lesson-01-role.json';
import lesson02 from '../../content/zfa/lf1/lesson-02-arbeitszeit.json';

export const ALL_LESSONS = [lesson01, lesson02];

export const getAllLessons = () => ALL_LESSONS;

export const getLessonById = (id: string) => {
  return ALL_LESSONS.find((l) => l.id === id) || lesson01;
};

export const getFirstLesson = () => lesson01;






export const getReviewWords = (completedIds: string[]) =>
  ALL_LESSONS
    .filter((l) => completedIds.includes(l.id))
    .flatMap((l) =>
      l.vocabulary.map((v) => ({
        id: v.id,
        article: v.article,
        term: v.term,
        translationRu: v.translationRu,
        definitionDe: v.simpleDefinitionDe,
      }))
    );


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
      l.vocabulary.flatMap((v): ReviewCard[] => [
        {
          key: `${l.id}:${v.id}:de`,
          lang: 'de',
          article: v.article,
          front: v.term,
          speakText: `${v.article} ${v.term}`.replace('/', ','),
          translationRu: v.translationRu,
          extra: v.simpleDefinitionDe,
        },
        {
          key: `${l.id}:${v.id}:en`,
          lang: 'en',
          front: v.enTerm,
          speakText: v.enAudio,
          translationRu: v.translationRu,
          extra: `${v.article} ${v.term}`,
        },
      ])
    );