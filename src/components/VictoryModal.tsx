import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Player, TileData, TileState } from '../types/game';
import { AvatarSvg } from './AvatarSvg';
import { AVATARS } from '../data/avatars';
import { sound } from '../utils/audio';

interface VictoryModalProps {
  players: Player[];
  tiles: TileData[];
  tileStates: Record<number, TileState>;
  onRestart: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  players,
  tiles,
  tileStates,
  onRestart,
}) => {
  useEffect(() => {
    sound.playBigGong();
    sound.playQuizSuccess();

    // Trigger colorful confetti shower
    const end = Date.now() + 3.5 * 1000;
    const colors = ['#f59e0b', '#e11d48', '#059669', '#0284c7', '#ffffff'];

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Calculate net worth: Balance + Price of properties owned + Balai Budaya cost
  const calculateNetWorth = (player: Player) => {
    let total = player.balance;
    tiles.forEach((t) => {
      const state = tileStates[t.id];
      if (state && state.owner === player.id) {
        total += t.price || 0;
        total += (state.houses || 0) * (t.houseCost || 0);
      }
    });
    return total;
  };

  const rankedPlayers = [...players].sort(
    (a, b) => calculateNetWorth(b) - calculateNetWorth(a)
  );

  const winner = rankedPlayers[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-stone-900 border-2 border-amber-400 rounded-3xl p-6 md:p-8 shadow-2xl shadow-amber-500/30 text-center">
        {/* Trophy icon */}
        <div className="w-20 h-20 mx-auto -mt-2 mb-3 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/40 text-4xl">
          🏆
        </div>

        <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/50 text-xs font-bold uppercase tracking-wider">
          Pelestari Budaya Terbaik Nusantara
        </span>

        <h2 className="text-2xl md:text-4xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 mt-2 mb-1">
          {winner.name} Menang!
        </h2>
        <p className="text-xs md:text-sm text-stone-300 mb-6">
          Selamat! Kamu berhasil melestarikan tanah adat dan membina balai budaya terbanyak di seluruh penjuru kepulauan Nusantara.
        </p>

        {/* Winner Highlight Card */}
        {(() => {
          const winAv = AVATARS.find((a) => a.id === winner.avatarId);
          const winImg = winner.customPawnUrl || winAv?.customPng;
          return (
            <div className="p-4 rounded-2xl bg-stone-950/80 border border-amber-500/60 mb-6 flex items-center gap-4">
              <div className="w-16 h-20 flex items-center justify-center shrink-0">
                {winImg ? (
                  <img
                    src={winImg}
                    alt={winner.name}
                    className="max-h-full max-w-full object-contain filter drop-shadow-[0_4px_8px_rgba(245,158,11,0.5)]"
                  />
                ) : (
                  <AvatarSvg avatarId={winner.avatarId} size={64} />
                )}
              </div>
              <div className="text-left flex-1 min-w-0">
                <h4 className="text-lg font-bold text-stone-100 truncate">{winner.name}</h4>
                <p className="text-xs text-amber-400">Total Kekayaan & Aset Budaya</p>
                <div className="text-xl font-mono font-extrabold text-amber-300">
                  {formatRupiah(calculateNetWorth(winner))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Final Leaderboard */}
        <div className="space-y-2 mb-6 text-left">
          <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
            Klasemen Akhir Peserta
          </h4>
          {rankedPlayers.map((p, idx) => {
            const pAv = AVATARS.find((a) => a.id === p.avatarId);
            const pImg = p.customPawnUrl || pAv?.customPng;
            return (
              <div
                key={p.id}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs md:text-sm ${
                  idx === 0
                    ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                    : 'bg-stone-950/50 border-stone-800 text-stone-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 font-mono font-bold text-stone-400">#{idx + 1}</span>
                  <div className="w-7 h-8 flex items-center justify-center shrink-0">
                    {pImg ? (
                      <img src={pImg} alt={p.name} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <AvatarSvg avatarId={p.avatarId} size={28} />
                    )}
                  </div>
                  <span className="font-semibold text-stone-100 truncate max-w-[140px] md:max-w-[200px]">
                    {p.name} {p.isAI ? '(BOT)' : ''}
                  </span>
                </div>
                <span className="font-mono font-bold text-amber-400 tabular-nums">
                  {formatRupiah(calculateNetWorth(p))}
                </span>
              </div>
            );
          })}
        </div>

        {/* Restart Button */}
        <button
          onClick={onRestart}
          className="w-full py-3.5 px-6 rounded-xl font-black text-stone-950 text-base bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 shadow-xl shadow-amber-500/30 transition-all cursor-pointer"
        >
          Main Babak Baru
        </button>
      </div>
    </div>
  );
};
