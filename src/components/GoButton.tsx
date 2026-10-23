import React, { useRef, useState } from 'react';
import { sound } from '../utils/audio';

interface GoButtonProps {
  diceEnergy: number;
  maxDiceEnergy: number;
  multiplier: number;
  onMultiplierChange: () => void;
  onRoll: () => void;
  isRolling: boolean;
  isAutoRoll: boolean;
  onToggleAutoRoll: () => void;
  disabled?: boolean;
}

export const GoButton: React.FC<GoButtonProps> = ({
  diceEnergy,
  maxDiceEnergy,
  multiplier,
  onMultiplierChange,
  onRoll,
  isRolling,
  isAutoRoll,
  onToggleAutoRoll,
  disabled = false,
}) => {
  const [isPressing, setIsPressing] = useState<boolean>(false);
  const pressTimer = useRef<number | null>(null);

  const handlePointerDown = () => {
    if (disabled || isRolling) return;
    setIsPressing(true);

    // If held for 700ms, toggle Auto Roll mode
    pressTimer.current = window.setTimeout(() => {
      onToggleAutoRoll();
      sound.playGamelanChime();
    }, 700);
  };

  const handlePointerUp = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }

    if (isPressing) {
      setIsPressing(false);
      if (!isAutoRoll && !isRolling && !disabled) {
        sound.playDiceRoll();
        onRoll();
      }
    }
  };

  const handlePointerCancel = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
    setIsPressing(false);
  };

  return (
    <div className="flex items-center gap-2 md:gap-3 select-none">
      {/* 1. Compact Multiplier Pill */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onMultiplierChange();
          sound.playCoin();
        }}
        title="Ubah Kelipatan Taruhan"
        className="h-10 md:h-11 px-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-black text-xs md:text-sm font-mono tracking-wider shadow-sm border border-amber-200 cursor-pointer transition-transform hover:scale-105 active:scale-95 flex items-center gap-1 shrink-0"
      >
        <span className="text-[10px] text-amber-950/70 font-sans font-bold">LIPAT</span>
        <span>x{multiplier}</span>
      </button>

      {/* 2. Main 3D Juicy Dice Roll (GO) Pill Button */}
      <div
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onPointerLeave={handlePointerCancel}
        className={`relative h-11 md:h-12 px-6 md:px-8 rounded-full cursor-pointer transition-all duration-150 transform flex items-center justify-center gap-2 ${
          isPressing || isRolling
            ? 'scale-95 translate-y-0.5'
            : 'hover:scale-[1.03] active:scale-95'
        }`}
        style={{
          boxShadow: isPressing || isRolling
            ? '0 2px 0 #7f1d1d, 0 4px 8px rgba(0,0,0,0.3)'
            : '0 5px 0 #7f1d1d, 0 8px 16px rgba(185,28,28,0.45)',
        }}
      >
        {/* Border frame */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-amber-300 via-red-500 to-red-800 p-0.5">
          <div className="w-full h-full rounded-full bg-gradient-to-b from-orange-500 via-red-600 to-red-700 flex items-center justify-center relative overflow-hidden shadow-inner px-4">
            {/* Gloss reflection */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-t-full pointer-events-none" />

            {/* Auto-roll pulse */}
            {isAutoRoll && (
              <div className="absolute inset-0 bg-yellow-300/35 animate-pulse rounded-full pointer-events-none" />
            )}

            <div className="relative z-10 flex items-center gap-2">
              <span className={`text-xl md:text-2xl filter drop-shadow ${isRolling ? 'animate-spin' : ''}`}>
                🎲
              </span>
              <span
                className="text-base md:text-lg font-black font-display text-white tracking-wide uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] leading-none"
                style={{ WebkitTextStroke: '0.8px #7F1D1D' }}
              >
                {isRolling ? 'MELEMPAR...' : isAutoRoll ? 'AUTO ROLL ON' : 'KOCOK DADU'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Compact Dice Energy Capsule */}
      <div className="h-10 md:h-11 px-3 rounded-full bg-stone-900 border border-sky-400/80 shadow-sm flex items-center gap-1.5 shrink-0 font-mono text-xs font-black">
        <span className="text-sm">⚡</span>
        <span className="text-sky-300 tabular-nums">{diceEnergy}</span>
        <span className="text-sky-500 font-normal">/</span>
        <span className="text-sky-400 tabular-nums">{maxDiceEnergy}</span>
      </div>
    </div>
  );
};
