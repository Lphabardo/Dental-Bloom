// src/features/lessons/lessonTypes.ts

export type TrackType = 'zfa' | 'german' | 'english';

export type LessonSection = {
  id: string;
  heading: string;
  explanationRu: string;
  explanationDe: string;
};

export type VocabularyItem = {
  id: string;
  term: string;
  article?: string;
  translationRu: string;
  simpleDefinitionDe?: string;
  englishTerm?: string;
};

export type Exercise = {
  id: string;
  type: 'single-choice' | 'true-false';
  question: string;
  options: string[];
  correctAnswer: string;
  explanationRu: string;
};

export type Lesson = {
  id: string;
  title: string;
  subtitle: string;
  track: TrackType;
  estimatedMinutes: number;
  learningGoals: string[];
  sections: LessonSection[];
  vocabulary: VocabularyItem[];
  exercises: Exercise[];
};