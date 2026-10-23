import React from 'react';
import { HouseArtSvg } from './HouseArtSvg';

interface RumahAdat3DProps {
  svgType: string;
  houseLevel: number; // 0: unbuilt preview, 1: Pondok, 2: Rumah Madya, 3: Kompleks Megah, 4: Landmark
  ownerColor?: string;
  ownerName?: string;
  ownerIndex?: number | null;
  isIsometric?: boolean;
  className?: string;
  scale?: number;
}

export const RumahAdat3D: React.FC<RumahAdat3DProps> = ({
  svgType,
  houseLevel,
  ownerColor = '#f59e0b',
  ownerIndex = null,
  isIsometric = true,
  className = '',
  scale = 1,
}) => {
  const isOwned = ownerIndex !== null && ownerIndex !== undefined;
  const level = Math.max(1, houseLevel || 1);
  const isLandmark = level >= 4;

  // Only render when owned or when a house level is built
  if (!isOwned && houseLevel <= 0) {
    return null;
  }

  // Sizing by tier to fit gracefully inside property tiles without clipping roofs
  const getHouseSize = () => {
    switch (level) {
      case 1: return 36; // level 1
      case 2: return 42; // level 2
      case 3: return 48; // level 3
      case 4: return 54; // landmark
      default: return 36;
    }
  };

  const houseSize = getHouseSize();

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-end select-none pointer-events-none ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'bottom center',
      }}
    >
      {/* 1. Floor Ground Shadow */}
      <div
        className="w-10 h-3 rounded-full transition-all duration-300"
        style={{
          background: isOwned
            ? 'radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.15) 50%, transparent 75%)'
            : 'radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, transparent 65%)',
          filter: 'blur(1.5px)',
          transform: 'translateY(2px) scaleX(1.1)',
        }}
      />

      {/* 2. Upright 3D Standing Miniature Container */}
      <div
        className={`relative z-10 flex flex-col items-center justify-end transition-all duration-300 ${
          isOwned ? 'animate-pop-3d' : ''
        }`}
        style={{
          // Standing upright on the back/middle layer of the tile
          transform: isIsometric
            ? 'rotateZ(6deg) rotateX(-28deg) translateY(-2px) translateZ(8px)'
            : 'none',
          transformOrigin: 'bottom center',
        }}
      >
        {/* OWNER FLAGPOLE */}
        {isOwned && (
          <div
            className="absolute -top-1 -left-1.5 z-20 flex items-center"
            style={{
              transform: 'translateZ(4px)',
            }}
          >
            {/* Pole */}
            <div className="w-0.5 h-5 bg-stone-700 rounded-full relative">
              {/* Triangular Flag with Owner Color */}
              <div
                className="absolute top-0.5 left-0.5 px-0.5 py-0.2 rounded-r-xs text-[5px] font-black font-mono text-stone-950 shadow-xs flex items-center"
                style={{
                  backgroundColor: ownerColor,
                  clipPath: 'polygon(0% 0%, 100% 25%, 80% 50%, 100% 75%, 0% 100%)',
                  paddingRight: '4px',
                }}
              >
                P{ownerIndex! + 1}
              </div>
            </div>
          </div>
        )}

        {/* Traditional House Body */}
        <div
          className={`relative transition-all duration-300 ${
            isOwned
              ? isLandmark
                ? 'drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)] scale-105'
                : 'drop-shadow-[0_3px_5px_rgba(0,0,0,0.4)]'
              : 'opacity-65 grayscale-[25%]'
          }`}
        >
          <HouseArtSvg
            type={svgType}
            size={houseSize}
            className={isLandmark ? 'filter drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]' : ''}
          />

          {/* Level Badges (Dots on bottom) */}
          {isOwned && !isLandmark && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-0.5 bg-stone-950/80 px-1 py-0.2 rounded-full border border-amber-400/50 shadow-xs">
              {Array.from({ length: Math.min(3, level) }).map((_, i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full shadow-xs"
                  style={{ backgroundColor: ownerColor }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
