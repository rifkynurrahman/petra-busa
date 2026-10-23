import React from 'react';
import { Player, TileData, TileState } from '../types/game';
import { AvatarSvg } from './AvatarSvg';
import { AVATARS } from '../data/avatars';

interface PlayerCardProps {
  player: Player;
  isActive: boolean;
  tiles: TileData[];
  tileStates: Record<number, TileState>;
  onBuildRequest?: (propertyId: number) => void;
  onInspectPlayer?: (player: Player) => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  isActive,
  tiles,
  tileStates,
  onBuildRequest,
}) => {
  const avatarInfo = AVATARS.find((a) => a.id === player.avatarId) || AVATARS[0];

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const ownedProperties = tiles.filter(
    (t) => tileStates[t.id]?.owner === player.id
  );

  const totalHouses = ownedProperties.reduce(
    (acc, t) => acc + (tileStates[t.id]?.houses || 0),
    0
  );

  return (
    <div
      className={`relative p-3 rounded-2xl transition-all duration-300 border ${
        isActive
          ? 'bg-stone-900/95 border-amber-400 shadow-xl shadow-amber-500/20 ring-2 ring-amber-400/50'
          : 'bg-stone-900/70 border-stone-800 shadow-md opacity-85 hover:opacity-100'
      }`}
    >
      {/* Top row: Avatar + Name + Turn indicator */}
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-14 flex items-center justify-center shrink-0">
          {player.customPawnUrl || avatarInfo?.customPng ? (
            <img
              src={player.customPawnUrl || avatarInfo?.customPng}
              alt={player.name}
              className="max-h-full max-w-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
            />
          ) : (
            <AvatarSvg avatarId={player.avatarId} size={48} />
          )}
          {player.isAI && (
            <span className="absolute -top-1 -left-1 px-1.5 py-0.2 text-[9px] font-bold bg-sky-950 text-sky-300 border border-sky-500/40 rounded">
              BOT
            </span>
          )}
          {player.inJail && (
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 text-[9px] font-bold bg-rose-950 text-rose-300 border border-rose-500/40 rounded">
              PENJARA
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <h4 className="text-sm font-bold text-stone-100 truncate">
              {player.name}
            </h4>
            {isActive && (
              <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-amber-400 text-stone-950 rounded-full animate-pulse shrink-0">
                Giliran
              </span>
            )}
          </div>
          <p className="text-[11px] text-stone-400 truncate">
            {avatarInfo.hatGarb}
          </p>
          <div className="mt-1 text-sm font-extrabold text-amber-400 font-mono tabular-nums">
            {formatRupiah(player.balance)}
          </div>
        </div>
      </div>

      {/* Stats bar: Owned properties & Balai Budaya count */}
      <div className="mt-2.5 pt-2 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: player.color }} />
          <span>Aset: <strong className="text-stone-200 font-mono">{ownedProperties.length}</strong></span>
        </div>
        <div className="flex items-center gap-1 text-amber-300/80">
          <span>Balai: <strong className="text-amber-300 font-mono">{totalHouses}</strong></span>
        </div>
      </div>

      {/* Owned properties mini color pills preview */}
      {ownedProperties.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {ownedProperties.slice(0, 5).map((prop) => (
            <span
              key={prop.id}
              title={`${prop.name} - ${tileStates[prop.id]?.houses ? tileStates[prop.id]?.houses + ' Balai Budaya' : 'Tanah Adat'}`}
              className="text-[9px] px-1.5 py-0.5 rounded font-medium border text-stone-200 truncate max-w-[90px]"
              style={{
                backgroundColor: `${prop.colorGroup}25`,
                borderColor: prop.colorGroup,
              }}
            >
              {prop.shortName}
            </span>
          ))}
          {ownedProperties.length > 5 && (
            <span className="text-[9px] px-1 text-stone-400 self-center font-mono">
              +{ownedProperties.length - 5}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
