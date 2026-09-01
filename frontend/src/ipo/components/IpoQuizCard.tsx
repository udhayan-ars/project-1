import React, { useState } from 'react';
import { CheckCircle2, XCircle, Award, Sparkles, RotateCcw, ArrowRight } from 'lucide-react';
import { QuizQuestion } from '../types';
import { useSound } from '../../context/SoundContext';

interface IpoQuizCardProps {
  levelNumber: number;
  questions: QuizQuestion[];
  isCompleted: boolean;
  onPassQuiz: () => void;
  onNextLevel: () => void;
  hasNextLevel: boolean;
}

export const IpoQuizCard: React.FC<IpoQuizCardProps> = ({
  levelNumber,
  questions,
  isCompleted,
  onPassQuiz,
  onNextLevel,
  hasNextLevel
}) => {
  const { playClick, playSuccess, playFailure } = useSound();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<boolean>(isCompleted);

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (submitted && isCompleted) return;
    playClick();
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleCheckAnswers = () => {
    playClick();
    const totalQuestions = questions.length;
    let correctCount = 0;

    questions.forEach(q => {
      const selected = selectedAnswers[q.id];
      const opt = q.options.find(o => o.id === selected);
      if (opt && opt.isCorrect) {
        correctCount++;
      }
    });

    setSubmitted(true);

    if (correctCount === totalQuestions) {
      playSuccess();
      onPassQuiz();
    } else {
      playFailure();
    }
  };

  const handleRetry = () => {
    playClick();
    setSubmitted(false);
    setSelectedAnswers({});
  };

  const isAllAnswered = questions.every(q => selectedAnswers[q.id] !== undefined);
  const correctCount = questions.filter(q => {
    const selected = selectedAnswers[q.id];
    const opt = q.options.find(o => o.id === selected);
    return opt?.isCorrect;
  }).length;
  const isPassed = submitted && correctCount === questions.length;

  return (
    <div className="p-6 md:p-8 rounded-2xl bg-[#090e1d] border border-cyan-500/30 shadow-2xl font-mono text-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-400">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-['Space_Grotesk'] text-base font-bold text-white uppercase tracking-wider">
              Level {levelNumber} Comprehension Check
            </h3>
            <p className="text-[11px] text-slate-400 font-sans">
              Test your understanding of core concepts before unlocking the next level.
            </p>
          </div>
        </div>
        <span className="badge-neon-cyan text-[10px] self-start sm:self-auto">3 QUESTIONS • SELF-TEST</span>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((q, qIndex) => {
          const selectedOptId = selectedAnswers[q.id];
          const selectedOption = q.options.find(o => o.id === selectedOptId);

          return (
            <div key={q.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
              <div className="flex items-start gap-2">
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold text-[10px] border border-cyan-500/40 shrink-0">
                  Q{qIndex + 1}
                </span>
                <h4 className="font-['Space_Grotesk'] text-sm font-bold text-white leading-snug">
                  {q.question}
                </h4>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-2 pt-1">
                {q.options.map(opt => {
                  const isSelected = selectedOptId === opt.id;
                  let optionStyles = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white';

                  if (submitted) {
                    if (opt.isCorrect) {
                      optionStyles = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-[0_0_10px_rgba(0,255,102,0.2)] font-bold';
                    } else if (isSelected && !opt.isCorrect) {
                      optionStyles = 'bg-red-950/80 border-red-500 text-red-300 shadow-[0_0_10px_rgba(255,51,102,0.2)]';
                    }
                  } else if (isSelected) {
                    optionStyles = 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-[0_0_10px_rgba(0,243,255,0.25)] font-bold';
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(q.id, opt.id)}
                      className={`p-3 rounded-lg border text-left text-xs transition-all flex items-start justify-between gap-2 ${optionStyles}`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="font-bold opacity-75 uppercase">[{opt.id}]</span>
                        <span className="font-sans leading-relaxed">{opt.text}</span>
                      </div>
                      {submitted && opt.isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      )}
                      {submitted && isSelected && !opt.isCorrect && (
                        <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation note when submitted */}
              {submitted && selectedOption && (
                <div className={`p-2.5 rounded-lg text-[11px] font-sans border ${
                  selectedOption.isCorrect ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' : 'bg-red-950/40 border-red-500/30 text-red-300'
                }`}>
                  💡 <strong>Explanation:</strong> {selectedOption.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <div>
          {submitted && (
            <div className="flex items-center gap-2">
              <span className={`font-bold ${isPassed ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isPassed ? '🎉 3/3 Perfect Score!' : `Score: ${correctCount} / ${questions.length} Correct`}
              </span>
              <span className="text-slate-400 text-[11px]">
                {isPassed ? 'Level concept mastered.' : 'Review explanations and retry.'}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {!submitted ? (
            <button
              onClick={handleCheckAnswers}
              disabled={!isAllAnswered}
              className="cyber-btn-primary py-2.5 px-6 text-xs uppercase font-bold tracking-wider disabled:opacity-50 w-full sm:w-auto"
            >
              <span>Check Answers</span>
            </button>
          ) : isPassed ? (
            hasNextLevel && (
              <button
                onClick={onNextLevel}
                className="cyber-btn-success py-2.5 px-6 text-xs uppercase font-bold tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(0,255,102,0.4)] w-full sm:w-auto"
              >
                <span>Proceed to Level {levelNumber + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )
          ) : (
            <button
              onClick={handleRetry}
              className="cyber-btn-secondary py-2.5 px-6 text-xs uppercase font-bold flex items-center gap-1.5 w-full sm:w-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Comprehension Check</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
