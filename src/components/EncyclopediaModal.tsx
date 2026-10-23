import React, { useState } from 'react';
import { TileData } from '../types/game';
import { HouseArtSvg } from './HouseArtSvg';

interface EncyclopediaModalProps {
  tiles: TileData[];
  onClose: () => void;
  onSelectTile?: (tile: TileData) => void;
}

export const EncyclopediaModal: React.FC<EncyclopediaModalProps> = ({
  tiles,
  onClose,
  onSelectTile,
}) => {
  const [selectedIsland, setSelectedIsland] = useState<string>('Semua');

  // Filter only cultural property tiles
  const propertyTiles = tiles.filter((t) => t.type === 'property' || t.type === 'stasiun');

  const islands = ['Semua', 'Jawa', 'Sumatera', 'Bali-Nusra', 'Kalimantan', 'Sulawesi', 'Maluku-Papua'];

  const filtered = selectedIsland === 'Semua'
    ? propertyTiles
    : propertyTiles.filter((t) => t.island === selectedIsland);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-stone-900 border-2 border-amber-600/50 rounded-3xl p-5 md:p-8 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏛️</span>
            <div>
              <h3 className="text-xl md:text-2xl font-black font-display text-amber-200">
                Ensiklopedia Rumah Adat Nusantara
              </h3>
              <p className="text-xs text-stone-400">
                Katalog kekayaan arsitektur tradisional dan kearifan lokal 38 provinsi Indonesia
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

        {/* Island Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-none shrink-0">
          {islands.map((island) => (
            <button
              key={island}
              onClick={() => setSelectedIsland(island)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                selectedIsland === island
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                  : 'bg-stone-800/80 text-stone-400 hover:bg-stone-750 hover:text-stone-200 border border-stone-700/60'
              }`}
            >
              {island}
            </button>
          ))}
        </div>

        {/* Houses Grid */}
        <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filtered.map((tile) => (
            <div
              key={tile.id}
              onClick={() => onSelectTile?.(tile)}
              className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800 hover:border-amber-400 transition-all duration-200 flex items-start gap-4 cursor-pointer group"
            >
              <div className="p-2 rounded-xl bg-stone-900 border border-stone-800 shrink-0 group-hover:scale-105 transition-transform">
                <HouseArtSvg type={tile.houseSvgType} size={56} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    {tile.province}
                  </span>
                  <span className="text-[10px] font-mono text-stone-400">
                    Petak #{tile.id}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-stone-100 group-hover:text-amber-300 transition-colors">
                  {tile.houseName}
                </h4>
                <p className="text-xs text-stone-400 line-clamp-2 mt-1 leading-relaxed">
                  {tile.trivia}
                </p>
                <div className="mt-2 text-[11px] text-amber-300/90 italic truncate">
                  "{tile.culturalPhilosophy}"
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
          <span>Menampilkan {filtered.length} situs budaya Nusantara</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium cursor-pointer"
          >
            Kembali ke Papan
          </button>
        </div>
      </div>
    </div>
  );
};
