import React from 'react';
import { AlbumCard } from '../types/game';

interface AlbumModalProps {
  cards: AlbumCard[];
  onClose: () => void;
}

export const AlbumModal: React.FC<AlbumModalProps> = ({ cards, onClose }) => {
  const categories: Array<AlbumCard['category']> = ['Kudus', 'Sumatera', 'Jawa-Bali', 'Kalimantan-Papua'];

  const collectedCount = cards.filter((c) => c.collected).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-stone-900 border-2 border-amber-500 rounded-3xl p-5 md:p-7 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl text-amber-300">
              🎴
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black font-display text-stone-100 flex items-center gap-2">
                <span>Album Pusaka Budaya</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {collectedCount}/{cards.length} Terkumpul
                </span>
              </h3>
              <p className="text-xs text-stone-400">
                Koleksi kartu cagar budaya nusantara dari petak Kesempatan dan Kuis!
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

        {/* Categories Sections */}
        <div className="flex-1 overflow-y-auto space-y-5 pr-1">
          {categories.map((cat) => {
            const catCards = cards.filter((c) => c.category === cat);
            const isCompleted = catCards.every((c) => c.collected);

            return (
              <div key={cat} className="p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                    <span>{cat === 'Kudus' ? '🏛️ Warisan Luhur Kudus' : `📍 Seri ${cat}`}</span>
                    {isCompleted && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                        SET LENGKAP (+150 DADU)
                      </span>
                    )}
                  </h4>
                  <span className="text-xs font-mono text-stone-400">
                    {catCards.filter((c) => c.collected).length}/{catCards.length}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {catCards.map((card) => (
                    <div
                      key={card.id}
                      className={`p-3 rounded-xl border flex flex-col justify-between text-center transition-all ${
                        card.collected
                          ? 'bg-gradient-to-b from-stone-900 to-stone-950 border-amber-400/80 shadow-md shadow-amber-500/10'
                          : 'bg-stone-950/40 border-stone-900 opacity-40'
                      }`}
                    >
                      <div className="flex justify-center text-amber-400 text-xs mb-1">
                        {Array.from({ length: card.stars }).map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>

                      <div className="my-2">
                        <span className="text-2xl block mb-1">
                          {card.collected ? '📜' : '🔒'}
                        </span>
                        <h5 className="text-xs font-bold text-stone-200 line-clamp-1">
                          {card.title}
                        </h5>
                      </div>

                      <div className="text-[10px] text-stone-400">
                        {card.collected ? (
                          <span className="text-amber-300 font-mono font-bold">x{card.count}</span>
                        ) : (
                          <span>Belum Ada</span>
                        )}
                      </div>
                    </div>
                  ))}
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
            Tutup Album
          </button>
        </div>
      </div>
    </div>
  );
};
