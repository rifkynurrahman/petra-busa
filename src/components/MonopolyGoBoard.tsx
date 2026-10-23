import React from 'react';
import { TileData, TileState, Landmark, Player } from '../types/game';
import { RumahAdat3D } from './RumahAdat3D';
import { Pawn3D } from './Pawn3D';
import { DiceThrowAnimation } from './DiceThrowAnimation';
import { HouseArtSvg } from './HouseArtSvg';

interface MonopolyGoBoardProps {
  tiles: TileData[];
  tileStates: Record<number, TileState>;
  players: Player[];
  activePlayerIndex: number;
  isRolling: boolean;
  landmarks: Landmark[];
  onTileClick: (tile: TileData) => void;
  isIsometricView?: boolean;
  boardScale?: number;
  boardPixelSize?: number;
  diceResult?: { d1: number; d2: number } | null;
  showDiceAnimation?: boolean;
  onDiceAnimationComplete?: () => void;
  onRoll?: () => void;
}

export const MonopolyGoBoard: React.FC<MonopolyGoBoardProps> = ({
  tiles,
  tileStates,
  players,
  activePlayerIndex,
  isRolling,
  onTileClick,
  isIsometricView = false,
  boardScale = 1.0,
  boardPixelSize,
  diceResult,
  showDiceAnimation,
  onDiceAnimationComplete,
  onRoll,
}) => {
  const isCompact = boardPixelSize !== undefined ? boardPixelSize < 480 : false;
  // Grid layout positions for 24 tiles in 7x7 perimeter
  const getTileGridPosition = (id: number) => {
    switch (id) {
      // Bottom row (Right to Left: 0 to 6)
      case 0: return { col: 7, row: 7 }; // START
      case 1: return { col: 6, row: 7 }; // Kudus (Joglo Pencu)
      case 2: return { col: 5, row: 7 }; // Kesempatan
      case 3: return { col: 4, row: 7 }; // Semarang (Joglo Jawa)
      case 4: return { col: 3, row: 7 }; // Yogyakarta (Joglo Kraton)
      case 5: return { col: 2, row: 7 }; // Bandara Soetta
      case 6: return { col: 1, row: 7 }; // Pulau Terasing / Penjara

      // Left column (Bottom to Top: 7 to 11)
      case 7: return { col: 1, row: 6 }; // Aceh (Krong Bade)
      case 8: return { col: 1, row: 5 }; // Tantangan Kuis
      case 9: return { col: 1, row: 4 }; // Medan (Bolon)
      case 10: return { col: 1, row: 3 }; // Padang (Gadang)
      case 11: return { col: 1, row: 2 }; // Pelabuhan Priok (Phinisi)

      // Top row (Left to Right: 12 to 18)
      case 12: return { col: 1, row: 1 }; // Festival Budaya
      case 13: return { col: 2, row: 1 }; // Bali (Candi Bentar)
      case 14: return { col: 3, row: 1 }; // Kesempatan
      case 15: return { col: 4, row: 1 }; // Lombok (Sasak)
      case 16: return { col: 5, row: 1 }; // Flores (Mbaru Niang)
      case 17: return { col: 6, row: 1 }; // Bandara Ngurah Rai
      case 18: return { col: 7, row: 1 }; // Balon Udara / Keliling Nusantara

      // Right column (Top to Bottom: 19 to 23)
      case 19: return { col: 7, row: 2 }; // Pontianak (Radakng)
      case 20: return { col: 7, row: 3 }; // Banjar (Bubungan Tinggi)
      case 21: return { col: 7, row: 4 }; // Tantangan Kuis
      case 22: return { col: 7, row: 5 }; // Toraja (Tongkonan)
      case 23: return { col: 7, row: 6 }; // Papua (Honai)

      default: return { col: 1, row: 1 };
    }
  };

  const formatShortPrice = (num?: number) => {
    if (!num) return '';
    if (num >= 1000000000) return `Rp ${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `Rp ${(num / 1000000).toFixed(1)}M`;
    return `Rp ${(num / 1000).toFixed(0)}K`;
  };

  const activePlayer = players[activePlayerIndex];

  return (
    <div
      className="relative w-full h-full flex items-center justify-center p-1 md:p-3 overflow-visible"
      style={{
        perspective: '1500px',
      }}
    >
      {/* 3D Isometric Board Bevel Platform (Raised wooden & marble slab) */}
      <div
        className="relative transition-all duration-300 ease-out p-2 md:p-3.5 rounded-[28px] bg-gradient-to-b from-[#e8dac5] via-[#ccb79a] to-[#997f5f] border-4 border-[#b89569]"
        style={{
          width: boardPixelSize ? `${boardPixelSize}px` : 'min(96vw, calc(100vh - 110px), 820px)',
          height: boardPixelSize ? `${boardPixelSize}px` : 'min(96vw, calc(100vh - 110px), 820px)',
          maxWidth: '100%',
          maxHeight: '100%',
          aspectRatio: '1 / 1',
          transformStyle: 'preserve-3d',
          transform: isIsometricView
            ? `rotateX(28deg) rotateZ(-6deg) scale(${boardScale})`
            : `rotateX(0deg) rotateZ(0deg) scale(${boardScale})`,
          boxShadow: isIsometricView
            ? '0 20px 0 #5c4428, 0 28px 0 #3d2a14, 0 36px 60px rgba(0,0,0,0.75)'
            : '0 8px 28px rgba(0,0,0,0.3)',
        }}
      >
        {/* Board 7x7 Grid - with preserve-3d and overflow-visible for standing models */}
        <div
          className="w-full h-full grid grid-cols-7 grid-rows-7 gap-1 md:gap-1.5 relative overflow-visible"
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {/* ================= CENTRAL COBBLESTONE PLAZA (Col 2-6, Row 2-6) ================= */}
          <div
            style={{
              gridColumn: '2 / span 5',
              gridRow: '2 / span 5',
              transform: isIsometricView ? 'translateZ(2px)' : 'none',
              transformStyle: 'preserve-3d',
            }}
            className="relative rounded-2xl bg-gradient-to-br from-[#dfcfb7] via-[#cbb599] to-[#bda182] border-2 border-[#b5926c]/70 p-2 sm:p-3 md:p-4 flex flex-col justify-between overflow-hidden shadow-inner select-none"
          >
            {/* Cobblestone Paving Texture */}
            <div className="absolute inset-0 opacity-25 pointer-events-none bg-[radial-gradient(#8c6d48_1.5px,transparent_1.5px)] [background-size:18px_18px]" />

            {/* Center Area: PETRA BUSA Standalone Logo on Board & 3D Rolling Dice */}
            <div
              onClick={!isRolling ? onRoll : undefined}
              title={!isRolling ? 'Ketuk untuk lempar dadu' : undefined}
              className={`relative z-20 flex-1 flex flex-col items-center justify-center my-auto p-1 sm:p-2 min-h-[110px] sm:min-h-[140px] transition-transform ${
                !isRolling ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : ''
              }`}
            >
              {/* PETRA BUSA Logo */}
              <img
                src="/assets/aistudio/logo.png"
                alt="PETRA BUSA"
                className="w-36 sm:w-56 md:w-72 max-w-full h-auto object-contain mix-blend-multiply select-none filter drop-shadow-[0_4px_14px_rgba(0,0,0,0.18)] pointer-events-none"
              />

              {/* Rolling Dice Animation overlay */}
              {showDiceAnimation && diceResult && onDiceAnimationComplete && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-30">
                  <DiceThrowAnimation
                    d1={diceResult.d1}
                    d2={diceResult.d2}
                    onAnimationComplete={onDiceAnimationComplete}
                  />
                </div>
              )}
            </div>
          </div>

          {/* ================= 24 BOARD TILES ================= */}
          {tiles.map((tile) => {
            const { col, row } = getTileGridPosition(tile.id);
            const state = tileStates[tile.id] || { owner: null, houses: 0, mortgaged: false };
            const isCorner = [0, 6, 12, 18].includes(tile.id);
            const playersOnThisTile = players.filter((p) => p.position === tile.id && !p.isBankrupt);
            const hasPlayerOnTile = playersOnThisTile.length > 0;
            const ownerPlayer = state.owner !== null && state.owner !== undefined ? players[state.owner] : null;
            const isOwned = ownerPlayer !== null;
            const hasHouses = isOwned || state.houses > 0;
            const isLandmark = state.houses >= 4;

            return (
              <div
                key={tile.id}
                onClick={() => onTileClick(tile)}
                style={{
                  gridColumnStart: col,
                  gridRowStart: row,
                  transformStyle: 'preserve-3d',
                  transform: isIsometricView
                    ? ownerPlayer
                      ? 'translateZ(6px)'
                      : 'translateZ(3px)'
                    : 'none',
                }}
                className="relative select-none cursor-pointer group"
              >
                {/* 1. TILE BASE FOUNDATION CARD (Visible, Rounded, Elevated) */}
                <div
                  className={`w-full h-full flex flex-col justify-between p-1 rounded-xl transition-all duration-200 overflow-visible border ${
                    isCorner
                      ? 'bg-gradient-to-b from-stone-800 to-stone-900 border-amber-500/80 shadow-md'
                      : ownerPlayer
                      ? 'bg-stone-900 border-amber-400 shadow-md ring-1'
                      : 'bg-[#faf6ee] group-hover:bg-white border-[#d3c2a8] group-hover:border-amber-500 shadow-sm'
                  }`}
                  style={{
                    borderColor: ownerPlayer ? ownerPlayer.color : undefined,
                    boxShadow: ownerPlayer
                      ? `0 6px 12px -2px ${ownerPlayer.color}40, 0 3px 0 ${ownerPlayer.color}`
                      : '0 2px 4px rgba(0,0,0,0.08)',
                  }}
                >
                  {/* CORNER 0: START CORNER */}
                  {tile.id === 0 && (
                    <div className="w-full h-full rounded-lg bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 p-0.5 sm:p-1 flex flex-col items-center justify-between text-stone-950 shadow-inner overflow-hidden">
                      <span className="text-[7px] sm:text-[8px] font-black tracking-widest text-amber-950">•••</span>
                      <div className="flex flex-col items-center">
                        <span className="text-xs sm:text-sm md:text-lg font-black font-display tracking-tight text-stone-950 drop-shadow-sm leading-none">
                          START
                        </span>
                        <span className="text-[5.5px] sm:text-[6.5px] md:text-[7.5px] font-extrabold text-stone-900 uppercase mt-0.5 whitespace-nowrap">
                          +Rp 20 Juta
                        </span>
                      </div>
                      <span className="text-[8px] sm:text-[10px] leading-none">➔➔</span>
                    </div>
                  )}

                  {/* CORNER 6: PULAU TERASING / PENJARA */}
                  {tile.id === 6 && (
                    <div className="w-full h-full rounded-lg bg-gradient-to-b from-sky-500 via-teal-600 to-emerald-700 p-0.5 sm:p-1 flex flex-col items-center justify-between text-white relative overflow-hidden shadow-inner">
                      <div className="w-full flex items-center justify-between text-[6.5px] sm:text-[7.5px] font-bold text-sky-100 leading-none z-10">
                        <span>🏝️ PULAU</span>
                        <span>🔒</span>
                      </div>
                      <div className="flex-1 w-full flex items-center justify-center my-0.5 z-10 overflow-visible">
                        <img
                          src="/assets/aistudio/PLAY__7__d8f343dd.png"
                          alt="Pulau Terasing"
                          className="w-7 h-7 sm:w-10 sm:h-10 object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] select-none pointer-events-none"
                        />
                      </div>
                      <span className="text-[6.5px] sm:text-[7.5px] font-black uppercase text-amber-200 leading-none z-10">
                        TERASING
                      </span>
                    </div>
                  )}

                  {/* CORNER 12: FESTIVAL BUDAYA */}
                  {tile.id === 12 && (
                    <div className="w-full h-full rounded-lg bg-gradient-to-br from-rose-800 via-red-900 to-amber-950 p-0.5 sm:p-1 flex flex-col items-center justify-between text-white shadow-inner relative overflow-hidden">
                      <div className="w-full flex items-center justify-between text-[6.5px] sm:text-[7.5px] font-bold text-amber-300 leading-none z-10">
                        <span>🎭</span>
                        <span className="text-[6px] sm:text-[7.5px]">FESTIVAL</span>
                        <span>🎭</span>
                      </div>
                      <div className="flex-1 w-full flex items-center justify-center my-0.5 z-10 overflow-visible">
                        <img
                          src="/assets/aistudio/festivalbudaya_6c0cb15d.png"
                          alt="Festival Budaya"
                          className="w-7 h-7 sm:w-11 sm:h-11 object-contain filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)] select-none pointer-events-none"
                        />
                      </div>
                      <span className="text-[5.5px] sm:text-[6.5px] font-black text-amber-300 uppercase leading-none z-10 whitespace-nowrap">
                        PARKIR BEBAS
                      </span>
                    </div>
                  )}

                  {/* CORNER 18: BANDARA / BALON UDARA */}
                  {tile.id === 18 && (
                    <div className="w-full h-full rounded-lg bg-gradient-to-b from-sky-600 via-blue-700 to-indigo-900 p-0.5 sm:p-1 flex flex-col items-center justify-between text-white shadow-inner relative overflow-hidden">
                      <div className="w-full flex items-center justify-between text-[6.5px] sm:text-[7.5px] font-bold text-sky-200 leading-none z-10">
                        <span>✈️</span>
                        <span className="text-[6px] sm:text-[7.5px]">BANDARA</span>
                        <span>✈️</span>
                      </div>
                      <div className="flex-1 w-full flex items-center justify-center my-0.5 z-10 overflow-visible">
                        <img
                          src="/assets/aistudio/PLAY__8__b2b4a02b.png"
                          alt="Bandara"
                          className="w-7 h-7 sm:w-10 sm:h-10 object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] select-none pointer-events-none"
                        />
                      </div>
                      <span className="text-[5.5px] sm:text-[6.5px] text-sky-200 leading-none z-10 whitespace-nowrap">Terbang Bebas</span>
                    </div>
                  )}

                  {/* REGULAR TILES: HEADER BANNER & FOOTER PRICE */}
                  {!isCorner && (
                    <>
                      {/* Top Region Banner Bar */}
                      <div
                        className="h-2.5 sm:h-3 -mx-1 -mt-1 rounded-t-lg shrink-0 flex items-center justify-between px-1 sm:px-1.5 transition-colors"
                        style={{
                          backgroundColor: ownerPlayer ? ownerPlayer.color : tile.colorGroup,
                        }}
                      >
                        {ownerPlayer ? (
                          <div className="flex items-center gap-1">
                            <span className="text-[6.5px] sm:text-[7.5px] font-black text-stone-950 font-mono bg-white/95 px-1 py-0.2 rounded-xs shadow-xs leading-none">
                              P{ownerPlayer.id + 1}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[6px] sm:text-[7px] font-black text-white uppercase tracking-wider truncate leading-none">
                            {tile.island}
                          </span>
                        )}

                        {/* House Level Mini Indicators */}
                        {hasHouses && (
                          <div className="flex gap-0.5 items-center">
                            {Array.from({ length: Math.min(3, state.houses) }).map((_, i) => (
                              <span key={i} className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                            ))}
                            {isLandmark && (
                              <span className="text-[7px] sm:text-[8px] leading-none drop-shadow text-amber-200">⭐</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Middle Area: Full-color Authentic Building Asset for Property Tiles */}
                      <div className="flex-1 w-full flex items-center justify-center overflow-visible py-0.5 min-h-[22px] sm:min-h-[36px]">
                        {tile.type === 'property' && !hasHouses && (
                          <div className="transition-transform duration-200 group-hover:scale-110 flex flex-col items-center overflow-visible">
                            <HouseArtSvg type={tile.houseSvgType} size={isCompact ? 26 : 40} />
                          </div>
                        )}
                      </div>

                      {/* Footer Price / Rent Tag */}
                      <div className="mt-auto pt-0.5 pb-0.5 border-t border-stone-300/80 text-center shrink-0 flex flex-col items-center z-5">
                        <span className="text-[6.5px] sm:text-[7.5px] md:text-[8.5px] font-black text-stone-900 leading-tight truncate px-0.5 max-w-full">
                          {tile.shortName}
                        </span>
                        {ownerPlayer ? (
                          <div className="bg-stone-950/90 text-emerald-300 font-mono font-black text-[6px] sm:text-[7.5px] md:text-[8px] py-0.5 px-0.5 sm:px-1 rounded flex items-center justify-center gap-0.5 shadow-xs leading-none mt-0.5 whitespace-nowrap">
                            <span className="text-[5px] sm:text-[6px] font-sans font-bold text-amber-400">SEWA</span>
                            <span>{formatShortPrice(tile.houseRent?.[Math.max(0, state.houses - 1)] || tile.baseRent)}</span>
                          </div>
                        ) : tile.price ? (
                          <div className="text-[6px] sm:text-[7.5px] md:text-[8.5px] font-mono text-stone-800 font-extrabold leading-none mt-0.5 whitespace-nowrap">
                            {formatShortPrice(tile.price)}
                          </div>
                        ) : null}
                      </div>
                    </>
                  )}
                </div>

                {/* ================= 2. 3D STANDING RUMAH ADAT LAYER ================= */}
                {!isCorner && (
                  <div
                    className="absolute inset-x-0 top-2.5 sm:top-3 bottom-6 sm:bottom-7 pointer-events-none flex items-center justify-center overflow-visible z-10"
                    style={{
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {tile.type === 'property' && hasHouses && (
                      <RumahAdat3D
                        svgType={tile.houseSvgType}
                        houseLevel={state.houses || 1}
                        ownerColor={ownerPlayer?.color}
                        ownerName={ownerPlayer?.name}
                        ownerIndex={state.owner}
                        isIsometric={isIsometricView}
                        scale={isCompact ? 0.72 : 1}
                      />
                    )}

                    {tile.type === 'kesempatan' && (
                      <div
                        className="flex flex-col items-center justify-end pb-1"
                        style={{
                          transform: isIsometricView ? 'rotateZ(6deg) rotateX(-28deg) translateZ(8px)' : 'none',
                          transformOrigin: 'bottom center',
                        }}
                      >
                        <span className="text-lg filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]">📜</span>
                        <span className="text-[6.5px] font-black text-amber-900 bg-amber-200/90 px-1 py-0.2 rounded shadow-xs">
                          PUSAKA
                        </span>
                      </div>
                    )}

                    {tile.type === 'tantangan' && (
                      <div
                        className="flex flex-col items-center justify-end pb-1"
                        style={{
                          transform: isIsometricView ? 'rotateZ(6deg) rotateX(-28deg) translateZ(8px)' : 'none',
                          transformOrigin: 'bottom center',
                        }}
                      >
                        <span className="text-lg filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)] animate-pulse">❓</span>
                        <span className="text-[6.5px] font-black text-rose-900 bg-rose-200/90 px-1 py-0.2 rounded shadow-xs">
                          KUIS
                        </span>
                      </div>
                    )}

                    {tile.type === 'stasiun' && (
                      <div
                        className="flex flex-col items-center justify-end pb-1"
                        style={{
                          transform: isIsometricView ? 'rotateZ(6deg) rotateX(-28deg) translateZ(8px)' : 'none',
                          transformOrigin: 'bottom center',
                        }}
                      >
                        <HouseArtSvg type={tile.houseSvgType} size={32} className="filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]" />
                      </div>
                    )}

                    {/* Corner 6: 3D Pulau Terasing miniature */}
                    {tile.id === 6 && (
                      <div
                        className="flex flex-col items-center justify-end pb-1"
                        style={{
                          transform: isIsometricView ? 'rotateZ(6deg) rotateX(-28deg) translateZ(8px)' : 'none',
                          transformOrigin: 'bottom center',
                        }}
                      >
                        <img
                          src="/assets/aistudio/PLAY__7__d8f343dd.png"
                          alt="Pulau Terasing 3D"
                          className="w-8 h-8 object-contain filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)] select-none pointer-events-none"
                        />
                      </div>
                    )}

                    {/* Corner 18: 3D Bandara miniature */}
                    {tile.id === 18 && (
                      <div
                        className="flex flex-col items-center justify-end pb-1"
                        style={{
                          transform: isIsometricView ? 'rotateZ(6deg) rotateX(-28deg) translateZ(8px)' : 'none',
                          transformOrigin: 'bottom center',
                        }}
                      >
                        <img
                          src="/assets/aistudio/PLAY__8__b2b4a02b.png"
                          alt="Bandara 3D"
                          className="w-9 h-9 object-contain filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)] select-none pointer-events-none"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* ================= 3. 3D PAWN TOKENS (FOREGROUND BASE OF TILE) ================= */}
                {playersOnThisTile.length > 0 && (
                  <div
                    className="absolute inset-x-0 bottom-1 z-30 pointer-events-none overflow-visible flex items-end justify-center"
                    style={{
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {playersOnThisTile.map((p, pIdx) => {
                      const isActive = p.id === activePlayerIndex;
                      const totalOnTile = playersOnThisTile.length;

                      // Harmonious, centered offsets from the exact horizontal center of the tile
                      let offsetX = 0;
                      let offsetY = 0;
                      let offsetZ = 32;
                      let pawnSize = 38;

                      if (totalOnTile === 1) {
                        offsetX = 0;
                        offsetY = 0;
                        offsetZ = 32;
                        pawnSize = 38;
                      } else if (totalOnTile === 2) {
                        // Symmetrically balanced pair at front base
                        pawnSize = 34;
                        if (pIdx === 0) {
                          offsetX = -9;
                          offsetY = 0;
                          offsetZ = 34;
                        } else {
                          offsetX = 9;
                          offsetY = -2;
                          offsetZ = 30;
                        }
                      } else if (totalOnTile === 3) {
                        // Compact isometric triangle cluster
                        pawnSize = 30;
                        const triangleOffsets = [
                          { x: -9, y: 1, z: 34 }, // Front-left
                          { x: 9, y: 1, z: 34 },  // Front-right
                          { x: 0, y: -5, z: 28 }, // Back-center
                        ];
                        const off = triangleOffsets[pIdx] || { x: 0, y: 0, z: 30 };
                        offsetX = off.x;
                        offsetY = off.y;
                        offsetZ = off.z;
                      } else {
                        // Compact 2x2 quad cluster (e.g. at START tile)
                        pawnSize = 28;
                        const quadOffsets = [
                          { x: -9, y: 1, z: 34 },  // Front-left
                          { x: 9, y: 1, z: 34 },   // Front-right
                          { x: -7, y: -5, z: 28 }, // Back-left
                          { x: 7, y: -5, z: 28 },  // Back-right
                        ];
                        const off = quadOffsets[pIdx] || { x: 0, y: 0, z: 28 };
                        offsetX = off.x;
                        offsetY = off.y;
                        offsetZ = off.z;
                      }

                      return (
                        <div
                          key={p.id}
                          className={`absolute left-1/2 bottom-2 transition-all duration-200 ${
                            isActive ? 'scale-110 z-50' : 'scale-100 z-30 opacity-95'
                          }`}
                          style={{
                            transformStyle: 'preserve-3d',
                            transform: `translate3d(calc(-50% + ${offsetX}px), ${offsetY}px, ${offsetZ}px)`,
                          }}
                        >
                          <Pawn3D
                            avatarId={p.avatarId}
                            customPngUrl={p.customPawnUrl}
                            isRolling={isActive && isRolling}
                            isIsometric={isIsometricView}
                            size={pawnSize}
                            showPedestal={totalOnTile <= 2}
                            playerIndex={p.id}
                            playerColor={p.color}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
