import React from 'react';
import { CulturalMission } from '../types/game';
import { sound } from '../utils/audio';

interface MissionsModalProps {
  missions: CulturalMission[];
  onClaimReward: (missionId: string) => void;
  onClose: () => void;
}

export const MissionsModal: React.FC<MissionsModalProps> = ({
  missions,
  onClaimReward,
  onClose,
}) => {
  const formatRupiah = (num: number) => {
    return `Rp ${(num / 1000000).toFixed(0)} Juta`;
  };

  const handleClaim = (m: CulturalMission) => {
    sound.playCoin();
    onClaimReward(m.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-stone-900 border-2 border-amber-500 rounded-3xl p-5 md:p-7 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl text-amber-300">
              📋
            </div>
            <div>
              <h3 className="text-xl font-black font-display text-stone-100">
                Misi Budaya Siswa
              </h3>
              <p className="text-xs text-stone-400">
                Selesaikan tugas harian untuk menambah dadu energi & kas kebudayaan!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center border border-stone-700 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Missions List */}
        <div className="space-y-3 flex-1 overflow-y-auto pr-1">
          {missions.map((m) => {
            const isReady = m.current >= m.target && !m.claimed;
            const progressPct = Math.min(100, Math.round((m.current / m.target) * 100));

            return (
              <div
                key={m.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  m.claimed
                    ? 'bg-stone-950/40 border-stone-900 opacity-60'
                    : isReady
                    ? 'bg-amber-950/30 border-amber-500 shadow-md shadow-amber-500/10'
                    : 'bg-stone-950/70 border-stone-800'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h4 className="text-sm font-bold text-stone-100">{m.title}</h4>
                  <span className="text-xs font-mono font-bold text-amber-300">
                    {m.current}/{m.target}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-stone-800 overflow-hidden mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-stone-300">
                    <span className="flex items-center gap-1 text-sky-300 font-mono font-bold">
                      🎲 +{m.rewardDice}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-emerald-400 font-mono font-bold">
                      💵 {formatRupiah(m.rewardCash)}
                    </span>
                  </div>

                  {m.claimed ? (
                    <span className="text-[11px] font-bold text-stone-500">
                      ✓ Sudah Diklaim
                    </span>
                  ) : isReady ? (
                    <button
                      onClick={() => handleClaim(m)}
                      className="px-3 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs shadow-md shadow-amber-500/30 cursor-pointer animate-bounce"
                    >
                      KLAIM!
                    </button>
                  ) : (
                    <span className="text-[11px] text-stone-500">Belum Selesai</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-stone-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-sm font-bold cursor-pointer"
          >
            Tutup Misi
          </button>
        </div>
      </div>
    </div>
  );
};
