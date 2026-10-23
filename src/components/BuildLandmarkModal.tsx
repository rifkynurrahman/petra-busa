import React from 'react';
import { Landmark } from '../types/game';
import { HouseArtSvg } from './HouseArtSvg';
import { sound } from '../utils/audio';

interface BuildLandmarkModalProps {
  landmarks: Landmark[];
  playerCash: number;
  onUpgradeLandmark: (landmarkId: string) => void;
  onClose: () => void;
}

export const BuildLandmarkModal: React.FC<BuildLandmarkModalProps> = ({
  landmarks,
  playerCash,
  onUpgradeLandmark,
  onClose,
}) => {
  const formatRupiah = (num: number) => {
    if (num >= 1000000000) {
      return `Rp ${(num / 1000000000).toFixed(2)} Milyar`;
    }
    if (num >= 1000000) {
      return `Rp ${(num / 1000000).toFixed(1)} Juta`;
    }
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const getUpgradeCost = (landmark: Landmark) => {
    return Math.round(landmark.baseCost * Math.pow(landmark.multiplier, landmark.level));
  };

  const handleUpgrade = (landmark: Landmark) => {
    const cost = getUpgradeCost(landmark);
    if (playerCash < cost || landmark.level >= landmark.maxLevel) return;
    sound.playGamelanChime();
    onUpgradeLandmark(landmark.id);
  };

  const totalCompleted = landmarks.filter((l) => l.level >= l.maxLevel).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-stone-900 border-2 border-amber-500 rounded-3xl p-5 md:p-7 shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl text-amber-300">
              🔨
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black font-display text-stone-100 flex items-center gap-2">
                <span>Bangun Cagar Budaya</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {totalCompleted}/{landmarks.length} Selesai
                </span>
              </h3>
              <p className="text-xs text-stone-400">
                Tingkatkan rumah adat untuk melipatgandakan sewa dan menaikkan Net Worth!
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

        {/* Current Cash Banner */}
        <div className="mb-4 p-3 rounded-2xl bg-stone-950/70 border border-stone-800 flex items-center justify-between">
          <span className="text-xs text-stone-400">Kas Budaya Tersedia:</span>
          <span className="font-mono font-extrabold text-base md:text-lg text-emerald-400">
            {formatRupiah(playerCash)}
          </span>
        </div>

        {/* Landmarks Upgrade Cards */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {landmarks.map((lm) => {
            const isMax = lm.level >= lm.maxLevel;
            const cost = getUpgradeCost(lm);
            const canAfford = playerCash >= cost && !isMax;

            return (
              <div
                key={lm.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isMax
                    ? 'bg-amber-950/20 border-amber-500/40'
                    : 'bg-stone-950/60 border-stone-800 hover:border-amber-500/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-xl bg-stone-900 border border-stone-800 shrink-0">
                    <HouseArtSvg type={lm.svgType} size={54} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                        {lm.region}
                      </span>
                      <span className="text-xs font-mono font-bold text-stone-300">
                        Tahap {lm.level}/{lm.maxLevel}
                      </span>
                    </div>

                    <h4 className="text-sm md:text-base font-bold text-stone-100 truncate">
                      {lm.name}
                    </h4>

                    {/* 5-Segment Progress Bar */}
                    <div className="flex gap-1.5 my-2">
                      {Array.from({ length: lm.maxLevel }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 flex-1 rounded-full transition-all ${
                            i < lm.level
                              ? 'bg-gradient-to-r from-amber-400 to-amber-500 shadow-sm shadow-amber-500/40'
                              : 'bg-stone-800'
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-xs text-stone-400 truncate mb-2">
                      {isMax ? '🏆 Mahakarya Selesai Dipugar!' : `Berikutnya: ${lm.stages[lm.level]}`}
                    </p>

                    {/* Action Button */}
                    <div className="flex items-center justify-end">
                      {isMax ? (
                        <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
                          ✓ Tingkat Maksimal
                        </span>
                      ) : (
                        <button
                          onClick={() => handleUpgrade(lm)}
                          disabled={!canAfford}
                          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                            canAfford
                              ? 'gui-btn gui-btn-green text-white'
                              : 'bg-stone-800 text-stone-500 border border-stone-700/60 cursor-not-allowed opacity-60'
                          }`}
                        >
                          <span>Bangun Tahap {lm.level + 1}</span>
                          <span className="font-mono">({formatRupiah(cost)})</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-stone-800 text-center">
          <button
            onClick={onClose}
            className="gui-btn gui-btn-blue w-full py-2.5 text-sm text-white font-black"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
