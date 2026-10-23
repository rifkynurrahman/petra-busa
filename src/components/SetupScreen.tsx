import React, { useState } from 'react';
import { Player, AvatarId } from '../types/game';
import { AVATARS } from '../data/avatars';
import { sound } from '../utils/audio';

interface SetupScreenProps {
  onStartGame: (players: Player[], startingBalance: number) => void;
  onBack?: () => void;
}

// Custom Player Mode Icons (2, 3, 4 People)
const Icon2PlayersMode: React.FC<{ isSelected: boolean }> = ({ isSelected }) => (
  <div
    className={`w-11 h-11 md:w-13 md:h-13 rounded-2xl flex items-center justify-center p-1.5 border-2 transition-all shadow-md shrink-0 ${
      isSelected
        ? 'bg-amber-400 border-amber-200 text-stone-950 shadow-amber-500/40'
        : 'bg-amber-100/90 border-amber-300 text-amber-900'
    }`}
  >
    <svg viewBox="0 0 64 64" className="w-full h-full fill-current">
      <circle cx="20" cy="18" r="8" />
      <path d="M10 48c0-6.6 5.4-12 12-12s12 5.4 12 12v4H10v-4z" />
      <circle cx="44" cy="18" r="8" />
      <path d="M34 48c0-6.6 5.4-12 12-12s12 5.4 12 12v4H34v-4z" />
    </svg>
  </div>
);

const Icon3PlayersMode: React.FC<{ isSelected: boolean }> = ({ isSelected }) => (
  <div
    className={`w-11 h-11 md:w-13 md:h-13 rounded-2xl flex items-center justify-center p-1.5 border-2 transition-all shadow-md shrink-0 ${
      isSelected
        ? 'bg-amber-400 border-amber-200 text-stone-950 shadow-amber-500/40'
        : 'bg-amber-100/90 border-amber-300 text-amber-900'
    }`}
  >
    <svg viewBox="0 0 64 64" className="w-full h-full fill-current">
      <circle cx="32" cy="15" r="7" />
      <path d="M22 42c0-5.5 4.5-10 10-10s10 4.5 10 10v4H22v-4z" />
      <circle cx="15" cy="22" r="5.5" />
      <path d="M7 48c0-4.4 3.6-8 8-8s8 3.1 8 8v3H7v-3z" />
      <circle cx="49" cy="22" r="5.5" />
      <path d="M41 48c0-4.4 3.6-8 8-8s8 3.1 8 8v3H41v-3z" />
    </svg>
  </div>
);

const Icon4PlayersMode: React.FC<{ isSelected: boolean }> = ({ isSelected }) => (
  <div
    className={`w-11 h-11 md:w-13 md:h-13 rounded-2xl flex items-center justify-center p-1.5 border-2 transition-all shadow-md shrink-0 ${
      isSelected
        ? 'bg-amber-400 border-amber-200 text-stone-950 shadow-amber-500/40'
        : 'bg-amber-100/90 border-amber-300 text-amber-900'
    }`}
  >
    <svg viewBox="0 0 64 64" className="w-full h-full fill-current">
      <circle cx="18" cy="16" r="6" />
      <path d="M10 38c0-4.4 3.6-8 8-8s8 3.6 8 8v2H10v-2z" />
      <circle cx="46" cy="16" r="6" />
      <path d="M38 38c0-4.4 3.6-8 8-8s8 3.6 8 8v2H38v-2z" />
      <circle cx="24" cy="32" r="5.5" />
      <path d="M17 54c0-3.9 3.1-7 7-7s7 3.1 7 7v2H17v-2z" />
      <circle cx="40" cy="32" r="5.5" />
      <path d="M33 54c0-3.9 3.1-7 7-7s7 3.1 7 7v2H33v-2z" />
    </svg>
  </div>
);

export const SetupScreen: React.FC<SetupScreenProps> = ({ onStartGame, onBack }) => {
  const [step, setStep] = useState<'count' | 'avatars' | 'ready'>('count');
  const [playerCount, setPlayerCount] = useState<number>(4);
  const [startingBalance, setStartingBalance] = useState<number>(50000000);
  const [currentPickingIndex, setCurrentPickingIndex] = useState<number>(0);

  const [players, setPlayers] = useState<
    Array<{
      name: string;
      avatarId: AvatarId;
      isAI: boolean;
      color: string;
      accentColor: string;
    }>
  >([
    {
      name: 'Player 1',
      avatarId: 'kudus',
      isAI: false,
      color: '#D97706',
      accentColor: '#F59E0B',
    },
    {
      name: 'Player 2',
      avatarId: 'batak',
      isAI: false,
      color: '#DC2626',
      accentColor: '#EF4444',
    },
    {
      name: 'Player 3',
      avatarId: 'jawa',
      isAI: false,
      color: '#B45309',
      accentColor: '#D97706',
    },
    {
      name: 'Player 4',
      avatarId: 'kebaya',
      isAI: false,
      color: '#0284C7',
      accentColor: '#38BDF8',
    },
  ]);

  const updatePlayer = (
    index: number,
    field: 'name' | 'avatarId' | 'isAI',
    val: string | boolean
  ) => {
    setPlayers((prev) => {
      const copy = [...prev];
      if (field === 'avatarId') {
        const found = AVATARS.find((a) => a.id === val);
        copy[index] = {
          ...copy[index],
          avatarId: val as AvatarId,
          color: found?.color || copy[index].color,
          accentColor: found?.accentColor || copy[index].accentColor,
        };
      } else {
        copy[index] = {
          ...copy[index],
          [field]: val,
        };
      }
      return copy;
    });
  };

  const handleSelectCount = (count: number) => {
    sound.playCoin();
    setPlayerCount(count);
  };

  const handleNextPlayer = () => {
    sound.playDiceRoll();
    if (currentPickingIndex < playerCount - 1) {
      setCurrentPickingIndex((prev) => prev + 1);
    } else {
      setStep('ready');
    }
  };

  const handlePrevPlayer = () => {
    sound.playCoin();
    if (currentPickingIndex > 0) {
      setCurrentPickingIndex((prev) => prev - 1);
    } else {
      setStep('count');
    }
  };

  const handleLaunchGame = () => {
    sound.playGamelanChime();
    const finalPlayers: Player[] = players.slice(0, playerCount).map((p, idx) => ({
      id: idx,
      name: p.name.trim() || `Player ${idx + 1}`,
      avatarId: p.avatarId,
      customPawnUrl: '',
      color: p.color,
      accentColor: p.accentColor,
      balance: startingBalance,
      position: 0,
      inJail: false,
      jailTurns: 0,
      getOutOfJailCards: 0,
      isBankrupt: false,
      isAI: p.isAI,
      propertiesOwned: [],
      diceEnergy: 150,
      netWorth: 100,
    }));
    onStartGame(finalPlayers, startingBalance);
  };

  const currentPlayer = players[currentPickingIndex];

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center p-2 sm:p-4 text-stone-900 overflow-y-auto bg-cover bg-center bg-no-repeat py-4"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(28, 18, 8, 0.55), rgba(18, 12, 5, 0.75)), url('/assets/aistudio/image_1218c60d.png')`,
      }}
    >
      {/* Decorative Warm Ambient Glow */}
      <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-black/40 pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl gui-card-gold p-4 sm:p-6 md:p-7 shadow-2xl text-stone-900 max-h-[94vh] overflow-y-auto my-auto flex flex-col justify-between">
        
        {/* Top Ribbon Header */}
        <div className="text-center mb-3 md:mb-4">
          <div className="flex items-center justify-between mb-2 gap-2">
            {onBack ? (
              <button
                onClick={onBack}
                className="gui-btn gui-btn-gold px-3 py-1 text-xs font-black flex items-center gap-1 shadow-sm"
              >
                <span>🏠</span>
                <span>Menu Utama</span>
              </button>
            ) : <div />}

            <div className="w-16 hidden sm:block" />
          </div>
          <h1 className="text-xl md:text-3xl font-black font-display tracking-tight text-amber-950">
            {step === 'count' && 'PILIH MODE PEMAIN'}
            {step === 'avatars' && `PLAYER ${currentPickingIndex + 1}: PILIH PION AVATAR`}
            {step === 'ready' && 'ROSTER PEMAIN SIAP BERTANDING!'}
          </h1>
          <p className="text-xs text-amber-900/90 font-bold mt-0.5 max-w-lg mx-auto">
            {step === 'count' && 'Pilih jumlah pemain yang akan bertanding menjelajahi warisan budaya Nusantara.'}
            {step === 'avatars' && `Pilih figur pion untuk Player ${currentPickingIndex + 1}. Setiap pion bersifat unik untuk masing-masing pemain.`}
            {step === 'ready' && 'Periksa pion dan nama peserta sebelum memulai petualangan keliling kepulauan Nusantara.'}
          </p>

          {/* Stepper Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mt-3">
            <div
              className={`flex items-center gap-1 px-3 py-0.5 rounded-2xl text-[11px] font-black transition-all ${
                step === 'count'
                  ? 'gui-btn-gold text-amber-950 shadow-sm ring-2 ring-amber-400'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}
            >
              <span>1. Mode Pemain</span>
            </div>
            <div className="w-3 h-0.5 bg-amber-300" />
            <div
              className={`flex items-center gap-1 px-3 py-0.5 rounded-2xl text-[11px] font-black transition-all ${
                step === 'avatars'
                  ? 'gui-btn-gold text-amber-950 shadow-sm ring-2 ring-amber-400'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}
            >
              <span>2. Pilih Avatar</span>
            </div>
            <div className="w-3 h-0.5 bg-amber-300" />
            <div
              className={`flex items-center gap-1 px-3 py-0.5 rounded-2xl text-[11px] font-black transition-all ${
                step === 'ready'
                  ? 'gui-btn-gold text-amber-950 shadow-sm ring-2 ring-amber-400'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}
            >
              <span>3. Siap Main</span>
            </div>
          </div>
        </div>

        {/* ================= STEP 1: PILIH JUMLAH PEMAIN ================= */}
        {step === 'count' && (
          <div className="space-y-4 md:space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              {[
                {
                  count: 2,
                  title: '2 Pemain',
                  desc: 'Mode Duel 1v1 Cerdas Cermat Budaya',
                  iconComp: Icon2PlayersMode,
                  badgeText: 'Mode 2 Player',
                },
                {
                  count: 3,
                  title: '3 Pemain',
                  desc: 'Trio Persaingan Kebudayaan Nusantara',
                  iconComp: Icon3PlayersMode,
                  badgeText: 'Mode 3 Player',
                },
                {
                  count: 4,
                  title: '4 Pemain',
                  desc: 'Turnamen Penuh 4 Sisi & Paling Seru!',
                  iconComp: Icon4PlayersMode,
                  badge: 'REKOMENDASI UTAMA',
                  badgeText: 'Mode 4 Player',
                },
              ].map((item) => {
                const isSelected = playerCount === item.count;
                const IconComponent = item.iconComp;

                return (
                  <button
                    key={item.count}
                    onClick={() => handleSelectCount(item.count)}
                    className={`p-3.5 md:p-4 rounded-2xl border-3 text-left transition-all duration-200 cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[135px] shadow-md ${
                      isSelected
                        ? 'bg-gradient-to-b from-amber-50 via-amber-100/90 to-amber-200/90 border-amber-500 shadow-amber-600/30 scale-[1.02] ring-3 ring-amber-400/50'
                        : 'bg-[#FFFDF5] border-amber-300/80 hover:border-amber-400 hover:bg-amber-50/80'
                    }`}
                  >
                    {item.badge && (
                      <div className="mb-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-stone-950 text-[9px] font-black uppercase tracking-wider shadow-xs inline-block">
                          {item.badge}
                        </span>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <IconComponent isSelected={isSelected} />
                        <div>
                          <span className="text-[9px] font-black uppercase tracking-wider text-amber-800 block">
                            {item.badgeText}
                          </span>
                          <h3 className="text-lg md:text-xl font-black font-display text-amber-950">
                            {item.title}
                          </h3>
                        </div>
                      </div>

                      <p className="text-[11px] md:text-xs text-stone-700 font-bold mt-1 leading-snug">
                        {item.desc}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-amber-200/80">
                      <span
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors font-black text-[10px] ${
                          isSelected
                            ? 'border-amber-600 bg-amber-500 text-stone-950'
                            : 'border-amber-400 bg-amber-100 text-transparent'
                        }`}
                      >
                        ✓
                      </span>
                      <span
                        className={`text-[11px] font-black uppercase tracking-wider ${
                          isSelected ? 'text-amber-900' : 'text-stone-500'
                        }`}
                      >
                        {isSelected ? 'Terpilih' : 'Pilih Mode Ini'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Starting Money / Modal Awal Selector */}
            <div className="p-3.5 md:p-4 rounded-2xl bg-amber-100/90 border-2 border-amber-400 shadow-xs">
              <h4 className="font-black text-amber-950 text-xs md:text-sm mb-2 flex items-center gap-1.5">
                <span>💰</span>
                <span>PILIH MODAL / UANG AWAL PEMAIN:</span>
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { label: 'Rp 25 Juta', val: 25000000, desc: 'Tantangan Ketat' },
                  { label: 'Rp 50 Juta', val: 50000000, desc: 'Standar Nusantara' },
                  { label: 'Rp 100 Juta', val: 100000000, desc: 'Modal Kaya Raya' },
                  { label: 'Rp 200 Juta', val: 200000000, desc: 'Sultan Budaya' },
                ].map((opt) => {
                  const isSelected = startingBalance === opt.val;
                  return (
                    <button
                      key={opt.val}
                      onClick={() => {
                        sound.playCoin();
                        setStartingBalance(opt.val);
                      }}
                      className={`p-2.5 rounded-xl border-2 text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 border-amber-300 text-stone-950 font-black shadow-md ring-2 ring-amber-300 scale-[1.02]'
                          : 'bg-[#FFFDF5] border-amber-300 text-amber-950 hover:bg-amber-50 font-bold'
                      }`}
                    >
                      <div className="text-xs md:text-sm font-black">{opt.label}</div>
                      <div className={`text-[9px] mt-0.5 ${isSelected ? 'text-amber-950 font-bold' : 'text-stone-600 font-medium'}`}>
                        {opt.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Showcase 4 Avatars */}
            <div className="p-3.5 md:p-4 rounded-2xl bg-amber-100/70 border-2 border-amber-400/80 text-center shadow-xs relative overflow-hidden">
              <div className="inline-flex items-center gap-2 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-stone-950 font-black text-[10px] uppercase tracking-wider shadow-xs mb-2">
                <span>4 PION KARAKTER BUDAYA NUSANTARA</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 items-end justify-center max-w-xl mx-auto">
                {AVATARS.map((av) => (
                  <div key={av.id} className="flex flex-col items-center group">
                    <div className="relative flex flex-col items-center justify-end">
                      <img
                        src={av.customPng}
                        alt={av.name}
                        className="h-20 md:h-24 object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] group-hover:scale-105 transition-transform duration-200 relative z-10"
                      />
                      {/* Standee Oval Pedestal Base */}
                      <div className="w-14 h-2.5 rounded-full bg-gradient-to-r from-amber-600/40 via-amber-400/70 to-amber-600/40 border border-amber-500/60 -mt-1.5 filter blur-[0.5px]" />
                    </div>

                    <span className="text-xs font-black text-amber-950 mt-1 truncate max-w-full">
                      {av.name}
                    </span>
                    <span className="text-[9px] font-bold text-amber-800">
                      {av.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Step Button */}
            <button
              onClick={() => {
                sound.playDiceRoll();
                setCurrentPickingIndex(0);
                setStep('avatars');
              }}
              className="gui-btn gui-btn-blue w-full py-3 px-6 text-sm md:text-base text-white font-black flex items-center justify-center gap-2 shadow-lg my-1"
            >
              <span>Lanjut: Pilih Pion Pemain ({playerCount} Pemain)</span>
              <span className="text-lg">➔</span>
            </button>
          </div>
        )}

        {/* ================= STEP 2: PILIH AVATAR PLAYER 1 - 4 ================= */}
        {step === 'avatars' && (
          <div className="space-y-4 md:space-y-5">
            {/* Player Switcher Tabs */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 border-b border-amber-300">
              {players.slice(0, playerCount).map((p, idx) => {
                const isCurrent = idx === currentPickingIndex;
                const av = AVATARS.find((a) => a.id === p.avatarId);
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      sound.playCoin();
                      setCurrentPickingIndex(idx);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      isCurrent
                        ? 'gui-btn-gold text-amber-950 shadow-sm ring-2 ring-amber-400'
                        : 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-amber-950 text-amber-300 font-mono flex items-center justify-center text-[9px] font-black">
                      P{idx + 1}
                    </span>
                    <span>{p.name || `Player ${idx + 1}`}</span>
                    {av && <span className="text-[9px] opacity-80">({av.name.split(' ')[0]})</span>}
                  </button>
                );
              })}
            </div>

            {/* Current Player Configuration Box */}
            <div className="p-3 md:p-3.5 rounded-2xl bg-amber-100/80 border-2 border-amber-300 flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex-1 w-full">
                <label className="text-[11px] font-black text-amber-950 block mb-0.5">
                  Nama Siswa / Player {currentPickingIndex + 1}:
                </label>
                <input
                  type="text"
                  maxLength={20}
                  value={currentPlayer.name}
                  onChange={(e) => updatePlayer(currentPickingIndex, 'name', e.target.value)}
                  placeholder={`Nama Player ${currentPickingIndex + 1}`}
                  className="w-full px-3 py-1.5 rounded-xl bg-[#FFFDF5] border-2 border-amber-300 text-stone-900 font-bold text-xs md:text-sm focus:border-amber-500 focus:outline-none shadow-inner"
                />
              </div>

              {/* AI or Human Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-900">Tipe Peserta:</span>
                <button
                  onClick={() => updatePlayer(currentPickingIndex, 'isAI', !currentPlayer.isAI)}
                  className={`px-3 py-1 rounded-xl border-2 text-xs font-black transition-colors cursor-pointer shadow-xs ${
                    currentPlayer.isAI
                      ? 'bg-sky-100 text-sky-900 border-sky-400'
                      : 'bg-emerald-100 text-emerald-900 border-emerald-400'
                  }`}
                >
                  {currentPlayer.isAI ? '🤖 Robot (AI)' : '👤 Siswa (Manual)'}
                </button>
              </div>
            </div>

            {/* 4 Avatar Cards with strict NO DUPLICATE logic */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-black uppercase tracking-wider text-amber-950">
                  Pilih Pion untuk Player {currentPickingIndex + 1}:
                </span>
                <span className="text-[10px] text-amber-800 font-bold">
                  Setiap pion unik (tidak boleh kembar)
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                {AVATARS.map((av) => {
                  const isSelected = currentPlayer.avatarId === av.id;
                  
                  // Check if another player has taken this avatar
                  const takenByPlayerIndex = players
                    .slice(0, playerCount)
                    .findIndex((p, idx) => idx !== currentPickingIndex && p.avatarId === av.id);
                  const isTakenByOther = takenByPlayerIndex !== -1;

                  return (
                    <div
                      key={av.id}
                      onClick={() => {
                        if (isTakenByOther) {
                          sound.playQuizFail();
                          return;
                        }
                        updatePlayer(currentPickingIndex, 'avatarId', av.id);
                        sound.playCoin();
                      }}
                      className={`p-3 rounded-2xl border-3 transition-all duration-200 flex flex-col items-center justify-between relative group ${
                        isSelected
                          ? 'bg-amber-100/90 border-amber-500 shadow-lg shadow-amber-500/20 scale-[1.02] ring-2 ring-amber-400 cursor-default'
                          : isTakenByOther
                          ? 'bg-stone-200/60 border-stone-300 opacity-50 grayscale cursor-not-allowed'
                          : 'bg-[#FFFDF5] border-amber-300 hover:border-amber-400 hover:bg-amber-50/80 cursor-pointer shadow-xs'
                      }`}
                    >
                      {/* Locked / Taken indicator badge */}
                      {isTakenByOther && (
                        <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-rose-100 border border-rose-300 text-rose-900 text-[9px] font-black flex items-center gap-0.5 shadow-xs">
                          🔒 P{takenByPlayerIndex + 1}
                        </span>
                      )}

                      {/* Character Image */}
                      <div className="h-24 md:h-28 flex items-center justify-center p-1 relative my-0.5">
                        <img
                          src={av.customPng}
                          alt={av.name}
                          className={`max-h-full w-auto object-contain transition-transform duration-200 ${
                            isSelected
                              ? 'scale-105 drop-shadow-[0_6px_10px_rgba(245,158,11,0.4)]'
                              : isTakenByOther
                              ? 'drop-shadow-none'
                              : 'group-hover:scale-105 drop-shadow-[0_3px_5px_rgba(0,0,0,0.15)]'
                          }`}
                        />
                      </div>

                      {/* Info & Select Button */}
                      <div className="w-full text-center mt-0.5">
                        <h4 className="font-extrabold text-xs text-amber-950">
                          {av.name}
                        </h4>
                        <p className="text-[9px] text-amber-800 font-bold truncate">
                          {av.badge}
                        </p>
                        <div
                          className={`mt-1.5 py-0.5 px-2 rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors ${
                            isSelected
                              ? 'bg-amber-500 text-stone-950'
                              : isTakenByOther
                              ? 'bg-stone-200 text-stone-500'
                              : 'bg-amber-200 text-amber-900 group-hover:bg-amber-500 group-hover:text-stone-950'
                          }`}
                        >
                          {isSelected
                            ? '✓ Terpilih'
                            : isTakenByOther
                            ? `Dipakai P${takenByPlayerIndex + 1}`
                            : 'Pilih Pion Ini'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between gap-4 pt-2 border-t border-amber-300">
              <button
                onClick={handlePrevPlayer}
                className="gui-btn gui-btn-gold py-2 px-4 text-xs font-bold text-amber-950"
              >
                ← {currentPickingIndex === 0 ? 'Kembali ke Mode' : `Player ${currentPickingIndex}`}
              </button>

              <button
                onClick={handleNextPlayer}
                className="gui-btn gui-btn-green py-2 px-5 text-xs md:text-sm text-white font-black flex items-center gap-1.5"
              >
                <span>
                  {currentPickingIndex < playerCount - 1
                    ? `Lanjut ke Player ${currentPickingIndex + 2} ➔`
                    : 'Selesai & Ringkasan ➔'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: SIAP MAIN (READY TO PLAY) ================= */}
        {step === 'ready' && (
          <div className="space-y-4 md:space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              {players.slice(0, playerCount).map((p, idx) => {
                const av = AVATARS.find((a) => a.id === p.avatarId) || AVATARS[0];

                return (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-[#FFFDF5] border-3 transition-all flex flex-col items-center justify-between shadow-xs"
                    style={{ borderColor: p.color }}
                  >
                    <div className="flex items-center justify-between w-full mb-0.5">
                      <span className="text-[9px] font-mono font-black text-amber-950">
                        PLAYER {idx + 1}
                      </span>
                      <span className="text-[8px] px-1 py-0.5 rounded bg-amber-400 text-stone-950 font-bold">
                        {p.isAI ? '🤖 AI' : '👤 Siswa'}
                      </span>
                    </div>

                    <div className="h-24 md:h-28 flex items-center justify-center my-0.5">
                      <img
                        src={av.customPng}
                        alt={p.name}
                        className="max-h-full w-auto object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.2)]"
                      />
                    </div>

                    <div className="w-full text-center">
                      <h4 className="font-extrabold text-xs text-stone-900 truncate">
                        {p.name}
                      </h4>
                      <span className="text-[9px] text-amber-800 font-bold block truncate">
                        {av.name} ({av.badge})
                      </span>
                      <span className="text-[10px] font-mono text-emerald-700 font-black mt-0.5 block">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(startingBalance)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Action bar */}
            <div className="flex items-center justify-between px-1 text-[11px] text-amber-900 font-bold">
              <span>Pastikan setiap pemain sudah siap di posisinya.</span>
              <button
                onClick={() => setStep('avatars')}
                className="text-amber-800 hover:text-amber-900 underline font-extrabold text-[11px] cursor-pointer flex items-center gap-1"
              >
                <span>Ubah Avatar / Nama Peserta ↺</span>
              </button>
            </div>

            {/* Big Launch Game Button */}
            <button
              onClick={handleLaunchGame}
              className="gui-btn gui-btn-green w-full py-3.5 px-6 text-sm md:text-base text-white font-black tracking-wide flex items-center justify-center gap-2 shadow-xl my-1"
            >
              <span>MULAI PERMAINAN MONOPOLI NUSANTARA ({playerCount} PEMAIN)</span>
              <span className="text-xl">➔</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
