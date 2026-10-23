import React from 'react';
import { Player, TileData, TileState } from '../types/game';
import { AVATARS } from '../data/avatars';
import { AvatarSvg } from './AvatarSvg';

interface LeaderboardModalProps {
  players: Player[];
  tiles: TileData[];
  tileStates: Record<number, TileState>;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  players,
  tiles,
  tileStates,
  onClose,
}) => {
  // Format currency
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatCompact = (num: number) => {
    if (num >= 1000000000) return `Rp ${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `Rp ${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `Rp ${(num / 1000).toFixed(0)}K`;
    return `Rp ${num}`;
  };

  // Calculate Net Worth for each player
  const playerStats = players.map((player) => {
    // 1. Cash Balance
    const cash = player.balance;

    // 2. Property & House Values
    let propertyValue = 0;
    let houseCount = 0;
    let landmarkCount = 0;

    player.propertiesOwned.forEach((tileId) => {
      const tile = tiles.find((t) => t.id === tileId);
      const state = tileStates[tileId];

      if (tile && tile.price) {
        propertyValue += tile.price;
      }

      if (tile && state && state.houses > 0) {
        const hCost = tile.houseCost || (tile.price ? Math.floor(tile.price * 0.5) : 5000000);
        propertyValue += state.houses * hCost;
        houseCount += state.houses;
        if (state.houses >= 4) landmarkCount += 1;
      }
    });

    const totalNetWorth = cash + propertyValue;

    return {
      player,
      cash,
      propertyValue,
      totalNetWorth,
      propertyCount: player.propertiesOwned.length,
      houseCount,
      landmarkCount,
    };
  });

  // Sort descending by totalNetWorth
  playerStats.sort((a, b) => b.totalNetWorth - a.totalNetWorth);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 border-4 border-amber-500 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Ribbon */}
        <div className="relative bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 px-6 py-4 border-b-4 border-amber-400 text-stone-950 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <span className="text-3xl filter drop-shadow animate-bounce">🏆</span>
            <div>
              <h2 className="text-xl font-black font-display tracking-wide uppercase leading-none text-stone-950">
                Peringkat & Kekayaan Pemain
              </h2>
              <p className="text-xs font-bold text-amber-950 mt-1">
                Monopoli Warisan Nusantara • Peringkat Total Aset & Kas
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-stone-900 text-amber-400 hover:bg-stone-800 border-2 border-amber-400 font-black text-xl flex items-center justify-center shadow transition-transform hover:scale-110 active:scale-95"
          >
            ✕
          </button>
        </div>

        {/* Content Body: Leaderboard Cards List */}
        <div className="p-4 md:p-6 overflow-y-auto space-y-3.5 flex-1">
          {playerStats.map((stat, rankIndex) => {
            const { player, cash, propertyValue, totalNetWorth, propertyCount, houseCount } = stat;
            const rank = rankIndex + 1;
            const avatarInfo = AVATARS.find((a) => a.id === player.avatarId);
            const customImg = player.customPawnUrl || avatarInfo?.customPng;

            // Rank visual theme
            let rankBadge = '4';
            let rankBg = 'bg-stone-800/80 border-stone-700 text-stone-300';
            let rankTitle = 'Pemain Nusantara';
            let crownIcon = '';

            if (rank === 1) {
              rankBadge = '1';
              rankBg = 'bg-gradient-to-r from-amber-500/25 via-yellow-500/20 to-amber-600/25 border-amber-400 text-amber-300 shadow-lg ring-1 ring-amber-400/50';
              rankTitle = '👑 Ratu / Raja Saudagar';
              crownIcon = '👑';
            } else if (rank === 2) {
              rankBadge = '2';
              rankBg = 'bg-gradient-to-r from-slate-400/20 via-slate-300/15 to-stone-400/20 border-slate-300 text-slate-200';
              rankTitle = '🥈 Tuan Bangsawan';
            } else if (rank === 3) {
              rankBadge = '3';
              rankBg = 'bg-gradient-to-r from-amber-700/20 via-orange-600/15 to-amber-800/20 border-amber-600 text-amber-200';
              rankTitle = '🥉 Juragan Nusantara';
            }

            return (
              <div
                key={player.id}
                className={`relative p-3.5 md:p-4 rounded-2xl border-2 transition-all flex flex-col md:flex-row items-center justify-between gap-4 ${rankBg}`}
              >
                {/* Left: Rank Badge & Avatar Info */}
                <div className="flex items-center gap-3.5 w-full md:w-auto">
                  {/* Rank Badge Circle */}
                  <div className="relative shrink-0 flex flex-col items-center justify-center">
                    <div
                      className={`w-11 h-11 md:w-12 md:h-12 rounded-2xl font-black text-xl md:text-2xl flex items-center justify-center border-2 shadow-inner ${
                        rank === 1
                          ? 'bg-amber-400 border-amber-200 text-stone-950 font-display'
                          : rank === 2
                          ? 'bg-slate-300 border-white text-stone-950 font-display'
                          : rank === 3
                          ? 'bg-amber-600 border-amber-300 text-stone-950 font-display'
                          : 'bg-stone-700 border-stone-600 text-stone-300'
                      }`}
                    >
                      #{rank}
                    </div>
                  </div>

                  {/* Player Avatar */}
                  <div
                    className="relative w-12 h-12 md:w-14 md:h-14 rounded-2xl p-0.5 border-2 shadow-md shrink-0 flex items-center justify-center overflow-hidden bg-stone-950/60"
                    style={{ borderColor: player.color }}
                  >
                    {customImg ? (
                      <img
                        src={customImg}
                        alt={player.name}
                        className="w-full h-full object-contain filter drop-shadow"
                      />
                    ) : (
                      <AvatarSvg avatarId={player.avatarId} size="100%" />
                    )}
                    <span
                      className="absolute bottom-0 right-0 text-[8px] font-black font-mono px-1 rounded text-stone-950 shadow-xs"
                      style={{ backgroundColor: player.color }}
                    >
                      P{player.id + 1}
                    </span>
                  </div>

                  {/* Player Name & Role Tag */}
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm md:text-base font-black text-white leading-none">
                        {player.name}
                      </h3>
                      {player.isAI && (
                        <span className="text-[8px] font-mono font-bold px-1 rounded bg-sky-950 text-sky-300 border border-sky-600">
                          BOT
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-extrabold text-amber-300 mt-1 block">
                      {crownIcon} {rankTitle}
                    </span>
                    <div className="flex items-center gap-2 mt-1 text-[10px] font-bold text-stone-400">
                      <span>🏛️ {propertyCount} Tanah</span>
                      <span>•</span>
                      <span>🏠 {houseCount} Rumah</span>
                    </div>
                  </div>
                </div>

                {/* Right: Net Worth Breakdown Stats */}
                <div className="flex items-center justify-between md:justify-end gap-3 md:gap-5 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-stone-700/50">
                  {/* Kas / Cash */}
                  <div className="text-left md:text-right">
                    <span className="text-[9px] font-extrabold text-stone-400 uppercase tracking-wider block">
                      Kas (Uang)
                    </span>
                    <span className="text-xs md:text-sm font-black font-mono text-emerald-400">
                      {formatCompact(cash)}
                    </span>
                  </div>

                  {/* Nilai Properti */}
                  <div className="text-left md:text-right">
                    <span className="text-[9px] font-extrabold text-stone-400 uppercase tracking-wider block">
                      Aset Tanah
                    </span>
                    <span className="text-xs md:text-sm font-black font-mono text-amber-300">
                      {formatCompact(propertyValue)}
                    </span>
                  </div>

                  {/* Total Kekayaan */}
                  <div className="text-right bg-stone-950/80 px-3 py-1.5 rounded-xl border border-amber-500/40">
                    <span className="text-[9px] font-extrabold text-amber-400 uppercase tracking-wider block">
                      Total Kekayaan
                    </span>
                    <span className="text-sm md:text-base font-black font-mono text-amber-300">
                      {formatCompact(totalNetWorth)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Summary */}
        <div className="p-3 bg-stone-950/90 border-t border-stone-800 text-center text-xs font-bold text-stone-400 shrink-0">
          💡 Total Kekayaan dihitung dari kombinasi Uang Kas + Nilai Beli Tanah + Total Bangunan Rumah Adat.
        </div>
      </div>
    </div>
  );
};
