import React, { useState } from 'react';
import { getCompletedLessons } from '../features/lessons/lessonProgress';
import { getReviewWords } from '../features/lessons/lessonService';

const loadWords = () => getReviewWords(getCompletedLessons());

export const ReviewPage: React.FC = () => {
  const [queue, setQueue] = useState(loadWords);
  const [total, setTotal] = useState(() => loadWords().length);
  const [flipped, setFlipped] = useState(false);

  const restart = () => {
    const words = loadWords();
    setQueue(words);
    setTotal(words.length);
    setFlipped(false);
  };

  const know = () => {
    setQueue((q) => q.slice(1));
    setFlipped(false);
  };

  const again = () => {
    setQueue((q) => [...q.slice(1), q[0]]);
    setFlipped(false);
  };

  if (total === 0) {
    return (
      <div className="space-y-4 pb-24">
        <h1 className="text-2xl font-bold text-bloom-text">Повторение</h1>
        <div className="bg-white p-6 rounded-2xl border border-bloom-border text-sm text-bloom-muted">
          Пройди первый урок, и здесь появятся слова для повторения.
        </div>
      </div>
    );
  }

  if (queue.length === 0) {
    return (
      <div className="space-y-4 pb-24">
        <h1 className="text-2xl font-bold text-bloom-text">Повторение</h1>
        <div className="bg-white p-8 rounded-2xl border border-bloom-border text-center space-y-4">
          <div className="text-4xl">🌸</div>
          <p className="font-semibold text-bloom-text">Все слова повторены!</p>
          <button
            onClick={restart}
            className="w-full bg-[#D985A8] hover:bg-[#B95783] text-white font-medium py-3 rounded-2xl"
          >
            Повторить ещё раз
          </button>
        </div>
      </div>
    );
  }

  const word = queue[0];

  return (
    <div className="space-y-4 pb-24">
      <h1 className="text-2xl font-bold text-bloom-text">Повторение</h1>
      <p className="text-xs text-bloom-muted">Осталось слов: {queue.length} из {total}</p>

      <div
        onClick={() => setFlipped(true)}
        className="bg-white p-8 rounded-3xl border border-bloom-border shadow-sm text-center space-y-3 min-h-[200px] flex flex-col justify-center cursor-pointer"
      >
        <div>
          <span className="text-xs text-bloom-muted font-semibold mr-2">{word.article}</span>
          <span className="text-2xl font-bold text-bloom-text">{word.term}</span>
        </div>

        {flipped ? (
          <>
            <p className="text-base font-medium text-[#B95783]">{word.translationRu}</p>
            <p className="text-xs text-bloom-muted italic">🇩🇪 {word.definitionDe}</p>
          </>
        ) : (
          <p className="text-xs text-bloom-muted">Нажми, чтобы увидеть перевод</p>
        )}
      </div>

      {flipped && (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={again}
            className="py-3 rounded-2xl bg-bloom-light text-bloom-dark font-medium"
          >
            Ещё раз
          </button>
          <button
            onClick={know}
            className="py-3 rounded-2xl bg-[#D985A8] hover:bg-[#B95783] text-white font-medium"
          >
            Знаю
          </button>
        </div>
      )}
    </div>
  );
};