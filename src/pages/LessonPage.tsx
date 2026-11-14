import React, { useState, useEffect } from 'react';
import { getLessonById } from '../features/lessons/lessonService';
import { markLessonCompleted } from '../features/lessons/lessonProgress';

interface LessonPageProps {
  lessonId: string;
  onBack: () => void;
}

export const LessonPage: React.FC<LessonPageProps> = ({ lessonId, onBack }) => {
  const lesson = getLessonById(lessonId);
  const [step, setStep] = useState<'intro' | 'vocabulary' | 'exercises' | 'done'>('intro');
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    setStep('intro');
    setCurrentExIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, [lessonId]);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  const speak = (text: string, lang: 'de-DE' | 'en-US' = 'de-DE') => {
    if (!('speechSynthesis' in window)) {
      alert('Твой браузер не поддерживает озвучку текста.');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.95;

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const langCode = lang.split('-')[0].toLowerCase();
      const availableVoices = voices.filter(v => v.lang.toLowerCase().includes(langCode));

      if (availableVoices.length > 0) {
        const bestVoice = availableVoices.find(v => 
          v.name.toLowerCase().includes('natural') || 
          v.name.toLowerCase().includes('google') || 
          v.name.toLowerCase().includes('enhanced') ||
          v.name.toLowerCase().includes('siri') ||
          v.name.toLowerCase().includes('premium')
        ) || availableVoices[0];

        utterance.voice = bestVoice;
      }
    }

    window.speechSynthesis.speak(utterance);
  };

  const handleAnswerCheck = (option: string) => {
    const currentQuestion = lesson.exercises[currentExIndex];
    setSelectedAnswer(option);
    setIsCorrect(option === currentQuestion.correctAnswer);
  };

  const handleNextExercise = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    if (currentExIndex < lesson.exercises.length - 1) {
      setCurrentExIndex(currentExIndex + 1);
    } else {
      markLessonCompleted(lesson.id);
      setStep('done');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-[#FFF9F6] min-h-screen pb-24">
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onBack}
          className="text-[#817782] text-sm font-medium hover:text-[#34313A]"
        >
          ← Назад
        </button>
        <span className="text-xs bg-[#FBEAF1] text-[#B95783] px-3 py-1 rounded-full font-semibold">
          {(lesson as any).moduleTag || 'ZFA Schule · LF 1 & PuG'}
        </span>
      </div>

      <h1 className="text-2xl font-bold text-[#34313A] mb-1">{lesson.title}</h1>
      <p className="text-sm text-[#817782] mb-6">{lesson.subtitle}</p>

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
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[#34313A] text-lg">{sec.heading}</h3>
                <button
                  onClick={() => speak(sec.explanationDe, 'de-DE')}
                  className="text-sm bg-[#FBEAF1] text-[#B95783] p-2 rounded-xl hover:bg-[#F0E4E9] transition-all"
                  title="Прослушать на немецком"
                >
                  🔊
                </button>
              </div>
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

      {step === 'vocabulary' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[#34313A]">Важные слова (Wortschatz & English)</h2>
          
          {lesson.vocabulary.map((vocab: any) => {
            let enTerm = vocab.enTerm || 'Dental Term';
            let enAudio = vocab.enAudio || enTerm;
            if (!vocab.enTerm) {
              if (vocab.term === 'Arbeitszeit') { enTerm = 'Working hours'; enAudio = 'Working hours'; }
              else if (vocab.term === 'Ruhepause') { enTerm = 'Rest break'; enAudio = 'Break'; }
              else if (vocab.term === 'Urlaub') { enTerm = 'Vacation / Leave'; enAudio = 'Vacation'; }
              else if (vocab.term === 'Auszubildende') { enTerm = 'Trainee / Dental Assistant'; enAudio = 'Dental Assistant'; }
            }

            return (
              <div key={vocab.id} className="bg-white p-4 rounded-2xl shadow-sm border border-[#F0E4E9] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-[#817782] font-semibold">{vocab.article}</span>
                    <span className="text-lg font-bold text-[#34313A]">{vocab.term}</span>
                  </div>
                  <button
                    onClick={() => speak(`${vocab.article || ''} ${vocab.term}`, 'de-DE')}
                    className="text-sm bg-[#FBEAF1] text-[#B95783] px-2.5 py-1 rounded-xl hover:bg-[#F0E4E9] transition-all"
                  >
                    🔊 DE
                  </button>
                </div>

                <p className="text-sm font-medium text-[#B95783]">{vocab.translationRu}</p>
                <p className="text-xs text-[#817782] italic">🇩🇪 {vocab.simpleDefinitionDe}</p>

                <div className="mt-2 pt-2 border-t border-[#F0E4E9] flex items-center justify-between bg-[#FFF9F6] p-2.5 rounded-xl">
                  <div className="text-xs">
                    <span className="font-bold text-[#34313A]">🇬🇧 Dental English: </span>
                    <span className="text-[#817782] italic">{enTerm}</span>
                  </div>
                  <button
                    onClick={() => speak(enAudio, 'en-US')}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-200 transition-all"
                  >
                    🔊 EN
                  </button>
                </div>
              </div>
            );
          })}

          <button
            onClick={() => setStep('exercises')}
            className="w-full mt-6 bg-[#D985A8] hover:bg-[#B95783] text-white font-medium py-3.5 px-6 rounded-2xl shadow-md transition-all"
          >
            Перейти к тесту →
          </button>
        </div>
      )}

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

      {step === 'done' && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#F0E4E9] text-center space-y-4">
          <div className="text-4xl">🌸</div>
          <h2 className="text-xl font-bold text-[#34313A]">Урок успешно пройден!</h2>
          <p className="text-sm text-[#817782]">
            Вы отлично потрудились и закрепили материал. Прогресс сохранен!
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