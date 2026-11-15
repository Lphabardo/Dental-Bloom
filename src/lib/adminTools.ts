const RESERVED_IDS = ['lesson-01-start', 'lesson-02-arbeitszeit'];

const isStr = (v: unknown): v is string =>
  typeof v === 'string' && v.trim().length > 0;

const dup = (ids: string[]) => ids.filter((x, i) => ids.indexOf(x) !== i);

export type ValidationResult = { ok: boolean; errors: string[]; lesson?: any };

export const parseAndValidate = (raw: string): ValidationResult => {
  const text = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '');

  let lesson: any;
  try {
    lesson = JSON.parse(text);
  } catch {
    return {
      ok: false,
      errors: [
        'Это не похоже на JSON. Вставь текст урока целиком, без слов до и после, и проверь скобки и кавычки.',
      ],
    };
  }

  if (!lesson || typeof lesson !== 'object' || Array.isArray(lesson)) {
    return { ok: false, errors: ['Урок должен быть одним блоком { ... }.'] };
  }

  const errors: string[] = [];

  for (const f of ['id', 'title', 'subtitle', 'moduleTag', 'duration']) {
    if (!isStr(lesson[f])) errors.push(`Поле "${f}" пустое или отсутствует.`);
  }
  if (isStr(lesson.id)) {
    if (!/^[a-z0-9-]+$/.test(lesson.id)) {
      errors.push('"id" только из маленьких латинских букв, цифр и дефисов, например lesson-03-karies.');
    }
    if (RESERVED_IDS.includes(lesson.id)) {
      errors.push('Этот id занят встроенным уроком. Придумай другой.');
    }
  }

  if (
    !Array.isArray(lesson.learningGoals) ||
    lesson.learningGoals.length === 0 ||
    !lesson.learningGoals.every(isStr)
  ) {
    errors.push('"learningGoals" должен быть списком хотя бы из одной цели.');
  }

  const listOf = (name: string): any[] => {
    const v = lesson[name];
    if (!Array.isArray(v) || v.length === 0) {
      errors.push(`"${name}" должен быть списком хотя бы из одного элемента.`);
      return [];
    }
    return v;
  };

  const sections = listOf('sections');
  sections.forEach((s, i) => {
    for (const f of ['id', 'heading', 'explanationRu', 'explanationDe']) {
      if (!isStr(s?.[f])) errors.push(`sections, пункт ${i + 1}: поле "${f}" пустое или отсутствует.`);
    }
  });

  const vocabulary = listOf('vocabulary');
  vocabulary.forEach((v, i) => {
    for (const f of ['id', 'article', 'term', 'translationRu', 'simpleDefinitionDe', 'enTerm', 'enAudio']) {
      if (!isStr(v?.[f])) errors.push(`vocabulary, слово ${i + 1}: поле "${f}" пустое или отсутствует.`);
    }
  });

  const exercises = listOf('exercises');
  exercises.forEach((e, i) => {
    for (const f of ['id', 'question', 'correctAnswer', 'explanationRu']) {
      if (!isStr(e?.[f])) errors.push(`exercises, вопрос ${i + 1}: поле "${f}" пустое или отсутствует.`);
    }
    if (!Array.isArray(e?.options) || e.options.length < 2 || !e.options.every(isStr)) {
      errors.push(`exercises, вопрос ${i + 1}: "options" должен содержать минимум 2 непустых варианта.`);
    } else {
      if (isStr(e.correctAnswer) && !e.options.includes(e.correctAnswer)) {
        errors.push(`exercises, вопрос ${i + 1}: "correctAnswer" должен точно совпадать с одним из вариантов.`);
      }
      if (new Set(e.options).size !== e.options.length) {
        errors.push(`exercises, вопрос ${i + 1}: варианты ответа повторяются.`);
      }
    }
  });

  const groups: [string, any[]][] = [
    ['sections', sections],
    ['vocabulary', vocabulary],
    ['exercises', exercises],
  ];
  for (const [name, arr] of groups) {
    const d = dup(arr.map((x: any) => x?.id).filter(isStr));
    if (d.length) errors.push(`${name}: повторяются id: ${d.join(', ')}.`);
  }

  if (/\[cite/i.test(text) || /\[:\s*\d/.test(text)) {
    errors.push('В тексте остались пометки вроде [cite: 5]. Удали их.');
  }

  return errors.length ? { ok: false, errors } : { ok: true, errors: [], lesson };
};