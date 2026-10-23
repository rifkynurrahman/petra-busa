import React from 'react';
import { sound } from '../utils/audio';

interface DiceRollerProps {
  dice: [number, number];
  isRolling: boolean;
  canRoll: boolean;
  onRoll: () => void;
  activePlayerName: string;
  isAI: boolean;
}

export const DiceRoller: React.FC<DiceRollerProps> = ({
  dice,
  isRolling,
  canRoll,
  onRoll,
  activePlayerName,
  isAI,
}) => {
  const handleRollClick = () => {
    if (!canRoll || isRolling || isAI) return;
    sound.playDiceRoll();
    onRoll();
  };

  const renderDiceFace = (value: number) => {
    // 3x3 grid positions for dice dots
    const dotPositions: Record<number, number[]> = {
      1: [4],
      2: [0, 8],
      3: [0, 4, 8],
      4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8],
      6: [0, 2, 3, 5, 6, 8],
    };

    const activeDots = dotPositions[value] || [4];

    return (
      <div 
        className={`w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-600/60 shadow-lg shadow-black/30 p-2 grid grid-cols-3 grid-rows-3 gap-1 place-items-center transition-transform ${
          isRolling ? 'animate-bounce rotate-12 scale-105' : 'scale-100'
        }`}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div key={idx} className="w-full h-full flex items-center justify-center">
            {activeDots.includes(idx) && (
              <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-amber-950 shadow-inner" />
            )}
          </div>
        ))}
      </div>
    );
  };

  const isDouble = dice[0] === dice[1] && dice[0] > 0;
  const total = dice[0] + dice[1];

  return (
    <div className="flex flex-col items-center justify-center gap-2 p-3 bg-stone-900/80 backdrop-blur-md rounded-2xl border border-amber-600/40 shadow-xl">
      {/* Dice visual container */}
      <div className="flex items-center gap-3">
        {renderDiceFace(dice[0] || 1)}
        {renderDiceFace(dice[1] || 1)}
      </div>

      {/* Total readout & double indicator */}
      <div className="flex items-center gap-2 text-xs md:text-sm font-semibold">
        <span className="text-amber-200">
          Total: <strong className="text-amber-400 font-mono text-base">{total}</strong>
        </span>
        {isDouble && (
          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] animate-pulse">
            Dadu Kembar!
          </span>
        )}
      </div>

      {/* Big Action Button for Smart TV (Remote click / Touch / Spacebar) */}
      <button
        onClick={handleRollClick}
        disabled={!canRoll || isRolling || isAI}
        className={`w-full py-2.5 px-6 rounded-xl font-bold text-sm md:text-base tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${
          canRoll && !isRolling && !isAI
            ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-stone-950 shadow-amber-500/30 scale-100 hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
            : 'bg-stone-800 text-stone-500 border border-stone-700/60 cursor-not-allowed opacity-70'
        }`}
      >
        {isRolling ? (
          <span className="flex items-center gap-2 text-amber-200">
            <span className="inline-block w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            Mengocok Dadu...
          </span>
        ) : isAI ? (
          <span className="text-stone-400 text-xs">Giliran Komputer ({activePlayerName})</span>
        ) : canRoll ? (
          <>
            <span>Kocok Dadu</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] bg-stone-900/60 text-amber-200 rounded border border-amber-400/40 font-mono">
              SPACE / ENTER
            </kbd>
          </>
        ) : (
          <span className="text-stone-400 text-xs">Selesaikan Tindakan</span>
        )}
      </button>
    </div>
  );
};
