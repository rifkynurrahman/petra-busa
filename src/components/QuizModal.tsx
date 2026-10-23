import React, { useState, useEffect } from 'react';
import { TantanganCard, Player } from '../types/game';
import { sound } from '../utils/audio';

interface QuizModalProps {
  card: TantanganCard;
  player: Player;
  onComplete: (isCorrect: boolean) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ card, player, onComplete }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(25);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Timer countdown
  useEffect(() => {
    if (hasAnswered) return;
    if (timeLeft <= 0) {
      handleAnswer(-1); // timed out
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, hasAnswered]);

  // AI auto-answer simulation
  useEffect(() => {
    if (player.isAI && !hasAnswered) {
      const aiDelay = setTimeout(() => {
        // 75% chance AI gets it right
        const willBeCorrect = Math.random() < 0.75;
        const chosen = willBeCorrect
          ? card.correctIndex
          : (card.correctIndex + 1) % 4;
        handleAnswer(chosen);
      }, 2500);

      return () => clearTimeout(aiDelay);
    }
  }, [player.isAI, hasAnswered, card.correctIndex]);

  // Keyboard shortcut listener (keys 1, 2, 3, 4 or A, B, C, D)
  useEffect(() => {
    if (player.isAI || hasAnswered) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Digit1', 'KeyA'].includes(e.code)) handleAnswer(0);
      else if (['Digit2', 'KeyB'].includes(e.code)) handleAnswer(1);
      else if (['Digit3', 'KeyC'].includes(e.code)) handleAnswer(2);
      else if (['Digit4', 'KeyD'].includes(e.code)) handleAnswer(3);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasAnswered, player.isAI]);

  const handleAnswer = (index: number) => {
    if (hasAnswered) return;
    setSelectedOption(index);
    setHasAnswered(true);

    const isCorrect = index === card.correctIndex;
    if (isCorrect) {
      sound.playQuizSuccess();
    } else {
      sound.playQuizFail();
    }
  };

  const isCorrect = selectedOption === card.correctIndex;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-stone-900 border-2 border-rose-500/80 rounded-3xl p-5 md:p-8 shadow-2xl shadow-rose-900/30 overflow-y-auto max-h-[92vh] my-auto">
        {/* Background ambient lighting */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/50 text-rose-300 text-xs font-bold uppercase tracking-wider">
              {card.badge}
            </span>
            <span className="text-xs text-stone-400">
              Pemain: <strong className="text-stone-200">{player.name}</strong>
            </span>
          </div>

          {/* Countdown timer badge */}
          <div className={`px-3 py-1 rounded-full font-mono font-bold text-xs flex items-center gap-1.5 border ${
            timeLeft <= 5
              ? 'bg-rose-950 text-rose-400 border-rose-500 animate-pulse'
              : 'bg-stone-800 text-amber-300 border-stone-700'
          }`}>
            <span>⏱️</span>
            <span>{timeLeft}s</span>
          </div>
        </div>

        {/* Question Title & Text */}
        <h3 className="text-lg md:text-xl font-extrabold text-stone-100 font-display leading-snug">
          {card.question}
        </h3>

        {/* Options Grid (4 options: A, B, C, D) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-5">
          {card.options.map((opt, idx) => {
            const isThisOptionSelected = selectedOption === idx;
            const isThisTheCorrectAnswer = idx === card.correctIndex;

            let btnStyle = 'bg-stone-950/80 border-stone-800 text-stone-200 hover:border-amber-400 hover:bg-stone-800/80';

            if (hasAnswered) {
              if (isThisTheCorrectAnswer) {
                btnStyle = 'bg-emerald-950/90 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400/50';
              } else if (isThisOptionSelected && !isThisTheCorrectAnswer) {
                btnStyle = 'bg-rose-950/90 border-rose-500 text-rose-300 line-through';
              } else {
                btnStyle = 'bg-stone-950/40 border-stone-900 text-stone-600 opacity-50';
              }
            }

            return (
              <button
                key={idx}
                disabled={hasAnswered || player.isAI}
                onClick={() => handleAnswer(idx)}
                className={`p-3.5 rounded-xl border text-left font-medium text-sm md:text-base transition-all duration-200 flex items-center justify-between group cursor-pointer ${btnStyle}`}
              >
                <span>{opt}</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-stone-900/80 text-stone-400 border border-stone-700/60 group-hover:text-amber-300">
                  {idx + 1}
                </span>
              </button>
            );
          })}
        </div>

        {/* Result Explanation Card */}
        {hasAnswered && (
          <div className={`p-4 rounded-xl border mb-5 animate-fade-in ${
            isCorrect
              ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-200'
              : 'bg-rose-950/50 border-rose-500/60 text-rose-200'
          }`}>
            <div className="flex items-center gap-2 font-bold text-base mb-1">
              <span>{isCorrect ? '🎉 Jawaban Benar!' : '❌ Jawaban Kurang Tepat!'}</span>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-black/40">
                {isCorrect ? `+${formatRupiah(card.rewardCash || card.reward || 15000000)}` : `-${formatRupiah(card.penalty)}`}
              </span>
            </div>
            <p className="text-xs md:text-sm text-stone-300 leading-relaxed">
              {card.explanation}
            </p>
          </div>
        )}

        {/* Footer info & Proceed Button */}
        {hasAnswered ? (
          <button
            onClick={() => onComplete(isCorrect)}
            className="w-full py-3 px-6 rounded-xl font-extrabold text-stone-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 shadow-lg shadow-amber-500/30 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Lanjutkan Permainan</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-stone-900/60 text-amber-200 rounded border border-amber-300/40 font-mono">
              SPACE / ENTER
            </kbd>
          </button>
        ) : (
          <div className="flex items-center justify-between text-[11px] text-stone-500">
            <span>Pilih salah satu jawaban (1-4) untuk menjawab</span>
            <span>Hadiah: <strong className="text-emerald-400 font-mono">{formatRupiah(card.rewardCash || card.reward || 15000000)}</strong></span>
          </div>
        )}
      </div>
    </div>
  );
};
