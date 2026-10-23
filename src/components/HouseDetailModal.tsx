import React from 'react';
import { TileData, TileState, Player } from '../types/game';
import { HouseArtSvg } from './HouseArtSvg';
import { sound } from '../utils/audio';

interface HouseDetailModalProps {
  tile: TileData;
  tileState: TileState;
  players: Player[];
  activePlayer: Player;
  isLandedAction?: boolean;
  onBuy?: () => void;
  onBuild?: () => void;
  onClose: () => void;
}

export const HouseDetailModal: React.FC<HouseDetailModalProps> = ({
  tile,
  tileState,
  players,
  activePlayer,
  isLandedAction = false,
  onBuy,
  onBuild,
  onClose,
}) => {
  const formatRupiah = (num?: number) => {
    if (!num) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const owner = tileState.owner !== null ? players.find((p) => p.id === tileState.owner) : null;
  const isOwner = tileState.owner === activePlayer.id;
  const canBuy = isLandedAction && !owner && activePlayer.balance >= (tile.price || 0) && !activePlayer.isAI;
  const canBuild = isOwner && (tileState.houses < 4) && activePlayer.balance >= (tile.houseCost || 0) && !activePlayer.isAI;

  const handleBuy = () => {
    sound.playCoin();
    onBuy?.();
  };

  const handleBuild = () => {
    sound.playGamelanChime();
    onBuild?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-stone-900 border-2 rounded-3xl p-6 shadow-2xl overflow-hidden"
        style={{ borderColor: tile.colorGroup }}
      >
        {/* Top color header strip */}
        <div 
          className="absolute top-0 left-0 right-0 h-3"
          style={{ backgroundColor: tile.colorGroup }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center border border-stone-700 cursor-pointer"
        >
          ✕
        </button>

        {/* Header Art & Titles */}
        <div className="flex items-start gap-4 mb-4 mt-1">
          <div className="p-2 rounded-2xl bg-stone-950/80 border border-stone-800 shadow-md">
            <HouseArtSvg type={tile.houseSvgType} size={72} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                {tile.province} · {tile.island}
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-stone-100 font-display leading-tight truncate">
              {tile.name}
            </h3>
            <p className="text-xs text-stone-300 font-medium">
              {tile.houseName}
            </p>

            {/* Ownership tag */}
            <div className="mt-2 text-xs">
              {owner ? (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-semibold text-stone-200 border"
                  style={{ backgroundColor: `${owner.color}30`, borderColor: owner.color }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: owner.color }} />
                  Milik: {owner.name}
                  {tileState.houses > 0 && (
                    <span className="text-amber-300 font-mono">
                      ({tileState.houses === 4 ? 'Anjungan Cagar Budaya' : `${tileState.houses} Balai Budaya`})
                    </span>
                  )}
                </span>
              ) : (
                <span className="text-stone-400 font-medium">
                  Status: <strong className="text-emerald-400">Tanah Ulayat / Belum Dimiliki</strong>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Cultural Philosophy & Trivia Tabs */}
        <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800/80 mb-4 text-xs space-y-2">
          <div>
            <span className="font-bold text-amber-300 block mb-0.5">Filosofi & Nilai Kearifan:</span>
            <p className="text-stone-300 leading-relaxed italic">
              "{tile.culturalPhilosophy}"
            </p>
          </div>
          <div className="pt-2 border-t border-stone-800/60">
            <span className="font-bold text-amber-400 block mb-0.5">Keunikan Arsitektur Nusantara:</span>
            <p className="text-stone-300 leading-relaxed">
              {tile.trivia}
            </p>
          </div>
        </div>

        {/* Rent & Price Breakdown (Monopoly Deed) */}
        {tile.type === 'property' && (
          <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800 text-xs mb-5 font-mono">
            <div className="flex justify-between py-1 border-b border-stone-800/60">
              <span className="text-stone-400 font-sans">Harga Beli Hak Adat</span>
              <strong className="text-amber-400">{formatRupiah(tile.price)}</strong>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-stone-400 font-sans">Sewa Tanah Adat</span>
              <span className="text-stone-200">{formatRupiah(tile.baseRent)}</span>
            </div>
            {tile.houseRent && (
              <>
                <div className="flex justify-between py-0.5 text-stone-300">
                  <span className="text-stone-400 font-sans">Dengan 1 Balai Budaya</span>
                  <span>{formatRupiah(tile.houseRent[0])}</span>
                </div>
                <div className="flex justify-between py-0.5 text-stone-300">
                  <span className="text-stone-400 font-sans">Dengan 2 Balai Budaya</span>
                  <span>{formatRupiah(tile.houseRent[1])}</span>
                </div>
                <div className="flex justify-between py-0.5 text-stone-300">
                  <span className="text-stone-400 font-sans">Dengan 3 Balai Budaya</span>
                  <span>{formatRupiah(tile.houseRent[2])}</span>
                </div>
              </>
            )}
            <div className="flex justify-between py-1 border-t border-stone-800/60 text-amber-300 font-bold">
              <span className="font-sans">Anjungan Cagar Budaya (Maksimal)</span>
              <span>{formatRupiah(tile.hotelRent)}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-stone-800/60 text-stone-400 text-[11px]">
              <span className="font-sans">Biaya Tambah Balai Budaya</span>
              <span>{formatRupiah(tile.houseCost)}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          {canBuy && (
            <button
              onClick={handleBuy}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-stone-950 shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Beli Hak Adat</span>
              <span className="font-mono text-xs font-black">({formatRupiah(tile.price)})</span>
            </button>
          )}

          {canBuild && (
            <button
              onClick={handleBuild}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-lg shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Bangun Balai Budaya</span>
              <span className="font-mono text-xs font-black">({formatRupiah(tile.houseCost)})</span>
            </button>
          )}

          <button
            onClick={onClose}
            className={`py-3 px-5 rounded-xl font-semibold text-sm border border-stone-700 bg-stone-800 hover:bg-stone-750 text-stone-200 cursor-pointer ${
              !canBuy && !canBuild ? 'w-full' : ''
            }`}
          >
            {isLandedAction ? 'Lewati / Selesai' : 'Tutup'}
          </button>
        </div>
      </div>
    </div>
  );
};
