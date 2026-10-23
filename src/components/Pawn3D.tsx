import React from 'react';
import { AvatarId } from '../types/game';
import { AVATARS } from '../data/avatars';
import { AvatarSvg } from './AvatarSvg';

interface Pawn3DProps {
  avatarId: AvatarId;
  customPngUrl?: string;
  isRolling?: boolean;
  isIsometric?: boolean;
  size?: number;
  className?: string;
  showPedestal?: boolean;
  playerIndex?: number;
  playerColor?: string;
}

export const Pawn3D: React.FC<Pawn3DProps> = ({
  avatarId,
  customPngUrl,
  isRolling = false,
  isIsometric = true,
  size = 40,
  className = '',
  showPedestal = true,
  playerIndex,
  playerColor,
}) => {
  const avatarInfo = AVATARS.find((a) => a.id === avatarId);
  const resolvedPng = customPngUrl || avatarInfo?.customPng;
  const pColor = playerColor || avatarInfo?.color || '#3b82f6';
  const pAccent = avatarInfo?.accentColor || '#60a5fa';

  // Dynamic standee dimensions strictly calculated from size prop
  const standeeHeight = Math.round(size * 1.52);
  const standeeWidth = Math.round(size * 1.05);

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-end select-none pointer-events-none ${className}`}
      style={{
        width: size,
        height: size * 1.6,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* 1. Floor Ground Shadow (Anchors Pawn to the Board Tile) */}
      <div
        className={`absolute bottom-0 w-[85%] h-3 rounded-full transition-all duration-200 ${
          isRolling ? 'scale-75 opacity-30 translate-y-2' : 'scale-100 opacity-60'
        }`}
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 55%, transparent 75%)',
          filter: 'blur(1.5px)',
          transform: 'rotateX(55deg) translateY(2px)',
        }}
      />

      {/* 2. 3D Acrylic Disc Pedestal (Only shown when not cluttered) */}
      {showPedestal && (
        <div
          className={`absolute bottom-0.5 w-[85%] h-3 rounded-full transition-all duration-200 flex items-center justify-center ${
            isRolling ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
          }`}
          style={{
            transform: 'rotateX(55deg)',
            background:
              'radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.95) 0%, rgba(240,248,255,0.7) 45%, rgba(180,200,225,0.3) 100%)',
            boxShadow: `0 2.5px 0 ${pColor}, 0 4px 6px rgba(0,0,0,0.35)`,
            border: `1.5px solid ${pColor}`,
          }}
        >
          {/* Acrylic Slot Peg with Player Glow */}
          <div
            className="w-3.5 h-1 rounded-xs bg-white/95 border border-white"
            style={{
              boxShadow: `0 0 5px ${pAccent}`,
            }}
          />
        </div>
      )}

      {/* 3. UPRIGHT 3D CHARACTER STANDEE (Faces Camera Vertically, Pops Off Board) */}
      <div
        className={`relative z-30 flex flex-col items-center justify-end transition-all duration-150 ${
          isRolling
            ? 'animate-bounce -translate-y-5 scale-110'
            : '-translate-y-0.5 hover:scale-105'
        }`}
        style={{
          // Perfectly counter-rotate to face camera perpendicular to the board
          transform: isIsometric
            ? 'rotateZ(10deg) rotateX(-36deg) translateY(-2px) translateZ(22px)'
            : 'none',
          transformOrigin: 'bottom center',
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
        }}
      >
        {/* Overhead Player Badge - Sleek circular pin, perfectly proportioned */}
        {playerIndex !== undefined && (
          <div
            className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center shrink-0 pointer-events-none"
            style={{
              transform: 'translateZ(12px)',
            }}
          >
            <div
              className="w-5 h-5 rounded-full text-[8.5px] font-black font-mono text-white border-[1.5px] border-white flex items-center justify-center shadow-md select-none leading-none shrink-0"
              style={{
                backgroundColor: pColor,
                boxShadow: `0 2px 5px rgba(0,0,0,0.5), 0 0 8px ${pAccent}`,
              }}
            >
              P{playerIndex + 1}
            </div>
          </div>
        )}

        {/* Character Image */}
        {resolvedPng ? (
          <img
            src={resolvedPng}
            alt={`Pion Player ${playerIndex !== undefined ? playerIndex + 1 : ''}`}
            style={{
              height: `${standeeHeight}px`,
              maxHeight: `${standeeHeight}px`,
              width: 'auto',
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)',
            }}
            className="object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)] select-none pointer-events-none"
            loading="eager"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <div
            style={{
              width: `${standeeWidth}px`,
              height: `${standeeWidth}px`,
            }}
            className="flex items-center justify-center filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)]"
          >
            <AvatarSvg avatarId={avatarId} size="100%" />
          </div>
        )}
      </div>
    </div>
  );
};
