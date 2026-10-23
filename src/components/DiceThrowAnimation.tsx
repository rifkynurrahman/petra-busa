import React, { useEffect, useState } from 'react';
import { sound } from '../utils/audio';

interface DiceThrowAnimationProps {
  d1: number;
  d2: number;
  onAnimationComplete: () => void;
}

export const DiceThrowAnimation: React.FC<DiceThrowAnimationProps> = ({
  d1,
  d2,
  onAnimationComplete,
}) => {
  // Animation phases:
  // 1. 'flying': dice fly in tumbling from outside the bottom of the screen into the board center
  // 2. 'bounce': hit the center plaza floor and bounce with clatter
  // 3. 'settled': rest at target rotation showing numbers d1 & d2
  const [phase, setPhase] = useState<'flying' | 'bounce' | 'settled'>('flying');
  const isDouble = d1 === d2;
  const total = d1 + d2;

  // Dice face rotations to show target face towards the viewer
  const getTargetRotation = (val: number) => {
    switch (val) {
      case 1: return { x: 0, y: 0 };
      case 6: return { x: 0, y: 180 };
      case 2: return { x: 0, y: 90 };
      case 5: return { x: 0, y: -90 };
      case 3: return { x: -90, y: 0 };
      case 4: return { x: 90, y: 0 };
      default: return { x: 0, y: 0 };
    }
  };

  useEffect(() => {
    // 1. Sound of dice thrown
    sound.playDiceRoll();

    // 2. Bounce on floor after 450ms
    const bounceTimer = setTimeout(() => {
      setPhase('bounce');
      sound.playCoin();
    }, 450);

    // 3. Settle on final face after 950ms
    const settleTimer = setTimeout(() => {
      setPhase('settled');
      if (isDouble) {
        sound.playGamelanChime();
      }
    }, 950);

    // 4. Complete and start pawn movement after 1800ms
    const completeTimer = setTimeout(() => {
      onAnimationComplete();
    }, 1800);

    return () => {
      clearTimeout(bounceTimer);
      clearTimeout(settleTimer);
      clearTimeout(completeTimer);
    };
  }, [d1, d2, isDouble, onAnimationComplete]);

  const targetRot1 = getTargetRotation(d1);
  const targetRot2 = getTargetRotation(d2);

  // Render dice pips on each cube face
  const renderPips = (num: number) => {
    const isRed = num === 1 || num === 4;
    const pipColor = isRed ? '#DC2626' : '#1E293B';

    switch (num) {
      case 1:
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-5 h-5 rounded-full shadow-inner" style={{ backgroundColor: pipColor }} />
          </div>
        );
      case 2:
        return (
          <div className="w-full h-full p-2 flex justify-between">
            <div className="w-2.5 h-2.5 rounded-full self-start" style={{ backgroundColor: pipColor }} />
            <div className="w-2.5 h-2.5 rounded-full self-end" style={{ backgroundColor: pipColor }} />
          </div>
        );
      case 3:
        return (
          <div className="w-full h-full p-2 flex justify-between">
            <div className="w-2.5 h-2.5 rounded-full self-start" style={{ backgroundColor: pipColor }} />
            <div className="w-2.5 h-2.5 rounded-full self-center" style={{ backgroundColor: pipColor }} />
            <div className="w-2.5 h-2.5 rounded-full self-end" style={{ backgroundColor: pipColor }} />
          </div>
        );
      case 4:
        return (
          <div className="w-full h-full p-2 grid grid-cols-2 grid-rows-2 items-center justify-items-center">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pipColor }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pipColor }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pipColor }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pipColor }} />
          </div>
        );
      case 5:
        return (
          <div className="w-full h-full p-2 relative flex items-center justify-center">
            <div className="absolute top-2 left-2 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pipColor }} />
            <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pipColor }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pipColor }} />
            <div className="absolute bottom-2 left-2 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pipColor }} />
            <div className="absolute bottom-2 right-2 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pipColor }} />
          </div>
        );
      case 6:
        return (
          <div className="w-full h-full p-2 grid grid-cols-2 grid-rows-3 items-center justify-items-center gap-y-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pipColor }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pipColor }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pipColor }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pipColor }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pipColor }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pipColor }} />
          </div>
        );
      default:
        return null;
    }
  };

  // Render a 3D Cube Die
  const renderCube = (
    index: 1 | 2,
    targetRot: { x: number; y: number }
  ) => {
    // Dynamic transform trajectory:
    // When 'flying': die starts far outside the bottom of the screen!
    // When 'bounce': hits center floor with bounce lift
    // When 'settled': perfectly landed at target rotation
    let transformStyle = '';
    let shadowStyle = '';

    if (phase === 'flying') {
      const startX = index === 1 ? -160 : 160;
      const startY = 380; // outside bottom of screen!
      const spinX = index === 1 ? 1080 : -720;
      const spinY = index === 1 ? -720 : 1080;
      transformStyle = `translate3d(${startX}px, ${startY}px, 200px) scale(1.6) rotateX(${spinX}deg) rotateY(${spinY}deg) rotateZ(360deg)`;
      shadowStyle = 'scale-50 opacity-0 translate-y-12';
    } else if (phase === 'bounce') {
      const bounceX = index === 1 ? -28 : 28;
      const bounceY = -24; // bounce up in air above floor
      const spinX = targetRot.x + (index === 1 ? 360 : -360);
      const spinY = targetRot.y + (index === 1 ? -360 : 360);
      transformStyle = `translate3d(${bounceX}px, ${bounceY}px, 60px) scale(1.1) rotateX(${spinX}deg) rotateY(${spinY}deg) rotateZ(15deg)`;
      shadowStyle = 'scale-75 opacity-40 translate-y-6';
    } else {
      // settled on board floor
      const finalX = index === 1 ? -24 : 24;
      transformStyle = `translate3d(${finalX}px, 0px, 15px) scale(1) rotateX(${targetRot.x}deg) rotateY(${targetRot.y}deg) rotateZ(0deg)`;
      shadowStyle = 'scale-100 opacity-80 translate-y-1';
    }

    return (
      <div className="relative flex flex-col items-center [perspective:1000px]">
        {/* Floor Contact Shadow */}
        <div
          className={`w-12 h-3.5 rounded-full bg-black/70 blur-[2px] transition-all duration-300 ${shadowStyle}`}
          style={{ transform: 'rotateX(55deg)' }}
        />

        {/* 3D Rolling Cube with smooth ease-out physics */}
        <div
          className="relative"
          style={{
            width: 44,
            height: 44,
            transformStyle: 'preserve-3d',
            transition: phase === 'flying'
              ? 'none'
              : phase === 'bounce'
              ? 'transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1)'
              : 'transform 0.5s cubic-bezier(0.15, 0.9, 0.3, 1)',
            transform: transformStyle,
          }}
        >
          {/* Face 1: Front */}
          <div
            className="absolute inset-0 rounded-xl bg-gradient-to-br from-white via-amber-50 to-stone-200 border-2 border-stone-300 shadow-md flex items-center justify-center backface-hidden"
            style={{ transform: 'translateZ(22px)' }}
          >
            {renderPips(1)}
          </div>

          {/* Face 6: Back */}
          <div
            className="absolute inset-0 rounded-xl bg-gradient-to-br from-white via-amber-50 to-stone-200 border-2 border-stone-300 shadow-md flex items-center justify-center backface-hidden"
            style={{ transform: 'rotateY(180deg) translateZ(22px)' }}
          >
            {renderPips(6)}
          </div>

          {/* Face 2: Left */}
          <div
            className="absolute inset-0 rounded-xl bg-gradient-to-br from-white via-amber-50 to-stone-200 border-2 border-stone-300 shadow-md flex items-center justify-center backface-hidden"
            style={{ transform: 'rotateY(-90deg) translateZ(22px)' }}
          >
            {renderPips(2)}
          </div>

          {/* Face 5: Right */}
          <div
            className="absolute inset-0 rounded-xl bg-gradient-to-br from-white via-amber-50 to-stone-200 border-2 border-stone-300 shadow-md flex items-center justify-center backface-hidden"
            style={{ transform: 'rotateY(90deg) translateZ(22px)' }}
          >
            {renderPips(5)}
          </div>

          {/* Face 3: Top */}
          <div
            className="absolute inset-0 rounded-xl bg-gradient-to-br from-white via-amber-50 to-stone-200 border-2 border-stone-300 shadow-md flex items-center justify-center backface-hidden"
            style={{ transform: 'rotateX(90deg) translateZ(22px)' }}
          >
            {renderPips(3)}
          </div>

          {/* Face 4: Bottom */}
          <div
            className="absolute inset-0 rounded-xl bg-gradient-to-br from-white via-amber-50 to-stone-200 border-2 border-stone-300 shadow-md flex items-center justify-center backface-hidden"
            style={{ transform: 'rotateX(-90deg) translateZ(22px)' }}
          >
            {renderPips(4)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="absolute inset-0 z-50 pointer-events-none flex flex-col items-center justify-center overflow-visible">
      <div className="relative flex flex-col items-center overflow-visible">
        {/* Dice Arena with outside throw-in trajectory */}
        <div className="flex items-center justify-center gap-6 py-2 overflow-visible">
          {renderCube(1, targetRot1)}
          {renderCube(2, targetRot2)}
        </div>

        {/* Clean Announcement Banner (MATH CALCULATION REMOVED per user request) */}
        {phase === 'settled' && (
          <div className="mt-2 flex flex-col items-center animate-bounce z-50">
            {isDouble && (
              <div className="px-3 py-0.5 rounded-full bg-gradient-to-r from-red-600 via-amber-500 to-red-600 text-white font-black text-[11px] md:text-xs tracking-wider uppercase shadow-lg border-2 border-yellow-300 animate-pulse mb-1">
                ✨ DADU KEMBAR! ✨
              </div>
            )}
            {/* Simple Step Banner without math calculations */}
            <div className="px-3.5 py-1 rounded-xl bg-stone-950/90 border border-amber-400 text-amber-300 font-black text-sm md:text-base tracking-wide shadow-xl flex items-center gap-1.5">
              <span>🎲</span>
              <span className="text-white font-mono font-black">{total}</span>
              <span>Langkah</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
