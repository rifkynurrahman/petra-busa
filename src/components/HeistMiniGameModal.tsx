import React, { useState } from 'react';
import { sound } from '../utils/audio';

interface HeistMiniGameModalProps {
  onComplete: (rewardCash: number) => void;
}

type RewardType = 'jenang' | 'batik' | 'keris';

export const HeistMiniGameModal: React.FC<HeistMiniGameModalProps> = ({ onComplete }) => {
  // 12 chests randomized
  const [chestItems] = useState<RewardType[]>(() => {
    const pool: RewardType[] = [
      'jenang', 'jenang', 'jenang', 'jenang',
      'batik', 'batik', 'batik', 'batik',
      'keris', 'keris', 'keris', 'keris',
    ];
    // Shuffle
    return pool.sort(() => Math.random() - 0.5);
  });

  const [revealed, setRevealed] = useState<boolean[]>(Array(12).fill(false));
  const [counts, setCounts] = useState<{ jenang: number; batik: number; keris: number }>({
    jenang: 0,
    batik: 0,
    keris: 0,
  });
  const [winner, setWinner] = useState<RewardType | null>(null);

  const formatRupiah = (num: number) => {
    return `Rp ${(num / 1000000).toFixed(0)} Juta`;
  };

  const rewards = {
    jenang: { name: 'Jenang Kudus', cash: 50000000, icon: '🍯', tier: 'Rezeki Manis' },
    batik: { name: 'Batik Kudus Parijoto', cash: 120000000, icon: '👘', tier: 'Rezeki Luhur' },
    keris: { name: 'Keris Pusaka Emas', cash: 300000000, icon: '🗡️', tier: 'JACKPOT PUSAKA' },
  };

  const handleOpenChest = (index: number) => {
    if (revealed[index] || winner) return;

    sound.playCoin();
    const item = chestItems[index];

    const nextRevealed = [...revealed];
    nextRevealed[index] = true;
    setRevealed(nextRevealed);

    const nextCounts = { ...counts, [item]: counts[item] + 1 };
    setCounts(nextCounts);

    // If 3 matched, win!
    if (nextCounts[item] >= 3) {
      sound.playQuizSuccess();
      setWinner(item);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-stone-900 border-2 border-amber-500 rounded-3xl p-6 shadow-2xl text-center overflow-hidden">
        {/* Header */}
        <div className="mb-4">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-wider">
            GEREBEK PUSAKA CAGAR BUDAYA
          </span>
          <h3 className="text-xl md:text-2xl font-black font-display text-stone-100 mt-2">
            Buka Peti Berisi Pusaka Serupa!
          </h3>
          <p className="text-xs text-stone-400">
            Temukan 3 pusaka yang sama untuk memenangkan dana tunjangan budaya raksasa!
          </p>
        </div>

        {/* Counters Tracker */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {(['jenang', 'batik', 'keris'] as RewardType[]).map((type) => {
            const r = rewards[type];
            return (
              <div
                key={type}
                className="p-2 rounded-xl bg-stone-950/80 border border-stone-800 flex flex-col items-center"
              >
                <span className="text-xl">{r.icon}</span>
                <span className="text-[10px] text-stone-400 font-bold truncate">{r.name}</span>
                <div className="flex gap-1 mt-1">
                  {[0, 1, 2].map((dotIdx) => (
                    <span
                      key={dotIdx}
                      className={`w-2 h-2 rounded-full ${
                        dotIdx < counts[type] ? 'bg-amber-400 ring-1 ring-amber-300' : 'bg-stone-800'
                      }`}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* 12 Chests Grid (3x4) */}
        <div className="grid grid-cols-4 gap-2.5 mb-6">
          {chestItems.map((item, idx) => {
            const isRevealed = revealed[idx];
            const r = rewards[item];

            return (
              <button
                key={idx}
                disabled={isRevealed || !!winner}
                onClick={() => handleOpenChest(idx)}
                className={`h-16 md:h-20 rounded-2xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isRevealed
                    ? 'bg-amber-950/40 border-amber-400 text-stone-100 scale-100'
                    : 'bg-stone-950 border-stone-800 hover:border-amber-500/60 hover:scale-105 active:scale-95'
                }`}
              >
                {isRevealed ? (
                  <div className="flex flex-col items-center animate-fade-in">
                    <span className="text-2xl">{r.icon}</span>
                    <span className="text-[9px] font-bold text-amber-300 truncate max-w-[70px]">
                      {r.name.split(' ')[0]}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-stone-600">
                    <span className="text-2xl">📦</span>
                    <span className="text-[9px] font-mono text-stone-500">PETI</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Win Banner & Claim Button */}
        {winner && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-display animate-fade-in shadow-xl">
            <div className="text-sm font-bold uppercase tracking-wider">
              🎉 {rewards[winner].tier}!
            </div>
            <div className="text-2xl md:text-3xl font-black font-mono">
              +{formatRupiah(rewards[winner].cash)}
            </div>
            <p className="text-xs text-stone-900 mt-1 mb-3">
              Kamu berhasil mengumpulkan 3 {rewards[winner].name}!
            </p>
            <button
              onClick={() => onComplete(rewards[winner].cash)}
              className="w-full py-2.5 rounded-xl font-black bg-stone-950 text-amber-300 hover:bg-stone-900 transition-colors cursor-pointer shadow-lg"
            >
              Klaim Hadiah & Lanjutkan
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
