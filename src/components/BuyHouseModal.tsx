import React, { useState } from 'react';
import { TileData, TileState, Player } from '../types/game';
import { HouseArtSvg } from './HouseArtSvg';
import { sound } from '../utils/audio';

interface BuyHouseModalProps {
  tile: TileData;
  currentState: TileState;
  player: Player;
  onConfirmPurchase: (tileId: number, targetHouseLevel: number, totalCost: number) => void;
  onClose: () => void;
}

export const BuyHouseModal: React.FC<BuyHouseModalProps> = ({
  tile,
  currentState,
  player,
  onConfirmPurchase,
  onClose,
}) => {
  const isOwner = currentState.owner === player.id;
  const currentHouses = currentState.houses || 0;
  const basePrice = tile.price || 15000000;
  const houseCost = tile.houseCost || Math.floor(basePrice * 0.5);

  // Available tiers:
  // Level 1: Tanah + Pondok Adat
  // Level 2: Rumah Adat Tradisional Lengkap
  // Level 3: Kompleks Adat Megah
  // Level 4: Landmark Cagar Budaya (Mahkota Emas)
  const tiers = [
    {
      level: 1,
      title: 'Tingkat 1: Pondok Adat',
      desc: 'Pondok kayu ukir tradisional permulaan',
      cost: isOwner ? houseCost : basePrice,
      rent: tile.baseRent || Math.floor(basePrice * 0.2),
      icon: '🏡',
    },
    {
      level: 2,
      title: `Tingkat 2: ${tile.houseName.split(' ')[0]} Tradisional`,
      desc: `${tile.houseName} dengan ornamen khas daerah`,
      cost: isOwner ? (2 - currentHouses) * houseCost : basePrice + houseCost,
      rent: tile.houseRent?.[0] || Math.floor(basePrice * 0.45),
      icon: '🏠',
    },
    {
      level: 3,
      title: 'Tingkat 3: Kompleks Adat Megah',
      desc: 'Bangunan cagar budaya berarsitektur luhur lengkap',
      cost: isOwner ? (3 - currentHouses) * houseCost : basePrice + houseCost * 2,
      rent: tile.houseRent?.[1] || Math.floor(basePrice * 0.8),
      icon: '🏯',
    },
    {
      level: 4,
      title: 'Tingkat 4: Landmark Mahkota Emas ⭐',
      desc: 'Cagar budaya legendaris, kebal dari akuisisi lawan!',
      cost: isOwner ? (4 - currentHouses) * houseCost : basePrice + houseCost * 3,
      rent: tile.hotelRent || Math.floor(basePrice * 1.5),
      icon: '🏛️',
      isLandmark: true,
    },
  ];

  // Available options must be higher than current level
  const selectableTiers = isOwner
    ? tiers.filter((t) => t.level > currentHouses)
    : tiers;

  // Selected tier defaults to highest affordable or tier 2
  const [selectedLevel, setSelectedLevel] = useState<number>(() => {
    if (selectableTiers.length === 0) return 4;
    // Find highest affordable
    const affordable = selectableTiers.filter((t) => t.cost <= player.balance);
    if (affordable.length > 0) {
      return affordable[affordable.length - 1].level;
    }
    return selectableTiers[0].level;
  });

  const selectedTier = tiers.find((t) => t.level === selectedLevel) || selectableTiers[0];
  const totalCost = selectedTier ? selectedTier.cost : 0;
  const canAfford = player.balance >= totalCost;

  const handleBuy = () => {
    if (!canAfford) {
      sound.playQuizFail();
      return;
    }
    sound.playCoin();
    onConfirmPurchase(tile.id, selectedLevel, totalCost);
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/75 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 border-2 border-amber-500/60 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header Region Bar */}
        <div
          className="p-4 flex items-center justify-between text-white"
          style={{
            background: `linear-gradient(135deg, ${tile.colorGroup} 0%, #1c1917 100%)`,
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-black/40 border border-white/30 flex items-center justify-center shadow-inner">
              <HouseArtSvg type={tile.houseSvgType} size={36} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-200 block">
                {isOwner ? 'RENOVASI & UPGRADE' : 'BELI TANAH & BANGUN'} · {tile.province}
              </span>
              <h3 className="text-lg md:text-xl font-black font-display text-white">
                {tile.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/50 text-white/80 hover:text-white flex items-center justify-center text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 md:p-5 space-y-4 overflow-y-auto max-h-[75vh]">
          {/* House Intro Card */}
          <div className="p-3 rounded-2xl bg-stone-950/70 border border-stone-800 flex items-center gap-3">
            <span className="text-2xl">🏛️</span>
            <div className="flex-1 text-xs">
              <strong className="text-amber-300 block">{tile.houseName}</strong>
              <p className="text-stone-400 text-[11px] mt-0.5 line-clamp-2">
                {tile.trivia}
              </p>
            </div>
          </div>

          {/* Tier Selection */}
          <div>
            <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2">
              Pilih Model Rumah Adat yang Ingin Dibangun:
            </label>

            <div className="space-y-2">
              {selectableTiers.map((t) => {
                const isSelected = selectedLevel === t.level;
                const affordable = player.balance >= t.cost;

                return (
                  <div
                    key={t.level}
                    onClick={() => {
                      if (affordable) {
                        setSelectedLevel(t.level);
                        sound.playCoin();
                      }
                    }}
                    className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-amber-950/50 border-amber-400 shadow-md ring-2 ring-amber-400/40'
                        : affordable
                        ? 'bg-stone-950/60 border-stone-800 hover:border-stone-600'
                        : 'bg-stone-950/30 border-stone-900 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{t.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs md:text-sm text-stone-100">
                            {t.title}
                          </h4>
                          {t.isLandmark && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-500 text-stone-950 text-[9px] font-black uppercase">
                              Kebal Lawan
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-stone-400 mt-0.5">
                          {t.desc}
                        </p>
                        <span className="text-[10px] text-emerald-400 font-mono font-semibold block mt-0.5">
                          Tarif Sewa: {formatRupiah(t.rent)}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs md:text-sm font-black font-mono text-amber-300 block">
                        {formatRupiah(t.cost)}
                      </span>
                      <span
                        className={`text-[9px] font-bold block mt-1 ${
                          isSelected
                            ? 'text-amber-400'
                            : affordable
                            ? 'text-stone-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {isSelected ? '✓ Dipilih' : affordable ? 'Bisa Dibangun' : 'Uang Kurang'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Player Balance Summary */}
          <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800/80 flex items-center justify-between text-xs">
            <div>
              <span className="text-stone-400 block text-[10px]">Saldo Saat Ini:</span>
              <strong className="text-stone-100 font-mono text-xs md:text-sm">
                {formatRupiah(player.balance)}
              </strong>
            </div>
            <span className="text-stone-600 text-base">➔</span>
            <div className="text-right">
              <span className="text-stone-400 block text-[10px]">Sisa Saldo Setelah Bangun:</span>
              <strong
                className={`font-mono text-xs md:text-sm ${
                  canAfford ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {formatRupiah(Math.max(0, player.balance - totalCost))}
              </strong>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onClose}
              className="gui-btn gui-btn-red py-3 px-4 text-xs font-bold text-white"
            >
              Batal
            </button>

            <button
              onClick={handleBuy}
              disabled={!canAfford}
              className={`flex-1 py-3 px-4 text-xs md:text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                canAfford
                  ? 'gui-btn gui-btn-green text-white cursor-pointer'
                  : 'bg-stone-300 text-stone-500 border border-stone-400 cursor-not-allowed rounded-xl font-bold'
              }`}
            >
              <span>🏛️ Bangun Rumah Adat Sekarang</span>
              <span className="font-mono">({formatRupiah(totalCost)})</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
