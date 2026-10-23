import React, { useState } from 'react';
import { sound } from '../utils/audio';

interface MainMenuScreenProps {
  onPlay: () => void;
  bgTheme?: 'valley' | 'autumn' | 'violet';
  setBgTheme?: React.Dispatch<React.SetStateAction<'valley' | 'autumn' | 'violet'>>;
  isIsometric?: boolean;
  setIsIsometric?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MainMenuScreen: React.FC<MainMenuScreenProps> = ({
  onPlay,
}) => {
  const [activeModal, setActiveModal] = useState<'setting' | 'info' | null>(null);
  const [isSfxMuted, setIsSfxMuted] = useState<boolean>(sound.getSfxMuted());
  const [musicPercent, setMusicPercent] = useState<number>(Math.round(sound.getMusicVolume() * 100));

  const handlePlayClick = () => {
    sound.playDiceRoll();
    onPlay();
  };

  const handleOpenSetting = () => {
    sound.playCoin();
    setActiveModal('setting');
  };

  const handleOpenInfo = () => {
    sound.playCoin();
    setActiveModal('info');
  };

  const handleCloseModal = () => {
    sound.playCoin();
    setActiveModal(null);
  };

  return (
    <div
      className="relative w-screen h-screen flex flex-col items-center justify-between p-4 md:p-8 text-stone-100 overflow-hidden select-none bg-cover bg-center bg-no-repeat font-sans"
      style={{
        backgroundImage: `url('/assets/aistudio/Kelompok_4_-_Stack__13__408621db.png')`,
      }}
    >
      {/* CENTER HERO SECTION: ENLARGED PETRA BUSA LOGO & 3D BUTTONS */}
      <div className="relative z-20 flex flex-col items-center justify-center my-auto w-full max-w-md md:max-w-lg px-4 gap-2 sm:gap-3">
        {/* ENLARGED PETRA BUSA LOGO */}
        <div className="relative flex items-center justify-center animate-fade-in">
          <img
            src="/assets/aistudio/Untitled_design__30__632c093e.png"
            alt="PETRA BUSA"
            className="w-80 sm:w-[420px] md:w-[480px] max-w-full h-auto object-contain filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.65)] mix-blend-multiply transition-transform hover:scale-105 duration-300 select-none"
          />
        </div>

        {/* 3 STACKED 3D GLOSSY MENU BUTTONS (PLAY, SETTING, INFO) */}
        <div className="flex flex-col items-center gap-3 sm:gap-4 w-full max-w-[280px] sm:max-w-xs md:max-w-sm -mt-2 sm:-mt-4">
          {/* 1. PLAY BUTTON */}
          <button
            onClick={handlePlayClick}
            className="w-full py-3.5 sm:py-4 px-8 rounded-3xl bg-gradient-to-b from-[#FFFDF0] via-[#FEF08A] to-[#FACC15] border-4 border-[#EAB308] shadow-[0_8px_0_#B45309,0_12px_24px_rgba(0,0,0,0.5)] text-[#713f12] font-black font-display text-2xl sm:text-3xl tracking-widest uppercase transition-all duration-150 cursor-pointer hover:brightness-105 hover:-translate-y-0.5 active:translate-y-1.5 active:shadow-[0_2px_0_#B45309] flex items-center justify-center"
          >
            <span>PLAY</span>
          </button>

          {/* 2. SETTING BUTTON */}
          <button
            onClick={handleOpenSetting}
            className="w-full py-3.5 sm:py-4 px-8 rounded-3xl bg-gradient-to-b from-[#FFFDF0] via-[#FEF08A] to-[#FACC15] border-4 border-[#EAB308] shadow-[0_8px_0_#B45309,0_12px_24px_rgba(0,0,0,0.5)] text-[#713f12] font-black font-display text-2xl sm:text-3xl tracking-widest uppercase transition-all duration-150 cursor-pointer hover:brightness-105 hover:-translate-y-0.5 active:translate-y-1.5 active:shadow-[0_2px_0_#B45309] flex items-center justify-center"
          >
            <span>SETTING</span>
          </button>

          {/* 3. INFO BUTTON */}
          <button
            onClick={handleOpenInfo}
            className="w-full py-3.5 sm:py-4 px-8 rounded-3xl bg-gradient-to-b from-[#FFFDF0] via-[#FEF08A] to-[#FACC15] border-4 border-[#EAB308] shadow-[0_8px_0_#B45309,0_12px_24px_rgba(0,0,0,0.5)] text-[#713f12] font-black font-display text-2xl sm:text-3xl tracking-widest uppercase transition-all duration-150 cursor-pointer hover:brightness-105 hover:-translate-y-0.5 active:translate-y-1.5 active:shadow-[0_2px_0_#B45309] flex items-center justify-center"
          >
            <span>INFO</span>
          </button>
        </div>
      </div>

      {/* ================= MODAL: SETTING ================= */}
      {activeModal === 'setting' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md gui-card-gold p-6 rounded-3xl text-stone-900 shadow-2xl">
            <div className="gui-ribbon-gold px-4 py-1.5 rounded-2xl text-center font-black text-sm uppercase tracking-wider mb-5 shadow-sm">
              ⚙️ PENGATURAN PERMAINAN
            </div>

            <div className="space-y-4">
              {/* Sound FX Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-100/80 border border-amber-300">
                <span className="font-extrabold text-sm text-amber-950">🔊 Efek Suara (SFX):</span>
                <button
                  onClick={() => {
                    const m = sound.toggleSfx();
                    setIsSfxMuted(m);
                  }}
                  className={`gui-btn ${isSfxMuted ? 'gui-btn-red' : 'gui-btn-green'} px-4 py-2 text-xs font-black`}
                >
                  {isSfxMuted ? '🔇 MATI' : '🔊 NYALA'}
                </button>
              </div>

              {/* Music Volume Slider */}
              <div className="p-3.5 rounded-2xl bg-amber-100/80 border border-amber-300 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-amber-950">🎵 Musik BGM:</span>
                  <span className="font-black text-xs text-amber-900 bg-amber-200 px-2.5 py-0.5 rounded-full">
                    {musicPercent}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={musicPercent}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setMusicPercent(val);
                    sound.setMusicVolume(val / 100);
                  }}
                  className="w-full accent-amber-600 cursor-pointer h-2 bg-amber-200 rounded-lg"
                />
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="gui-btn gui-btn-gold w-full mt-6 py-3 text-sm font-black text-amber-950"
            >
              TUTUP SETTING
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL: INFO ================= */}
      {activeModal === 'info' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg gui-card-gold p-6 rounded-3xl text-stone-900 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="gui-ribbon-gold px-4 py-1.5 rounded-2xl text-center font-black text-sm uppercase tracking-wider mb-4 shadow-sm">
              📜 INFORMASI & CARA BERMAIN
            </div>

            <div className="space-y-4 text-xs md:text-sm leading-relaxed text-stone-800">
              <div className="p-3.5 rounded-2xl bg-amber-100/80 border border-amber-300">
                <h4 className="font-black text-amber-950 text-sm mb-1">🎮 Cara Bermain:</h4>
                <ol className="list-decimal list-inside space-y-1 font-medium">
                  <li>Pilih jumlah pemain (2, 3, atau 4 pemain) & avatar pion budaya.</li>
                  <li>Lempar dadu untuk menjelajahi kota-kota warisan kebudayaan Indonesia.</li>
                  <li>Beli tanah adat & bangun Rumah Adat 3D untuk mengumpulkan sewa.</li>
                  <li>Jawab Kuis Tantangan Budaya untuk mendapatkan bonus uang tunai!</li>
                </ol>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-100/80 border border-amber-300">
                <h4 className="font-black text-amber-950 text-sm mb-1">🏛️ Edukasi Warisan Nusantara:</h4>
                <p className="font-medium">
                  Monopoli Warisan Nusantara adalah media pembelajaran interaktif yang memperkenalkan Rumah Adat, Baju Adat, dan Cagar Budaya dari Sabang sampai Merauke.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-100/80 border border-amber-300 text-center">
                <h4 className="font-black text-amber-950 text-sm">👥 Pengembang:</h4>
                <ol className="list-decimal list-inside space-y-1 font-medium">
                  <li>Nala Nurani - 202432047 - PBI</li>
                  <li>Dita Dwi Hidayat - 202531012 - Bimbingan dan Konseling</li>
                </ol>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="gui-btn gui-btn-gold w-full mt-5 py-3 text-sm font-black text-amber-950"
            >
              TUTUP INFORMASI
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
