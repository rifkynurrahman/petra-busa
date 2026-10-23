import React from 'react';
import { TileData, TileState, Player } from '../types/game';
import { HouseArtSvg } from './HouseArtSvg';
import { sound } from '../utils/audio';

interface RentPayModalProps {
  tile: TileData;
  tileState: TileState;
  visitor: Player;
  owner: Player;
  rentAmount: number;
  onTakeover?: (cost: number) => void;
  onProceed: () => void;
}

export const RentPayModal: React.FC<RentPayModalProps> = ({
  tile,
  tileState,
  visitor,
  owner,
  rentAmount,
  onTakeover,
  onProceed,
}) => {
  const isLandmark = tileState.houses >= 4;
  const basePrice = tile.price || 15000000;
  const totalInvested = basePrice + (tileState.houses || 0) * (tile.houseCost || Math.floor(basePrice * 0.5));
  const takeoverCost = totalInvested * 2;
  const canAffordTakeover = !isLandmark && visitor.balance >= takeoverCost;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-stone-900 to-stone-950 border-2 border-rose-500/60 shadow-2xl overflow-hidden flex flex-col text-stone-100">
        
        {/* Header Warning */}
        <div className="p-4 bg-gradient-to-r from-rose-900 via-rose-950 to-stone-900 border-b border-rose-500/40 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-black/50 border border-rose-400/50 flex items-center justify-center text-2xl shadow-inner">
            💸
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-300 block">
              MENDARAT DI RUMAH ADAT LAWAN
            </span>
            <h3 className="text-base md:text-lg font-black text-white">
              {tile.name} ({owner.name})
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Rent Paid Box */}
          <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 text-center">
            <span className="text-xs text-stone-400 block mb-1">
              Biaya Sewa yang Telah Dibayar ke {owner.name}:
            </span>
            <div className="text-2xl md:text-3xl font-black font-mono text-rose-400">
              - {formatRupiah(rentAmount)}
            </div>
            <div className="flex items-center justify-center gap-2 mt-2 text-xs text-stone-400">
              <HouseArtSvg type={tile.houseSvgType} size={28} />
              <span>
                {tile.houseName} · Tingkat {tileState.houses} {isLandmark && '(⭐ Landmark)'}
              </span>
            </div>
          </div>

          {/* Takeover (Akuisisi) Option if not Landmark */}
          {!isLandmark ? (
            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  ⚡ Tawaran Ambil Alih (Akuisisi)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                  2x Lipat
                </span>
              </div>
              <p className="text-[11px] text-stone-300">
                Anda dapat membeli kepemilikan Rumah Adat ini dari {owner.name} seharga{' '}
                <strong className="text-amber-300 font-mono">{formatRupiah(takeoverCost)}</strong>!
              </p>

              {canAffordTakeover ? (
                <button
                  onClick={() => {
                    sound.playCoin();
                    onTakeover?.(takeoverCost);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl font-black text-xs text-stone-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 shadow-md shadow-amber-500/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>⚡ Ambil Alih Rumah Adat Ini! ({formatRupiah(takeoverCost)})</span>
                </button>
              ) : (
                <span className="text-[10px] text-rose-400 block font-semibold">
                  Saldo Anda ({formatRupiah(visitor.balance)}) tidak cukup untuk akuisisi.
                </span>
              )}
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-stone-950 border border-amber-500/40 text-center text-xs text-amber-300 font-bold">
              ⭐ Bangunan ini adalah Landmark Cagar Budaya dan tidak dapat diambil alih!
            </div>
          )}

          {/* Proceed Button */}
          <button
            onClick={onProceed}
            className="w-full py-3 px-4 rounded-xl font-extrabold text-xs md:text-sm bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Lanjutkan Giliran ➔</span>
          </button>
        </div>

      </div>
    </div>
  );
};
