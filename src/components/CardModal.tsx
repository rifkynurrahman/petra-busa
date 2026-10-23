import React, { useEffect } from 'react';
import { KesempatanCard, Player } from '../types/game';
import { sound } from '../utils/audio';

interface CardModalProps {
  card: KesempatanCard;
  player: Player;
  onClose: () => void;
}

export const CardModal: React.FC<CardModalProps> = ({ card, player, onClose }) => {
  useEffect(() => {
    sound.playCardDraw();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-stone-900 border-2 border-amber-500 rounded-3xl p-6 shadow-2xl shadow-amber-500/20 overflow-hidden text-center">
        {/* Background batik ornament effect */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Top Header Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-bold tracking-wider uppercase mb-3">
          <span>{card.badge}</span>
        </div>

        {/* Big Card Icon Seal */}
        <div className="w-20 h-20 mx-auto my-2 rounded-2xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 border-2 border-amber-400 flex items-center justify-center shadow-lg shadow-amber-900/50">
          <svg className="w-10 h-10 text-amber-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        </div>

        <h3 className="text-xl md:text-2xl font-extrabold text-amber-200 font-display mt-2">
          {card.title}
        </h3>
        <p className="text-xs text-amber-400 font-medium tracking-wide mt-0.5">
          {card.subtitle}
        </p>

        {/* Card Body Description */}
        <div className="my-5 p-4 rounded-xl bg-stone-950/70 border border-amber-600/30 text-stone-200 text-sm md:text-base leading-relaxed">
          {card.description}

          {card.amount && (
            <div className={`mt-3 font-mono font-extrabold text-lg ${card.effect === 'money_gain' || card.effect === 'all_players_pay' ? 'text-emerald-400' : 'text-rose-400'}`}>
              {card.effect === 'money_gain' || card.effect === 'all_players_pay' ? '+' : '-'} {formatRupiah(card.amount)}
            </div>
          )}
        </div>

        <p className="text-xs text-stone-400 mb-4">
          Diberikan kepada: <strong className="text-amber-300">{player.name}</strong>
        </p>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3 px-6 rounded-xl font-extrabold text-stone-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 shadow-lg shadow-amber-500/30 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Lanjutkan Permainan</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-stone-900/60 text-amber-200 rounded border border-amber-300/40 font-mono">
            SPACE / ENTER
          </kbd>
        </button>
      </div>
    </div>
  );
};
