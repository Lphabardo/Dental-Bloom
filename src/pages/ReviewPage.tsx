import React, { useState } from 'react';
import { getCompletedLessons, recordActivity } from '../features/lessons/lessonProgress';
import { getReviewCards } from '../features/lessons/lessonService';
import { isDue, markKnown, markHard, markForgot } from '../features/lessons/reviewProgress';
import { speak } from '../features/speech';

const loadDue = () =>
  getReviewCards(getCompletedLessons()).filter((c) => isDue(c.key));

export const ReviewPage: React.FC = () => {
  const [queue, setQueue] = useState(loadDue);
  const [total] = useState(() => loadDue().length);
  const [flipped, setFlipped] = useState(false);

  const hasCards = getReviewCards(getCompletedLessons()).length > 0;

  const title = (
    <h1 className="text-2xl font-bold text-bloom-text">Повторение</h1>
  );

  if (!hasCards) {
    return (
      <div className="space-y-4 pb-24">
        {title}
        <div className="bg-white p-6 rounded-2xl border border-bloom-border text-sm text-bloom-muted">
          Пройди первый урок, и здесь появятся слова для повторения.
        </div>
      </div>
    );
  }

  if (queue.length === 0) {
    return (
      <div className="space-y-4 pb-24">
        {title}
        <div className="bg-white p-8 rounded-2xl border border-bloom-border text-center space-y-3">
          <div className="text-4xl">🌸</div>
          <p className="font-semibold text-bloom-text">На сегодня всё повторено.</p>
        </div>
      </div>
    );
  }

  const card = queue[0];

    const finishCard = (remove: boolean) => {
    if (remove && queue.length === 1) recordActivity();
    setQueue((q) => (remove ? q.slice(1) : [...q.slice(1), q[0]]));
    setFlipped(false);
  };

  const know = () => {
    markKnown(card.key);
    finishCard(true);
  };

  const hard = () => {
    markHard(card.key);
    finishCard(true);
  };

  const forgot = () => {
    markForgot(card.key);
    finishCard(false);
  };

  return (
    <div className="space-y-4 pb-24">
      {title}
      <p className="text-xs text-bloom-muted">
        Осталось карточек: {queue.length} из {total}
      </p>

      <div
        onClick={() => setFlipped(true)}
        className="bg-white p-8 rounded-3xl border border-bloom-border shadow-sm text-center space-y-3 min-h-[220px] flex flex-col justify-center cursor-pointer relative"
      >
        <span className="absolute top-3 left-4 text-lg">
          {card.lang === 'de' ? '🇩🇪' : '🇬🇧'}
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            speak(card.speakText, card.lang === 'de' ? 'de-DE' : 'en-US');
          }}
          className="absolute top-3 right-3 text-sm bg-[#FBEAF1] text-[#B95783] px-2.5 py-1 rounded-xl"
        >
          🔊
        </button>

        <div>
          {card.article && (
            <span className="text-xs text-bloom-muted font-semibold mr-2">
              {card.article}
            </span>
          )}
          <span className="text-2xl font-bold text-bloom-text">{card.front}</span>
        </div>

        {flipped ? (
          <>
            <p className="text-base font-medium text-[#B95783]">{card.translationRu}</p>
            <p className="text-xs text-bloom-muted italic">{card.extra}</p>
          </>
        ) : (
          <p className="text-xs text-bloom-muted">Нажми, чтобы увидеть перевод</p>
        )}
      </div>

            {flipped && (
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={forgot}
            className="py-3 rounded-2xl bg-red-50 text-red-700 text-sm font-medium"
          >
            Не помню
          </button>
          <button
            onClick={hard}
            className="py-3 rounded-2xl bg-bloom-light text-bloom-dark text-sm font-medium"
          >
            Сложно
          </button>
          <button
            onClick={know}
            className="py-3 rounded-2xl bg-[#D985A8] hover:bg-[#B95783] text-white text-sm font-medium"
          >
            Знаю
          </button>
        </div>
      )}
    </div>
  );
};