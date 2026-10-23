import React from 'react';
import { TileData, TileState, Player } from '../types/game';
import { HouseArtSvg } from './HouseArtSvg';
import { AvatarSvg } from './AvatarSvg';
import { DiceRoller } from './DiceRoller';

interface GameBoardProps {
  tiles: TileData[];
  tileStates: Record<number, TileState>;
  players: Player[];
  activePlayerIndex: number;
  dice: [number, number];
  isRolling: boolean;
  canRoll: boolean;
  onRoll: () => void;
  onTileClick: (tile: TileData) => void;
  gameMessage?: string;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  tiles,
  tileStates,
  players,
  activePlayerIndex,
  dice,
  isRolling,
  canRoll,
  onRoll,
  onTileClick,
  gameMessage,
}) => {
  const activePlayer = players[activePlayerIndex];

  // Map 24 tile indices to 7x7 grid coordinates (col 1-7, row 1-7)
  const getTileGridPosition = (id: number) => {
    switch (id) {
      // Bottom row (Right to Left: 0 to 6)
      case 0: return { col: 7, row: 7 }; // Mulai (Bottom-Right)
      case 1: return { col: 6, row: 7 }; // Kudus
      case 2: return { col: 5, row: 7 }; // Kesempatan
      case 3: return { col: 4, row: 7 }; // Semarang
      case 4: return { col: 3, row: 7 }; // Yogyakarta
      case 5: return { col: 2, row: 7 }; // Bandara Soetta
      case 6: return { col: 1, row: 7 }; // Penjara (Bottom-Left)

      // Left col (Bottom to Top: 7 to 11)
      case 7: return { col: 1, row: 6 }; // Aceh
      case 8: return { col: 1, row: 5 }; // Tantangan
      case 9: return { col: 1, row: 4 }; // Medan Bolon
      case 10: return { col: 1, row: 3 }; // Padang Gadang
      case 11: return { col: 1, row: 2 }; // Pelabuhan Priok

      // Top row (Left to Right: 12 to 18)
      case 12: return { col: 1, row: 1 }; // Festival / Parkir Bebas (Top-Left)
      case 13: return { col: 2, row: 1 }; // Bali Candi Bentar
      case 14: return { col: 3, row: 1 }; // Kesempatan
      case 15: return { col: 4, row: 1 }; // Lombok Sasak
      case 16: return { col: 5, row: 1 }; // Flores Mbaru Niang
      case 17: return { col: 6, row: 1 }; // Bandara Ngurah Rai
      case 18: return { col: 7, row: 1 }; // Masuk Penjara (Top-Right)

      // Right col (Top to Bottom: 19 to 23)
      case 19: return { col: 7, row: 2 }; // Pontianak Radakng
      case 20: return { col: 7, row: 3 }; // Banjar Bubungan
      case 21: return { col: 7, row: 4 }; // Tantangan
      case 22: return { col: 7, row: 5 }; // Toraja Tongkonan
      case 23: return { col: 7, row: 6 }; // Papua Honai

      default: return { col: 1, row: 1 };
    }
  };

  const formatShortPrice = (num?: number) => {
    if (!num) return '';
    if (num >= 1000000) {
      return `Rp ${(num / 1000000).toFixed(1)}Jt`;
    }
    return `Rp ${(num / 1000).toFixed(0)}Rb`;
  };

  return (
    <div className="relative w-full max-w-[820px] aspect-square p-2 md:p-3 bg-stone-950/90 rounded-3xl border-2 border-amber-600/50 shadow-2xl shadow-black/80 flex flex-col justify-center">
      {/* 7x7 Grid Board Container */}
      <div className="w-full h-full grid grid-cols-7 grid-rows-7 gap-1 md:gap-1.5 relative">
        
        {/* Render the 24 Tiles */}
        {tiles.map((tile) => {
          const { col, row } = getTileGridPosition(tile.id);
          const state = tileStates[tile.id] || { owner: null, houses: 0, mortgaged: false };
          const owner = state.owner !== null ? players.find((p) => p.id === state.owner) : null;
          const isCorner = [0, 6, 12, 18].includes(tile.id);
          const playersOnThisTile = players.filter((p) => !p.isBankrupt && p.position === tile.id);

          return (
            <div
              key={tile.id}
              onClick={() => onTileClick(tile)}
              style={{
                gridColumnStart: col,
                gridRowStart: row,
              }}
              className={`relative flex flex-col justify-between p-1 md:p-1.5 rounded-xl transition-all duration-200 cursor-pointer overflow-hidden border select-none ${
                isCorner
                  ? 'bg-stone-900 border-amber-600/60 hover:border-amber-400'
                  : 'bg-stone-900/90 border-stone-800 hover:border-amber-400 hover:bg-stone-850'
              }`}
            >
              {/* Color Bar / Group indicator */}
              {!isCorner && (
                <div
                  className="h-1.5 md:h-2 -mx-1.5 -mt-1.5 rounded-t-xl mb-1 shrink-0 flex items-center justify-end px-1"
                  style={{ backgroundColor: tile.colorGroup }}
                >
                  {/* Houses / Balai Budaya Indicators */}
                  {state.houses > 0 && state.houses < 4 && (
                    <div className="flex gap-0.5">
                      {Array.from({ length: state.houses }).map((_, i) => (
                        <span key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm" />
                      ))}
                    </div>
                  )}
                  {state.houses === 4 && (
                    <span className="w-2 h-2 rounded-full bg-amber-300 ring-1 ring-amber-100 shadow-sm" />
                  )}
                </div>
              )}

              {/* Tile Content Center */}
              <div className="flex-1 flex flex-col items-center justify-center text-center min-w-0">
                {/* Special Corner Icon or Traditional House SVG */}
                {tile.type === 'start' && (
                  <div className="text-emerald-400 text-xs md:text-sm font-black flex flex-col items-center">
                    <span className="text-lg md:text-2xl">🏛️</span>
                    <span className="font-display">MULAI</span>
                  </div>
                )}
                {tile.type === 'penjara' && (
                  <div className="text-stone-300 text-xs md:text-sm font-bold flex flex-col items-center">
                    <img
                      src="/assets/aistudio/PLAY__7__d8f343dd.png"
                      alt="Pulau Terasing"
                      className="w-7 h-7 object-contain drop-shadow"
                    />
                    <span className="text-[9px] md:text-[10px] text-amber-200 mt-0.5 leading-none">PULAU</span>
                  </div>
                )}
                {tile.type === 'parkir_bebas' && (
                  <div className="flex flex-col items-center justify-center">
                    <img
                      src="/assets/aistudio/festivalbudaya_6c0cb15d.png"
                      alt="Festival Budaya"
                      className="w-7 h-7 object-contain drop-shadow"
                    />
                    <span className="text-[9px] md:text-[10px] text-amber-300 font-bold mt-0.5 leading-none">FESTIVAL</span>
                  </div>
                )}
                {tile.type === 'masuk_penjara' && (
                  <div className="text-rose-400 text-xs md:text-sm font-bold flex flex-col items-center">
                    <span className="text-lg md:text-2xl">⚖️</span>
                    <span className="text-[9px] md:text-xs leading-none">SANKSI</span>
                  </div>
                )}
                {tile.type === 'kesempatan' && (
                  <div className="text-amber-400 text-xs md:text-sm font-bold flex flex-col items-center">
                    <span className="text-lg md:text-xl">📜</span>
                    <span className="text-[9px] md:text-[10px] text-amber-200">PUSAKA</span>
                  </div>
                )}
                {tile.type === 'tantangan' && (
                  <div className="text-rose-400 text-xs md:text-sm font-bold flex flex-col items-center">
                    <span className="text-lg md:text-xl">❓</span>
                    <span className="text-[9px] md:text-[10px] text-rose-300">KUIS</span>
                  </div>
                )}
                {tile.type === 'property' && (
                  <div className="flex flex-col items-center justify-center w-full">
                    <HouseArtSvg type={tile.houseSvgType} size={30} className="mb-0.5" />
                    <span className="text-[9px] md:text-[11px] font-bold text-stone-200 truncate w-full px-0.5 leading-tight">
                      {tile.shortName}
                    </span>
                  </div>
                )}
                {tile.type === 'stasiun' && (
                  <div className="flex flex-col items-center justify-center w-full">
                    <HouseArtSvg type={tile.houseSvgType} size={28} className="mb-0.5" />
                    <span className="text-[8px] md:text-[10px] font-bold text-sky-200 truncate w-full px-0.5">
                      {tile.shortName}
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom footer: Price or Status */}
              <div className="mt-0.5 pt-0.5 border-t border-stone-800/60 text-center shrink-0">
                {owner ? (
                  <div
                    className="text-[8px] md:text-[10px] font-bold truncate rounded px-1"
                    style={{ backgroundColor: `${owner.color}35`, color: owner.color }}
                  >
                    {owner.name}
                  </div>
                ) : tile.price ? (
                  <span className="text-[8px] md:text-[10px] font-mono text-amber-400 font-semibold block truncate">
                    {formatShortPrice(tile.price)}
                  </span>
                ) : (
                  <span className="text-[8px] md:text-[9px] text-stone-400 block truncate">
                    {tile.shortName}
                  </span>
                )}
              </div>

              {/* Animated Player Pawns on this tile */}
              {playersOnThisTile.length > 0 && (
                <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center gap-0.5 flex-wrap p-1 bg-black/30 backdrop-blur-[1px] rounded-xl">
                  {playersOnThisTile.map((p) => (
                    <div
                      key={p.id}
                      className="transition-transform duration-300 hover:scale-125 transform shadow-lg rounded-full"
                      style={{
                        boxShadow: `0 0 10px ${p.color}`,
                      }}
                    >
                      <AvatarSvg avatarId={p.avatarId} size={26} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Center Board Area (5x5 grid in the middle) */}
        <div
          style={{
            gridColumn: '2 / span 5',
            gridRow: '2 / span 5',
          }}
          className="relative rounded-2xl bg-gradient-to-b from-stone-900 via-amber-950/40 to-stone-900 border border-amber-600/30 p-4 md:p-6 flex flex-col items-center justify-between overflow-hidden shadow-inner"
        >
          {/* Subtle Golden Archipelago Silhouette Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <svg viewBox="0 0 200 100" className="w-full h-full text-amber-500 fill-current">
              <path d="M20 50 Q40 40 60 55 T100 45 T140 50 T180 40" stroke="currentColor" strokeWidth="12" strokeLinecap="round" fill="none" />
              <circle cx="45" cy="52" r="10" />
              <circle cx="85" cy="62" r="8" />
              <circle cx="120" cy="48" r="12" />
              <circle cx="160" cy="50" r="14" />
            </svg>
          </div>

          {/* Header Title Lockup */}
          <div className="text-center z-10">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] md:text-xs font-semibold tracking-wider">
              <span>BHINNEKA TUNGGAL IKA</span>
            </div>
            <h2 className="text-xl md:text-3xl font-black font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 mt-1">
              MONOPOLI NUSANTARA
            </h2>
            <p className="text-[11px] md:text-xs text-stone-400">
              Kearifan Arsitektur Rumah Adat & Tradisi Indonesia
            </p>
          </div>

          {/* Center Arena: Dice Roller & Status */}
          <div className="z-10 my-auto flex flex-col items-center gap-3">
            <DiceRoller
              dice={dice}
              isRolling={isRolling}
              canRoll={canRoll}
              onRoll={onRoll}
              activePlayerName={activePlayer.name}
              isAI={activePlayer.isAI}
            />

            {/* Notification / Toast Message */}
            {gameMessage && (
              <div className="px-3 py-1.5 rounded-xl bg-amber-950/80 border border-amber-500/50 text-amber-200 text-xs md:text-sm text-center font-medium max-w-sm animate-fade-in shadow-md">
                {gameMessage}
              </div>
            )}
          </div>

          {/* Bottom Center Bar: Active Player Announcement & TV Remote Hint */}
          <div className="w-full z-10 flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-stone-800/80 text-[11px] text-stone-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: activePlayer.color }} />
              <span>
                Giliran Aktif: <strong className="text-amber-300">{activePlayer.name}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 text-stone-500">
              <span>Klik petak mana pun untuk baca Ensiklopedia Adat</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
