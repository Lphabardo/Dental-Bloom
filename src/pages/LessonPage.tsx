// src/pages/LessonPage.tsx
import React, { useState } from 'react';
import { getFirstLesson } from '../features/lessons/lessonService';
import { markLessonCompleted, isLessonCompleted } from '../features/lessons/lessonProgress';

export const LessonPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const lesson = getFirstLesson();
  const [step, setStep] = useState<'intro' | 'vocabulary' | 'exercises' | 'done'>('intro');
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  

  const handleAnswerCheck = (option: string) => {
    const currentQuestion = lesson.exercises[currentExIndex];
    setSelectedAnswer(option);
    const correct = option === currentQuestion.correctAnswer;
    setIsCorrect(correct);
  };

  const handleNextExercise = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    if (currentExIndex < lesson.exercises.length - 1) {
      setCurrentExIndex(currentExIndex + 1);
    } else {
      markLessonCompleted(lesson.id);
      setCompleted(true);
      setStep('done');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-[#FFF9F6] min-h-screen pb-20">
      {/* Шапка урока */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onBack}
          className="text-[#817782] text-sm font-medium hover:text-[#34313A]"
        >
          ← Назад
        </button>
        <span className="text-xs bg-[#FBEAF1] text-[#B95783] px-3 py-1 rounded-full font-semibold">
          ZFA Schule · LF 1
        </span>
      </div>

      <h1 className="text-2xl font-bold text-[#34313A] mb-1">{lesson.title}</h1>
      <p className="text-sm text-[#817782] mb-6">{lesson.subtitle}</p>

      {/* Этап 1: Теория (Intro) */}
      {step === 'intro' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#F0E4E9]">
            <h3 className="text-xs font-bold text-[#B95783] uppercase tracking-wider mb-2">Цели урока</h3>
            <ul className="list-disc list-inside text-sm text-[#34313A] space-y-1">
              {lesson.learningGoals.map((goal, idx) => (
                <li key={idx}>{goal}</li>
              ))}
            </ul>
          </div>

          {lesson.sections.map((sec) => (
            <div key={sec.id} className="bg-white p-5 rounded-2xl shadow-sm border border-[#F0E4E9] space-y-3">
              <h3 className="font-semibold text-[#34313A] text-lg">{sec.heading}</h3>
              <p className="text-sm text-[#34313A] leading-relaxed">🇷🇺 {sec.explanationRu}</p>
              <p className="text-sm text-[#B95783] italic bg-[#FBEAF1] p-3 rounded-xl">🇩🇪 {sec.explanationDe}</p>
            </div>
          ))}

          <button
            onClick={() => setStep('vocabulary')}
            className="w-full mt-6 bg-[#D985A8] hover:bg-[#B95783] text-white font-medium py-3.5 px-6 rounded-2xl shadow-md transition-all"
          >
            Далее: Словарь терминов →
          </button>
        </div>
      )}

      {/* Этап 2: Словарь (Vocabulary) */}
      {step === 'vocabulary' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[#34313A]">Важные слова (Wortschatz)</h2>
          {lesson.vocabulary.map((vocab) => (
            <div key={vocab.id} className="bg-white p-4 rounded-2xl shadow-sm border border-[#F0E4E9] space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-[#817782] font-semibold">{vocab.article}</span>
                <span className="text-lg font-bold text-[#34313A]">{vocab.term}</span>
              </div>
              <p className="text-sm font-medium text-[#B95783]">{vocab.translationRu}</p>
              <p className="text-xs text-[#817782] italic">🇩🇪 {vocab.simpleDefinitionDe}</p>
            </div>
          ))}

          <button
            onClick={() => setStep('exercises')}
            className="w-full mt-6 bg-[#D985A8] hover:bg-[#B95783] text-white font-medium py-3.5 px-6 rounded-2xl shadow-md transition-all"
          >
            Перейти к тесту →
          </button>
        </div>
      )}

      {/* Этап 3: Тест (Exercises) */}
      {step === 'exercises' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#F0E4E9] space-y-4">
          <div className="flex justify-between text-xs text-[#817782] font-medium">
            <span>Вопрос {currentExIndex + 1} из {lesson.exercises.length}</span>
            <span>Тест</span>
          </div>

          <h3 className="text-base font-semibold text-[#34313A]">
            {lesson.exercises[currentExIndex].question}
          </h3>

          <div className="space-y-2.5 pt-2">
            {lesson.exercises[currentExIndex].options.map((option, idx) => {
              let btnStyle = "w-full text-left p-3.5 rounded-xl border border-[#F0E4E9] text-sm font-medium transition-all ";
              if (selectedAnswer === null) {
                btnStyle += "bg-white hover:bg-[#FFF9F6] text-[#34313A]";
              } else if (option === lesson.exercises[currentExIndex].correctAnswer) {
                btnStyle += "bg-green-50 border-green-300 text-green-800 font-bold";
              } else if (option === selectedAnswer) {
                btnStyle += "bg-red-50 border-red-300 text-red-800";
              } else {
                btnStyle += "bg-white text-[#817782] opacity-60";
              }

              return (
                <button
                  key={idx}
                  disabled={selectedAnswer !== null}
                  onClick={() => handleAnswerCheck(option)}
                  className={btnStyle}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {selectedAnswer !== null && (
            <div className={`p-4 rounded-xl text-sm ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              <p className="font-semibold mb-1">{isCorrect ? '✨ Правильно!' : '❌ Не совсем верно.'}</p>
              <p>{lesson.exercises[currentExIndex].explanationRu}</p>
            </div>
          )}

          {selectedAnswer !== null && (
            <button
              onClick={handleNextExercise}
              className="w-full mt-4 bg-[#D985A8] hover:bg-[#B95783] text-white font-medium py-3.5 px-6 rounded-2xl shadow-md transition-all"
            >
              {currentExIndex < lesson.exercises.length - 1 ? 'Следующий вопрос →' : 'Завершить урок 🎉'}
            </button>
          )}
        </div>
      )}

      {/* Этап 4: Завершение (Done) */}
      {step === 'done' && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#F0E4E9] text-center space-y-4">
          <div className="text-4xl">🌸</div>
          <h2 className="text-xl font-bold text-[#34313A]">Урок успешно пройден!</h2>
          <p className="text-sm text-[#817782]">
            Вы отлично потрудились и закрепили материал по теме LF 1. Прогресс сохранен в памяти устройства.
          </p>
          <button
            onClick={onBack}
            className="w-full bg-[#D985A8] hover:bg-[#B95783] text-white font-medium py-3.5 px-6 rounded-2xl shadow-md transition-all"
          >
            Вернуться на главную
          </button>
        </div>
      )}
    </div>
  );
};