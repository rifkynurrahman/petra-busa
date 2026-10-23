import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  AvatarId,
  TileData,
  TileState,
  Landmark,
  AlbumCard,
  CulturalMission,
  Player,
  KesempatanCard,
  TantanganCard,
} from './types/game';
import { BOARD_TILES } from './data/monopolyBoard';
import { KESEMPATAN_CARDS, TANTANGAN_CARDS } from './data/cards';
import { INITIAL_LANDMARKS, ALBUM_CARDS, INITIAL_MISSIONS } from './data/monopolyGoData';
import { AVATARS } from './data/avatars';
import { sound } from './utils/audio';

import { MainMenuScreen } from './components/MainMenuScreen';
import { SetupScreen } from './components/SetupScreen';
import { MonopolyGoBoard } from './components/MonopolyGoBoard';
import { BuildLandmarkModal } from './components/BuildLandmarkModal';
import { HeistMiniGameModal } from './components/HeistMiniGameModal';
import { AlbumModal } from './components/AlbumModal';
import { MissionsModal } from './components/MissionsModal';
import { CardModal } from './components/CardModal';
import { QuizModal } from './components/QuizModal';
import { HouseDetailModal } from './components/HouseDetailModal';
import { BuyHouseModal } from './components/BuyHouseModal';
import { RentPayModal } from './components/RentPayModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { Pawn3D } from './components/Pawn3D';
import { AvatarSvg } from './components/AvatarSvg';

export default function App() {
  // Navigation Screen State: 'mainMenu' -> 'setup' -> 'game'
  const [screen, setScreen] = useState<'mainMenu' | 'setup' | 'game'>('mainMenu');

  // Players State (2 to 4 Players for Local Turn-based Play)
  const [players, setPlayers] = useState<Player[]>([]);
  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0);

  // Game Multiplier & Auto-Roll
  const [multiplier, setMultiplier] = useState<number>(1);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [isAutoRoll, setIsAutoRoll] = useState<boolean>(false);

  // 3D Dice Throw Animation State
  const [diceResult, setDiceResult] = useState<{ d1: number; d2: number } | null>(null);
  const [showDiceAnimation, setShowDiceAnimation] = useState<boolean>(false);

  // Board & Landmarks State
  const [tileStates, setTileStates] = useState<Record<number, TileState>>({});
  const [landmarks, setLandmarks] = useState<Landmark[]>(INITIAL_LANDMARKS);
  const [albumCards, setAlbumCards] = useState<AlbumCard[]>(ALBUM_CARDS);
  const [missions, setMissions] = useState<CulturalMission[]>(INITIAL_MISSIONS);

  // Top Event Bar Progress
  const [eventProgress, setEventProgress] = useState<number>(0);
  const eventTarget = 10;

  // View Mode & Scaling: Clean Flat 2D Plan View
  const [isIsometric, setIsIsometric] = useState<boolean>(false);
  const [boardScale, setBoardScale] = useState<number>(1.0);

  // Background Theme & Collapsible Header Navigation
  const [bgTheme, setBgTheme] = useState<'valley' | 'autumn' | 'violet'>('valley');
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState<boolean>(false);
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);

  // Responsive Viewport Engine for Mobile Optimization
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const isMobile = viewport.width < 768;
  const isLandscape = viewport.width > viewport.height;
  const isCompactLandscape = isLandscape && viewport.height <= 520;
  const isCompactPortrait = !isLandscape && isMobile;

  // Modals
  const [activeModal, setActiveModal] = useState<
    'build' | 'heist' | 'album' | 'missions' | 'kesempatan' | 'tantangan' | 'tileDetail' | 'buyHouse' | 'rentPay' | 'leaderboard' | null
  >(null);

  const [activeKesempatan, setActiveKesempatan] = useState<KesempatanCard | null>(null);
  const [activeTantangan, setActiveTantangan] = useState<TantanganCard | null>(null);
  const [inspectedTile, setInspectedTile] = useState<TileData | null>(null);
  const [isLandedAction, setIsLandedAction] = useState<boolean>(false);
  const [targetBuyTile, setTargetBuyTile] = useState<TileData | null>(null);
  const [rentPaymentInfo, setRentPaymentInfo] = useState<{
    tile: TileData;
    tileState: TileState;
    visitor: Player;
    owner: Player;
    rentAmount: number;
  } | null>(null);

  // Audio & Message Banner
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [musicPlaying, setMusicPlaying] = useState<boolean>(sound.getMusicEnabled());
  const [musicVolume, setMusicVolume] = useState<number>(sound.getMusicVolume());
  const [lastActiveVolume, setLastActiveVolume] = useState<number>(
    sound.getMusicVolume() > 0 ? sound.getMusicVolume() : 0.5
  );
  const [showVolumeSlider, setShowVolumeSlider] = useState<boolean>(false);
  const [bannerMessage, setBannerMessage] = useState<string>('Selamat datang di Monopoli Nusantara!');

  const autoRollRef = useRef<number | null>(null);

  // Initialize board tiles states
  const initBoardStates = () => {
    const states: Record<number, TileState> = {};
    BOARD_TILES.forEach((t) => {
      states[t.id] = { owner: null, houses: 0, mortgaged: false };
    });
    setTileStates(states);
  };

  // Launch Game from SetupScreen
  const handleStartGame = (configuredPlayers: Player[], startingBalance: number = 50000000) => {
    const playersWithBalance = configuredPlayers.map((p) => ({ ...p, balance: startingBalance }));
    setPlayers(playersWithBalance);
    setActivePlayerIndex(0);
    setEventProgress(0);
    initBoardStates();
    setScreen('game');
    setBannerMessage(`Giliran ${playersWithBalance[0].name} • Silakan lempar dadu`);
    sound.playGamelanChime();
  };

  // Format currency
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatCompactCash = (num: number) => {
    if (num >= 1000000000) return `Rp ${(num / 1000000000).toFixed(1)} Miliar`;
    if (num >= 1000000) return `Rp ${(num / 1000000).toFixed(0)} Juta`;
    if (num >= 1000) return `Rp ${(num / 1000).toFixed(0)} Rb`;
    return `Rp ${num}`;
  };

  // Multiplier Cycler: 1 -> 2 -> 3 -> 5 -> 10 -> 1
  const cycleMultiplier = () => {
    const list = [1, 2, 3, 5, 10];
    const nextIdx = (list.indexOf(multiplier) + 1) % list.length;
    setMultiplier(list[nextIdx]);
  };

  // Next Turn Handler
  const endTurn = useCallback(() => {
    setPlayers((currentPlayers) => {
      if (currentPlayers.length === 0) return currentPlayers;
      let nextIndex = (activePlayerIndex + 1) % currentPlayers.length;
      let attempts = 0;
      while (currentPlayers[nextIndex].isBankrupt && attempts < currentPlayers.length) {
        nextIndex = (nextIndex + 1) % currentPlayers.length;
        attempts++;
      }

      setActivePlayerIndex(nextIndex);
      setBannerMessage(`Giliran ${currentPlayers[nextIndex].name} • Silakan lempar dadu`);
      return currentPlayers;
    });
  }, [activePlayerIndex]);

  // Handle Arrival on Tile
  const handleArrival = useCallback(
    (tileId: number) => {
      const tile = BOARD_TILES[tileId];
      const activeP = players[activePlayerIndex];
      if (!activeP) return;

      // 1. GO / MULAI
      if (tileId === 0) {
        sound.playGamelanChime();
        const bonus = 20000000 * multiplier;
        setPlayers((prev) =>
          prev.map((p, idx) =>
            idx === activePlayerIndex
              ? {
                  ...p,
                  balance: p.balance + bonus,
                  diceEnergy: Math.min(200, (p.diceEnergy || 100) + 20),
                }
              : p
          )
        );
        setBannerMessage(`${activeP.name} mendarat di Titik Nol Mulai! +${formatRupiah(bonus)} & +20 🎲`);
        setTimeout(endTurn, 1500);
        return;
      }

      // 2. KESEMPATAN
      if (tile.type === 'kesempatan') {
        const card = KESEMPATAN_CARDS[Math.floor(Math.random() * KESEMPATAN_CARDS.length)];
        setActiveKesempatan(card);
        setActiveModal('kesempatan');
        return;
      }

      // 3. TANTANGAN KUIS
      if (tile.type === 'tantangan') {
        const quiz = TANTANGAN_CARDS[Math.floor(Math.random() * TANTANGAN_CARDS.length)];
        setActiveTantangan(quiz);
        setActiveModal('tantangan');
        return;
      }

      // 4. STASIUN / BANDARA -> BANK HEIST
      if (tile.type === 'stasiun') {
        sound.playGamelanChime();
        setActiveModal('heist');
        return;
      }

      // 5. MASUK PENJARA
      if (tile.type === 'masuk_penjara') {
        sound.playQuizFail();
        setPlayers((prev) =>
          prev.map((p, idx) =>
            idx === activePlayerIndex
              ? { ...p, position: 6, inJail: true, jailTurns: 3 }
              : p
          )
        );
        setBannerMessage(`${activeP.name} melanggar norma adat! Terdampar di Pulau Terasing.`);
        setTimeout(endTurn, 1600);
        return;
      }

      // 6. PROPERTY / RUMAH ADAT
      if (tile.type === 'property') {
        const state = tileStates[tileId];

        // Case A: UNOWNED PROPERTY -> Buy land & build houses!
        if (!state || state.owner === null || state.owner === undefined) {
          if (!activeP.isAI) {
            setTargetBuyTile(tile);
            setActiveModal('buyHouse');
            sound.playGamelanChime();
            return;
          } else {
            // AI Automatic purchase
            const basePrice = tile.price || 15000000;
            const houseCost = tile.houseCost || Math.floor(basePrice * 0.5);
            let targetLevel = 1;
            let cost = basePrice;
            if (activeP.balance >= basePrice + houseCost * 2) {
              targetLevel = 3;
              cost = basePrice + houseCost * 2;
            } else if (activeP.balance >= basePrice + houseCost) {
              targetLevel = 2;
              cost = basePrice + houseCost;
            }

            if (activeP.balance >= cost) {
              setPlayers((prev) =>
                prev.map((p, idx) =>
                  idx === activePlayerIndex
                    ? {
                        ...p,
                        balance: p.balance - cost,
                        propertiesOwned: p.propertiesOwned.includes(tileId)
                          ? p.propertiesOwned
                          : [...p.propertiesOwned, tileId],
                      }
                    : p
                )
              );
              setTileStates((prev) => ({
                ...prev,
                [tileId]: { owner: activePlayerIndex, houses: targetLevel, mortgaged: false },
              }));
              sound.playCoin();
              setBannerMessage(`${activeP.name} (AI) membeli tanah & membangun ${tile.houseName} Tingkat ${targetLevel}!`);
            }
            setTimeout(endTurn, 1400);
            return;
          }
        }

        // Case B: OWNED BY CURRENT PLAYER -> Upgrade houses if < 4!
        if (state.owner === activePlayerIndex) {
          if (state.houses < 4) {
            if (!activeP.isAI) {
              setTargetBuyTile(tile);
              setActiveModal('buyHouse');
              return;
            } else {
              // AI Upgrade if wealthy
              const houseCost = tile.houseCost || 7500000;
              if (activeP.balance >= houseCost * 2) {
                setPlayers((prev) =>
                  prev.map((p, idx) =>
                    idx === activePlayerIndex
                      ? { ...p, balance: p.balance - houseCost }
                      : p
                  )
                );
                setTileStates((prev) => ({
                  ...prev,
                  [tileId]: { ...prev[tileId], houses: Math.min(4, prev[tileId].houses + 1) },
                }));
                sound.playCoin();
                setBannerMessage(`${activeP.name} (AI) meningkatkan Rumah Adat di ${tile.shortName}!`);
              }
              setTimeout(endTurn, 1400);
              return;
            }
          } else {
            setBannerMessage(`${activeP.name} mampir di Landmark megah milik sendiri di ${tile.shortName}!`);
            setTimeout(endTurn, 1200);
            return;
          }
        }

        // Case C: OWNED BY ANOTHER PLAYER -> Pay Rent & Offer Takeover!
        if (state.owner !== activePlayerIndex) {
          const owner = players[state.owner];
          const houseIdx = Math.max(0, (state.houses || 1) - 1);
          const rent = (tile.houseRent?.[houseIdx] || tile.baseRent || 2000000) * multiplier;
          sound.playCoin();

          setPlayers((prev) =>
            prev.map((p, idx) => {
              if (idx === activePlayerIndex) {
                const newBal = p.balance - rent;
                return { ...p, balance: newBal, isBankrupt: newBal < 0 };
              }
              if (idx === state.owner) {
                return { ...p, balance: p.balance + rent };
              }
              return p;
            })
          );

          // Show RentPayModal for human players
          if (!activeP.isAI && !activeP.isBankrupt) {
            setRentPaymentInfo({
              tile,
              tileState: state,
              visitor: activeP,
              owner,
              rentAmount: rent,
            });
            setActiveModal('rentPay');
            return;
          } else {
            setBannerMessage(`${activeP.name} membayar sewa ${formatRupiah(rent)} ke ${owner?.name || 'pemilik'}`);
            setTimeout(endTurn, 1600);
            return;
          }
        }

        setTimeout(endTurn, 1200);
      } else {
        setTimeout(endTurn, 1200);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [players, activePlayerIndex, multiplier, tileStates, endTurn]
  );

  // Confirm purchase from BuyHouseModal
  const handleConfirmPurchase = useCallback(
    (tileId: number, targetHouseLevel: number, totalCost: number) => {
      sound.playCoin();
      sound.playGamelanChime();

      setPlayers((prev) =>
        prev.map((p, idx) =>
          idx === activePlayerIndex
            ? {
                ...p,
                balance: p.balance - totalCost,
                propertiesOwned: p.propertiesOwned.includes(tileId)
                  ? p.propertiesOwned
                  : [...p.propertiesOwned, tileId],
              }
            : p
        )
      );

      setTileStates((prev) => ({
        ...prev,
        [tileId]: {
          owner: activePlayerIndex,
          houses: targetHouseLevel,
          mortgaged: false,
        },
      }));

      const tile = BOARD_TILES[tileId];
      setBannerMessage(`Selamat! ${players[activePlayerIndex].name} berhasil membangun ${tile.houseName} Tingkat ${targetHouseLevel}!`);
      setActiveModal(null);
      setTargetBuyTile(null);
      setTimeout(endTurn, 1000);
    },
    [activePlayerIndex, players, endTurn]
  );

  // Takeover handler from RentPayModal
  const handleTakeoverProperty = useCallback(
    (cost: number) => {
      if (!rentPaymentInfo) return;
      const { tile, owner } = rentPaymentInfo;
      const oldOwnerIndex = owner.id;

      sound.playGamelanChime();
      setPlayers((prev) =>
        prev.map((p, idx) => {
          if (idx === activePlayerIndex) {
            return {
              ...p,
              balance: p.balance - cost,
              propertiesOwned: p.propertiesOwned.includes(tile.id)
                ? p.propertiesOwned
                : [...p.propertiesOwned, tile.id],
            };
          }
          if (idx === oldOwnerIndex) {
            return {
              ...p,
              balance: p.balance + cost,
              propertiesOwned: p.propertiesOwned.filter((id) => id !== tile.id),
            };
          }
          return p;
        })
      );

      setTileStates((prev) => ({
        ...prev,
        [tile.id]: {
          ...prev[tile.id],
          owner: activePlayerIndex,
        },
      }));

      setBannerMessage(`⚡ AKUISISI BERHASIL! ${players[activePlayerIndex].name} mengambil alih ${tile.name}!`);
      setActiveModal(null);
      setRentPaymentInfo(null);
    },
    [rentPaymentInfo, activePlayerIndex, players, endTurn]
  );

  // Roll Action with 3D Dice Throw Animation
  const handleRoll = useCallback(() => {
    if (isRolling || players.length === 0 || showDiceAnimation) return;

    const activeP = players[activePlayerIndex];
    if (!activeP) return;

    const currentDice = activeP.diceEnergy || 100;
    if (currentDice < multiplier) {
      sound.playQuizFail();
      setBannerMessage(`Dadu energi ${activeP.name} tidak cukup!`);
      setIsAutoRoll(false);
      return;
    }

    // Deduct dice stamina for active player
    setPlayers((prev) =>
      prev.map((p, idx) =>
        idx === activePlayerIndex
          ? { ...p, diceEnergy: (p.diceEnergy || 100) - multiplier }
          : p
      )
    );

    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    setDiceResult({ d1, d2 });
    setShowDiceAnimation(true);
    setIsRolling(true);

    // Advance event progress
    setEventProgress((prev) => {
      const next = prev + 1;
      if (next >= eventTarget) {
        sound.playQuizSuccess();
        const festivalBonus = 10000000 * multiplier;
        setPlayers((pList) =>
          pList.map((p, idx) =>
            idx === activePlayerIndex
              ? {
                  ...p,
                  balance: p.balance + festivalBonus,
                  diceEnergy: Math.min(200, (p.diceEnergy || 100) + 20),
                }
              : p
          )
        );
        setBannerMessage(`🎉 Festival Budaya Tercapai! ${activeP.name} dapat +20 🎲 & +${formatRupiah(festivalBonus)}!`);
        return 0;
      }
      return next;
    });
  }, [isRolling, players, activePlayerIndex, multiplier, showDiceAnimation]);

  // Once 3D Dice Animation completes tumbling, start moving the pawn!
  const handleDiceAnimationComplete = useCallback(() => {
    setShowDiceAnimation(false);
    if (!diceResult) {
      setIsRolling(false);
      return;
    }

    const activeP = players[activePlayerIndex];
    const isDoubles = diceResult.d1 === diceResult.d2;

    // RULE: If player is trapped in Pulau Terasing / Penjara, MUST GET DOUBLES to move!
    if (activeP && activeP.inJail) {
      if (isDoubles) {
        // DOUBLES OBTAINED -> FREED FROM PULAU TERASING!
        sound.playGamelanChime();
        sound.playCoin();
        setPlayers((prev) =>
          prev.map((p, idx) =>
            idx === activePlayerIndex
              ? { ...p, inJail: false, jailTurns: 0 }
              : p
          )
        );
        setBannerMessage(`🎲 DADU KEMBAR (${diceResult.d1}-${diceResult.d2})! ${activeP.name} berhasil bebas dari Pulau Terasing & melangkah!`);
      } else {
        // NOT DOUBLES -> CANNOT MOVE THIS TURN
        sound.playQuizFail();
        const remainingTurns = Math.max(0, (activeP.jailTurns || 3) - 1);

        if (remainingTurns > 0) {
          setPlayers((prev) =>
            prev.map((p, idx) =>
              idx === activePlayerIndex
                ? { ...p, jailTurns: remainingTurns }
                : p
            )
          );
          setBannerMessage(`🔒 Dadu ${diceResult.d1}-${diceResult.d2} (Bukan Kembar). ${activeP.name} masih tertahan di Pulau Terasing! (Sisa ${remainingTurns}x coba)`);
        } else {
          // 3rd failed attempt -> Pay bail fine Rp 5.000.000 & freed for next turn
          const bailFine = 5000000;
          setPlayers((prev) =>
            prev.map((p, idx) =>
              idx === activePlayerIndex
                ? {
                    ...p,
                    inJail: false,
                    jailTurns: 0,
                    balance: Math.max(0, p.balance - bailFine),
                  }
                : p
            )
          );
          setBannerMessage(`🏛️ Sanksi Selesai! ${activeP.name} membayar denda bebas Rp 5.000.000 & siap melangkah di giliran berikutnya.`);
        }

        setIsRolling(false);
        setTimeout(endTurn, 1600);
        return;
      }
    }

    const totalSteps = diceResult.d1 + diceResult.d2;

    // Step-by-step movement
    let currentStep = 0;
    const stepInterval = setInterval(() => {
      currentStep++;
      sound.playPawnStep();

      setPlayers((prev) =>
        prev.map((p, idx) => {
          if (idx !== activePlayerIndex) return p;
          const nextPos = (p.position + 1) % BOARD_TILES.length;
          let newBal = p.balance;
          if (nextPos === 0 && currentStep <= totalSteps) {
            newBal += 20000000 * multiplier;
            sound.playGamelanChime();
          }
          return { ...p, position: nextPos, balance: newBal };
        })
      );

      if (currentStep >= totalSteps) {
        clearInterval(stepInterval);
        setIsRolling(false);
        setTimeout(() => {
          setPlayers((latest) => {
            handleArrival(latest[activePlayerIndex].position);
            return latest;
          });
        }, 220);
      }
    }, 110);
  }, [diceResult, activePlayerIndex, multiplier, handleArrival, players, endTurn]);

  // Handle AI Player Automatic Turn
  useEffect(() => {
    if (screen !== 'game') return;
    const currentP = players[activePlayerIndex];
    if (currentP && currentP.isAI && !isRolling && activeModal === null) {
      const timer = setTimeout(() => {
        handleRoll();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [screen, players, activePlayerIndex, isRolling, activeModal, handleRoll]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Space', 'Enter'].includes(e.code) && !activeModal && screen === 'game') {
        e.preventDefault();
        handleRoll();
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        const m = sound.toggleMute();
        setIsMuted(m);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, handleRoll, activeModal]);

  // Upgrade Landmark Handler
  const handleUpgradeLandmark = (landmarkId: string) => {
    const activeP = players[activePlayerIndex];
    if (!activeP) return;

    setLandmarks((prev) =>
      prev.map((lm) => {
        if (lm.id === landmarkId) {
          const cost = Math.round(lm.baseCost * Math.pow(lm.multiplier, lm.level));
          setPlayers((pList) =>
            pList.map((p, idx) =>
              idx === activePlayerIndex
                ? {
                    ...p,
                    balance: p.balance - cost,
                    netWorth: (p.netWorth || 0) + 35,
                  }
                : p
            )
          );
          return {
            ...lm,
            level: Math.min(lm.maxLevel, lm.level + 1),
          };
        }
        return lm;
      })
    );
  };

  // Heist Reward Handler
  const handleHeistComplete = (rewardCash: number) => {
    setActiveModal(null);
    const activeP = players[activePlayerIndex];
    if (!activeP) return;

    setPlayers((prev) =>
      prev.map((p, idx) =>
        idx === activePlayerIndex
          ? { ...p, balance: p.balance + rewardCash * multiplier }
          : p
      )
    );
    setBannerMessage(`🎉 Gerebek Sukses! ${activeP.name} dapat +${formatRupiah(rewardCash * multiplier)}`);
    setTimeout(endTurn, 1000);
  };

  // Quiz Modal Complete
  const handleQuizComplete = (isCorrect: boolean) => {
    if (!activeTantangan) return;
    const quiz = activeTantangan;
    const activeP = players[activePlayerIndex];
    setActiveTantangan(null);
    setActiveModal(null);

    if (activeP) {
      if (isCorrect) {
        sound.playCoin();
        setPlayers((prev) =>
          prev.map((p, idx) =>
            idx === activePlayerIndex
              ? {
                  ...p,
                  balance: p.balance + quiz.rewardCash * multiplier,
                  diceEnergy: Math.min(200, (p.diceEnergy || 100) + quiz.rewardDice),
                }
              : p
          )
        );
        setBannerMessage(`🎉 Jawaban Benar! ${activeP.name} dapat +${formatRupiah(quiz.rewardCash * multiplier)} & +${quiz.rewardDice} 🎲`);
      } else {
        sound.playQuizFail();
        const penaltyAmount = (quiz.penalty || 5000000) * multiplier;
        setPlayers((prev) =>
          prev.map((p, idx) => {
            if (idx !== activePlayerIndex) return p;
            const newBal = p.balance - penaltyAmount;
            return { ...p, balance: newBal, isBankrupt: newBal < 0 };
          })
        );
        setBannerMessage(`❌ Jawaban Kurang Tepat! ${activeP.name} kena denda ${formatRupiah(penaltyAmount)}`);
      }
    }

    setTimeout(endTurn, 1000);
  };

  // Kesempatan Modal Close
  const handleKesempatanClose = () => {
    if (!activeKesempatan) return;
    const card = activeKesempatan;
    setActiveKesempatan(null);
    setActiveModal(null);

    const activeP = players[activePlayerIndex];
    if (activeP) {
      if (card.effect === 'money_gain' && card.amount) {
        sound.playCoin();
        setPlayers((prev) =>
          prev.map((p, idx) =>
            idx === activePlayerIndex
              ? { ...p, balance: p.balance + card.amount! * multiplier }
              : p
          )
        );
        setBannerMessage(`🎉 Rezeki Adat! ${activeP.name} memperoleh +${formatRupiah(card.amount! * multiplier)}`);
      } else if (card.effect === 'money_loss' && card.amount) {
        sound.playQuizFail();
        const denda = card.amount! * multiplier;
        setPlayers((prev) =>
          prev.map((p, idx) => {
            if (idx !== activePlayerIndex) return p;
            const newBal = p.balance - denda;
            return { ...p, balance: newBal, isBankrupt: newBal < 0 };
          })
        );
        setBannerMessage(`💸 Denda/Sanksi Adat! ${activeP.name} membayar ${formatRupiah(denda)}`);
      } else if (card.effect === 'all_players_pay' && card.amount) {
        sound.playGamelanChime();
        const amountPerPlayer = card.amount! * multiplier;
        setPlayers((prev) => {
          let totalCollected = 0;
          return prev.map((p, idx) => {
            if (idx !== activePlayerIndex && !p.isBankrupt) {
              totalCollected += amountPerPlayer;
              return { ...p, balance: p.balance - amountPerPlayer };
            }
            return p;
          }).map((p, idx) =>
            idx === activePlayerIndex ? { ...p, balance: p.balance + totalCollected } : p
          );
        });
        setBannerMessage(`🎉 Pesta Rakyat! ${activeP.name} mengumpulkan dana dari seluruh pemain!`);
      } else if (card.effect === 'go_to_jail') {
        sound.playQuizFail();
        setPlayers((prev) =>
          prev.map((p, idx) =>
            idx === activePlayerIndex
              ? { ...p, position: 6, inJail: true, jailTurns: 3 }
              : p
          )
        );
        setBannerMessage(`🚨 ${activeP.name} melanggar larangan adat! Dikirim ke Penjara Adat.`);
      } else if (card.effect === 'move_to' && card.destinationTileId !== undefined) {
        setPlayers((prev) =>
          prev.map((p, idx) =>
            idx === activePlayerIndex
              ? { ...p, position: card.destinationTileId! }
              : p
          )
        );
        handleArrival(card.destinationTileId!);
        return;
      }
    }

    setTimeout(endTurn, 1000);
  };

  // SCREEN ROUTING: 1. Main Menu -> 2. Setup Screen -> 3. Monopoly Game
  if (screen === 'mainMenu') {
    return (
      <MainMenuScreen
        onPlay={() => setScreen('setup')}
        bgTheme={bgTheme}
        setBgTheme={setBgTheme}
        isIsometric={isIsometric}
        setIsIsometric={setIsIsometric}
      />
    );
  }

  if (screen === 'setup') {
    return (
      <SetupScreen
        onStartGame={handleStartGame}
        onBack={() => setScreen('mainMenu')}
      />
    );
  }

  const activePlayer = players[activePlayerIndex] || players[0];
  const currentAvatarInfo = AVATARS.find((a) => a.id === activePlayer.avatarId) || AVATARS[0];

  const optimalBoardSize = (() => {
    if (isCompactLandscape) {
      // Landscape mobile (e.g. 844x390 or 915x412):
      const availH = viewport.height - 14;
      const availW = viewport.width - 240;
      return Math.max(260, Math.floor(Math.min(availH, availW, 520)));
    }
    if (isCompactPortrait) {
      // Portrait mobile (e.g. 390x844):
      const availW = viewport.width - 12;
      const availH = viewport.height - 126;
      return Math.max(280, Math.floor(Math.min(availW, availH, 500)));
    }
    if (viewport.width < 1024) {
      // Tablet:
      const availW = viewport.width - 240;
      const availH = viewport.height - (isHeaderCollapsed ? 40 : 100);
      return Math.max(380, Math.floor(Math.min(availW, availH, 680)));
    }
    // Desktop:
    const availW = viewport.width - 540;
    const availH = viewport.height - (isHeaderCollapsed ? 40 : 110);
    return Math.max(480, Math.floor(Math.min(availW, availH, 800)));
  })();

  return (
    <div className="relative w-screen h-screen text-stone-100 flex flex-col justify-between overflow-hidden select-none font-sans">
      {/* Looping Background Video */}
      <video
        src="/assets/aistudio/bganimasi.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
      />
      {/* Ambient Contrast Overlay */}
      <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />
      
      {/* 1. TOP HEADER BAR: Collapsible Streamlined Navigation Bar (Desktop & Tablet) */}
      <div className="hidden md:block relative z-40 shrink-0 w-full">
        <header
          className={`px-3 md:px-5 bg-[#18110a]/95 backdrop-blur-md border-b-4 border-[#b45309] shadow-2xl flex items-center justify-between gap-2 md:gap-3 transition-all duration-300 ease-in-out ${
            isHeaderCollapsed
              ? 'h-0 py-0 overflow-hidden opacity-0 border-b-0 pointer-events-none'
              : 'h-14 md:h-16 py-1 opacity-100'
          }`}
        >
          {/* Left spacing */}
          <div className="shrink-0" />

          {/* Right Controls: Background Switcher, Peringkat, Menu Awal, Zoom, Sound, Collapse */}
          <div className="flex items-center gap-1.5 md:gap-2 overflow-x-auto py-0.5">
            {/* Feature Peringkat / Leaderboard Button */}
            <button
              onClick={() => setActiveModal('leaderboard')}
              title="Lihat Peringkat & Kekayaan Pemain"
              className="gui-btn gui-btn-gold px-3 py-1.5 text-xs font-black flex items-center gap-1 shadow-md shrink-0"
            >
              <span className="text-sm">🏆</span>
              <span className="hidden sm:inline">Peringkat</span>
            </button>



            {/* Back to Setup / Main Menu Button */}
            <button
              onClick={() => setScreen('mainMenu')}
              title="Kembali ke Menu Utama"
              className="gui-btn gui-btn-gold px-3 py-1.5 text-xs font-black flex items-center gap-1 shrink-0"
            >
              <span>🏠</span>
              <span className="hidden sm:inline">Menu</span>
            </button>

            {/* Board Zoom Level Controls */}
            <div className="flex items-center gap-1 bg-[#150e08]/90 p-1 rounded-2xl border-2 border-amber-500/70 shadow-md shrink-0">
              <button
                onClick={() => setBoardScale((prev) => Math.min(1.4, Math.round((prev + 0.1) * 10) / 10))}
                title="Perbesar Ukuran Papan Monopoli"
                className="gui-btn gui-btn-gold px-2.5 py-1 text-xs font-black"
              >
                ➕
              </button>
              <span className="text-[11px] font-mono font-black px-1.5 text-amber-200 min-w-[36px] text-center">
                {Math.round(boardScale * 100)}%
              </span>
              <button
                onClick={() => setBoardScale((prev) => Math.max(0.8, Math.round((prev - 0.1) * 10) / 10))}
                title="Perkecil Ukuran Papan Monopoli"
                className="gui-btn gui-btn-blue px-2.5 py-1 text-xs font-black"
              >
                ➖
              </button>
            </div>

            {/* Music & Volume Controls (Bisa dikecilkan, dibesarkan, & di-mute) */}
            <div className="relative flex items-center gap-1 bg-[#150e08]/90 p-1 rounded-2xl border-2 border-amber-500/70 shadow-md shrink-0">
              {/* Quick Mute / Unmute Button */}
              <button
                onClick={() => {
                  if (musicVolume > 0) {
                    sound.setMusicVolume(0);
                    setMusicVolume(0);
                    setMusicPlaying(false);
                  } else {
                    const restored = lastActiveVolume > 0 ? lastActiveVolume : 0.5;
                    sound.setMusicVolume(restored);
                    setMusicVolume(restored);
                    setMusicPlaying(true);
                  }
                }}
                title={musicVolume === 0 ? 'Nyalakan Musik (Unmute)' : 'Matikan Musik (Mute)'}
                className={`gui-btn ${musicVolume === 0 ? 'gui-btn-blue opacity-75' : 'gui-btn-gold'} w-7 h-7 text-xs flex items-center justify-center shrink-0`}
              >
                {musicVolume === 0 ? '🔇' : musicVolume < 0.4 ? '🔉' : '🎵'}
              </button>

              {/* Volume Down Button (Kecilkan Volume) */}
              <button
                onClick={() => {
                  const nextVol = Math.max(0, Math.round((musicVolume - 0.1) * 10) / 10);
                  sound.setMusicVolume(nextVol);
                  setMusicVolume(nextVol);
                  setMusicPlaying(nextVol > 0);
                  if (nextVol > 0) setLastActiveVolume(nextVol);
                }}
                disabled={musicVolume <= 0}
                title="Kecilkan Volume Musik (-10%)"
                className="gui-btn gui-btn-blue px-2 py-1 text-xs font-black disabled:opacity-40"
              >
                ➖
              </button>

              {/* Volume Display & Slider Trigger */}
              <button
                onClick={() => setShowVolumeSlider((prev) => !prev)}
                title="Klik untuk membuka penggeser volume"
                className="text-[11px] font-mono font-black px-1 text-amber-200 min-w-[34px] text-center hover:text-amber-300 transition-colors cursor-pointer"
              >
                {Math.round(musicVolume * 100)}%
              </button>

              {/* Volume Up Button (Besarkan Volume) */}
              <button
                onClick={() => {
                  const nextVol = Math.min(1.0, Math.round((musicVolume + 0.1) * 10) / 10);
                  sound.setMusicVolume(nextVol);
                  setMusicVolume(nextVol);
                  setMusicPlaying(true);
                  setLastActiveVolume(nextVol);
                }}
                disabled={musicVolume >= 1.0}
                title="Besarkan Volume Musik (+10%)"
                className="gui-btn gui-btn-gold px-2 py-1 text-xs font-black disabled:opacity-40"
              >
                ➕
              </button>

              {/* Popover Slider untuk fine-tuning volume */}
              {showVolumeSlider && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowVolumeSlider(false)}
                  />
                  <div
                    className="absolute top-full mt-2 right-0 bg-[#150e08]/95 backdrop-blur-md border-2 border-amber-500 rounded-xl p-3 shadow-2xl z-50 flex flex-col gap-2 min-w-[210px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between text-xs text-amber-200 font-bold border-b border-amber-800/60 pb-1.5">
                      <span className="flex items-center gap-1">🎵 Volume Musik</span>
                      <span className="font-mono text-amber-400 font-black text-sm">
                        {Math.round(musicVolume * 100)}%
                      </span>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={Math.round(musicVolume * 100)}
                      onChange={(e) => {
                        const val = Number(e.target.value) / 100;
                        sound.setMusicVolume(val);
                        setMusicVolume(val);
                        setMusicPlaying(val > 0);
                        if (val > 0) setLastActiveVolume(val);
                      }}
                      className="w-full accent-amber-500 cursor-pointer h-2 bg-stone-800 rounded-lg"
                    />

                    <div className="flex justify-between items-center text-[10px] text-amber-200/70 font-semibold pt-1">
                      <button
                        onClick={() => {
                          sound.setMusicVolume(0);
                          setMusicVolume(0);
                          setMusicPlaying(false);
                        }}
                        className="px-1.5 py-0.5 rounded bg-black/40 hover:bg-amber-900/60 hover:text-amber-300"
                      >
                        Mute
                      </button>
                      <button
                        onClick={() => {
                          sound.setMusicVolume(0.3);
                          setMusicVolume(0.3);
                          setMusicPlaying(true);
                          setLastActiveVolume(0.3);
                        }}
                        className="px-1.5 py-0.5 rounded bg-black/40 hover:bg-amber-900/60 hover:text-amber-300"
                      >
                        30%
                      </button>
                      <button
                        onClick={() => {
                          sound.setMusicVolume(0.6);
                          setMusicVolume(0.6);
                          setMusicPlaying(true);
                          setLastActiveVolume(0.6);
                        }}
                        className="px-1.5 py-0.5 rounded bg-black/40 hover:bg-amber-900/60 hover:text-amber-300"
                      >
                        60%
                      </button>
                      <button
                        onClick={() => {
                          sound.setMusicVolume(1.0);
                          setMusicVolume(1.0);
                          setMusicPlaying(true);
                          setLastActiveVolume(1.0);
                        }}
                        className="px-1.5 py-0.5 rounded bg-black/40 hover:bg-amber-900/60 hover:text-amber-300"
                      >
                        100%
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Header Collapse Action Button */}
            <button
              onClick={() => {
                sound.playCoin();
                setIsHeaderCollapsed(true);
              }}
              title="Sembunyikan Bar Navigasi"
              className="gui-btn gui-btn-gold px-2.5 py-1.5 text-xs font-black flex items-center gap-1 shrink-0"
            >
              <span>▲</span>
            </button>
          </div>
        </header>

        {/* Floating Toggle Pull Tab Hanging Below Header */}
        <button
          onClick={() => {
            sound.playCoin();
            setIsHeaderCollapsed((prev) => !prev);
          }}
          title={isHeaderCollapsed ? 'Tampilkan Bar Navigasi' : 'Sembunyikan Bar Navigasi'}
          className={`absolute left-1/2 -translate-x-1/2 transition-all duration-300 z-50 gui-btn-gold px-4 py-1 text-[11px] font-black rounded-b-xl shadow-2xl flex items-center gap-1.5 border-t-0 cursor-pointer ${
            isHeaderCollapsed ? 'top-0' : 'top-14 md:top-16 opacity-80 hover:opacity-100'
          }`}
        >
          <span>{isHeaderCollapsed ? '▼ NAVIGASI' : '▲ SEMBUNYIKAN'}</span>
        </button>
      </div>

      {/* 3. MAIN GAMEPLAY LAYOUT (RESPONSIVE: MOBILE LANDSCAPE | MOBILE PORTRAIT | DESKTOP) */}
      {isCompactLandscape ? (
        /* ================= MOBILE LANDSCAPE GAMEPLAY LAYOUT ================= */
        <div className="relative flex-1 w-full h-full flex flex-row items-center justify-between px-2 py-1 gap-2 overflow-hidden z-20">
          {/* LEFT COLUMN: ACTIVE PLAYER & NAVIGATION */}
          <aside className="w-28 sm:w-32 shrink-0 h-full flex flex-col justify-between py-1 z-30 select-none">
            {/* Player Pill */}
            <div className="w-full flex items-center gap-1.5 bg-black/60 backdrop-blur-md p-1.5 rounded-2xl border border-amber-500/40 shadow-md">
              <span
                className="px-1.5 py-0.5 rounded font-black font-mono text-[9px] text-stone-950 shadow-xs shrink-0"
                style={{ backgroundColor: activePlayer.color }}
              >
                P{activePlayer.id + 1}
              </span>
              <div className="flex flex-col text-left truncate min-w-0">
                <span className="font-extrabold text-white text-[11px] truncate leading-tight">
                  {activePlayer.name}
                </span>
                <span className="text-[8.5px] font-bold text-amber-300 truncate leading-tight">
                  {currentAvatarInfo.name}
                </span>
              </div>
            </div>

            {/* Cash & Property Stats */}
            <div className="w-full bg-stone-950/75 backdrop-blur-md p-2 rounded-2xl border border-white/10 text-center flex flex-col gap-0.5 shadow-md">
              <span className="text-[7.5px] text-stone-400 block uppercase font-sans font-extrabold">Kas</span>
              <span className="text-emerald-400 font-mono font-black text-xs">
                {formatCompactCash(activePlayer.balance)}
              </span>
              <div className="flex items-center justify-center gap-1 text-[8.5px] text-amber-200/80 pt-1 border-t border-white/10 mt-1">
                <span>Tanah:</span>
                <span className="font-mono font-black text-amber-300">{activePlayer.propertiesOwned.length}</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="w-full flex flex-col gap-1.5">
              <button
                onClick={() => setActiveModal('leaderboard')}
                className="w-full gui-btn gui-btn-gold py-1.5 px-1.5 text-[10px] font-black flex items-center justify-center gap-1 shadow-sm"
              >
                <span>🏆</span>
                <span>Peringkat</span>
              </button>
              <button
                onClick={() => setShowMobileMenu(true)}
                className="w-full gui-btn gui-btn-blue py-1.5 px-1.5 text-[10px] font-black flex items-center justify-center gap-1 shadow-sm"
              >
                <span>⚙️</span>
                <span>Menu</span>
              </button>
            </div>
          </aside>

          {/* CENTER: FULL HEIGHT SQUARE BOARD (NEVER CLIPPED) */}
          <main className="relative flex-1 h-full flex items-center justify-center overflow-visible my-auto">
            <MonopolyGoBoard
              tiles={BOARD_TILES}
              tileStates={tileStates}
              players={players}
              activePlayerIndex={activePlayerIndex}
              isRolling={isRolling}
              landmarks={landmarks}
              onTileClick={(tile) => {
                setInspectedTile(tile);
                setIsLandedAction(false);
                setActiveModal('tileDetail');
              }}
              isIsometricView={isIsometric}
              boardScale={boardScale}
              boardPixelSize={optimalBoardSize}
              diceResult={diceResult}
              showDiceAnimation={showDiceAnimation}
              onDiceAnimationComplete={handleDiceAnimationComplete}
              onRoll={handleRoll}
            />
          </main>

          {/* RIGHT COLUMN: MULTIPLIER & ROLL BUTTON */}
          <aside className="w-28 sm:w-32 shrink-0 h-full flex flex-col justify-between py-1 z-30 select-none">
            {/* Multiplier & Sound */}
            <div className="w-full flex items-center justify-between gap-1">
              <button
                onClick={cycleMultiplier}
                title="Pengali Dadu (Multiplier)"
                className="flex-1 gui-btn gui-btn-blue py-1.5 px-1 text-[10px] font-black flex items-center justify-center gap-0.5 shadow-sm"
              >
                <span className="text-[9px]">⚡</span>
                <span>{multiplier}x</span>
              </button>
              <button
                onClick={() => {
                  if (musicVolume > 0) {
                    sound.setMusicVolume(0);
                    setMusicVolume(0);
                    setMusicPlaying(false);
                  } else {
                    const restored = lastActiveVolume > 0 ? lastActiveVolume : 0.5;
                    sound.setMusicVolume(restored);
                    setMusicVolume(restored);
                    setMusicPlaying(true);
                  }
                }}
                className={`gui-btn ${musicVolume === 0 ? 'gui-btn-blue opacity-75' : 'gui-btn-gold'} w-8 h-7 text-xs flex items-center justify-center shrink-0 shadow-sm`}
              >
                {musicVolume === 0 ? '🔇' : '🎵'}
              </button>
            </div>

            {/* Turn Message */}
            <div className="w-full text-center">
              <span className="text-[8px] font-bold text-amber-200/90 leading-tight block">
                {isRolling ? 'Melempar...' : 'Sentuh Papan / Tombol'}
              </span>
            </div>

            {/* Big Roll Button */}
            <button
              onClick={!isRolling ? handleRoll : undefined}
              disabled={isRolling}
              className={`w-full gui-btn gui-btn-gold py-3.5 px-2 flex flex-col items-center justify-center gap-0.5 text-stone-950 font-black shadow-[0_4px_0_#92400e] transition-transform ${
                isRolling ? 'opacity-70 cursor-not-allowed' : 'active:scale-95 hover:scale-105'
              }`}
            >
              <span className="text-2xl animate-bounce">🎲</span>
              <span className="text-xs font-black uppercase tracking-wider leading-none">
                {isRolling ? 'PUTAR...' : 'LEMPAR'}
              </span>
            </button>
          </aside>
        </div>
      ) : isCompactPortrait ? (
        /* ================= MOBILE PORTRAIT GAMEPLAY LAYOUT ================= */
        <div className="relative flex-1 w-full h-full flex flex-col items-center justify-between px-1.5 py-1 gap-1.5 overflow-hidden z-20">
          {/* Mobile Top App Bar */}
          <div className="w-full flex items-center justify-between px-2.5 py-1.5 bg-stone-950/90 backdrop-blur-md rounded-2xl border border-amber-500/40 shadow-lg text-xs z-30 shrink-0 select-none">
            <div className="flex items-center gap-1.5">
              <span
                className="px-1.5 py-0.5 rounded font-black font-mono text-[9px] text-stone-950 shadow-xs"
                style={{ backgroundColor: activePlayer.color }}
              >
                P{activePlayer.id + 1}
              </span>
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-white text-[11px] truncate max-w-[85px] sm:max-w-[110px] leading-tight">
                  {activePlayer.name}
                </span>
                <span className="text-[8px] font-bold text-amber-300 leading-tight">
                  {currentAvatarInfo.name}
                </span>
              </div>
            </div>

            <div className="text-center">
              <span className="text-[7.5px] text-stone-400 block uppercase font-sans font-bold leading-none">Kas</span>
              <span className="text-emerald-400 font-mono font-black text-xs leading-none">
                {formatCompactCash(activePlayer.balance)}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveModal('leaderboard')}
                title="Peringkat Player"
                className="gui-btn gui-btn-gold px-2 py-1 text-[10px] font-black flex items-center gap-1 shadow-sm"
              >
                <span>🏆</span>
              </button>
              <button
                onClick={() => {
                  if (musicVolume > 0) {
                    sound.setMusicVolume(0);
                    setMusicVolume(0);
                    setMusicPlaying(false);
                  } else {
                    const restored = lastActiveVolume > 0 ? lastActiveVolume : 0.5;
                    sound.setMusicVolume(restored);
                    setMusicVolume(restored);
                    setMusicPlaying(true);
                  }
                }}
                className={`gui-btn ${musicVolume === 0 ? 'gui-btn-blue opacity-75' : 'gui-btn-gold'} w-7 h-7 text-xs flex items-center justify-center shrink-0 shadow-sm`}
              >
                {musicVolume === 0 ? '🔇' : '🎵'}
              </button>
              <button
                onClick={() => setShowMobileMenu(true)}
                title="Menu & Pengaturan"
                className="gui-btn gui-btn-blue px-2 py-1 text-xs font-black shrink-0 shadow-sm"
              >
                ⚙️
              </button>
            </div>
          </div>

          {/* Center Board */}
          <main className="relative flex-1 w-full flex items-center justify-center overflow-visible my-auto">
            <MonopolyGoBoard
              tiles={BOARD_TILES}
              tileStates={tileStates}
              players={players}
              activePlayerIndex={activePlayerIndex}
              isRolling={isRolling}
              landmarks={landmarks}
              onTileClick={(tile) => {
                setInspectedTile(tile);
                setIsLandedAction(false);
                setActiveModal('tileDetail');
              }}
              isIsometricView={isIsometric}
              boardScale={boardScale}
              boardPixelSize={optimalBoardSize}
              diceResult={diceResult}
              showDiceAnimation={showDiceAnimation}
              onDiceAnimationComplete={handleDiceAnimationComplete}
              onRoll={handleRoll}
            />
          </main>

          {/* Sticky Bottom Control Bar */}
          <div className="w-full bg-stone-950/90 backdrop-blur-md p-1.5 sm:p-2 rounded-t-2xl border-t-2 border-amber-500/50 shadow-2xl flex items-center gap-2 z-40 shrink-0 select-none">
            <button
              onClick={cycleMultiplier}
              title="Pengali Dadu (Multiplier)"
              className="gui-btn gui-btn-blue py-3 px-3 text-xs font-black flex items-center justify-center gap-1 shrink-0"
            >
              <span>⚡</span>
              <span>{multiplier}x</span>
            </button>
            <button
              onClick={!isRolling ? handleRoll : undefined}
              disabled={isRolling}
              className={`flex-1 gui-btn gui-btn-gold py-3 px-3 flex items-center justify-center gap-2 text-stone-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_4px_0_#92400e] ${
                isRolling ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'
              }`}
            >
              <span className="text-xl animate-bounce">🎲</span>
              <span>{isRolling ? 'MELEMPAR...' : 'LEMPAR DADU'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* ================= DESKTOP & TABLET GAMEPLAY LAYOUT ================= */
        <div className="relative flex-1 w-full flex flex-row items-center justify-between px-2 md:px-4 py-1 gap-2 md:gap-3 overflow-hidden z-20">
          {/* LEFT SPACE: ACTIVE PLAYER AVATAR PION STANDEE */}
          <aside className="w-52 lg:w-64 shrink-0 flex flex-col items-center justify-between gap-3 bg-stone-950/45 backdrop-blur-md p-3 md:p-4 rounded-3xl border border-amber-500/40 shadow-[0_12px_36px_rgba(0,0,0,0.6)] z-30">
            {/* Panel Header Title Badge */}
            <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-stone-950 font-black text-[10px] md:text-[11px] uppercase tracking-wider shadow-md shrink-0">
              <span>👤</span>
              <span>PEMAIN AKTIF</span>
            </div>

            {/* Large 3D Pawn / Standee Model Preview */}
            <div className="relative w-28 h-32 md:w-36 md:h-40 flex items-center justify-center my-1 overflow-visible">
              <div className="relative z-10 transform scale-110 md:scale-125">
                <Pawn3D
                  avatarId={activePlayer.avatarId}
                  customPngUrl={activePlayer.customPawnUrl}
                  isRolling={isRolling}
                  isIsometric={false}
                  size={96}
                  playerColor={activePlayer.color}
                  showPedestal={false}
                />
              </div>
            </div>

            {/* Player Details & Stats Card */}
            <div className="flex flex-col items-center text-center w-full bg-black/40 backdrop-blur-xs p-2.5 rounded-2xl border border-amber-500/30">
              <div className="flex items-center gap-1.5">
                <span
                  className="px-1.5 py-0.2 rounded font-black font-mono text-[9px] text-stone-950 shadow-xs"
                  style={{ backgroundColor: activePlayer.color }}
                >
                  P{activePlayer.id + 1}
                </span>
                <h3 className="text-xs md:text-sm font-black text-white truncate max-w-[120px] md:max-w-[150px]">
                  {activePlayer.name}
                </h3>
              </div>
              <span className="text-[9.5px] font-bold text-amber-300 mt-0.5">
                {currentAvatarInfo.region} • {currentAvatarInfo.name}
              </span>

              {/* Stats Row */}
              <div className="w-full flex items-center justify-around pt-1.5 mt-1.5 border-t border-white/10 text-[10px] font-mono">
                <div className="text-center">
                  <span className="text-[8px] text-stone-400 block uppercase font-sans font-extrabold">Kas</span>
                  <span className="text-emerald-400 font-black">{formatCompactCash(activePlayer.balance)}</span>
                </div>
                <div className="text-center">
                  <span className="text-[8px] text-stone-400 block uppercase font-sans font-extrabold">Tanah</span>
                  <span className="text-amber-300 font-black">{activePlayer.propertiesOwned.length}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* CENTER: MONOPOLY GO BOARD */}
          <main className="relative flex-1 w-full h-full flex items-center justify-center overflow-visible my-auto">
            <MonopolyGoBoard
              tiles={BOARD_TILES}
              tileStates={tileStates}
              players={players}
              activePlayerIndex={activePlayerIndex}
              isRolling={isRolling}
              landmarks={landmarks}
              onTileClick={(tile) => {
                setInspectedTile(tile);
                setIsLandedAction(false);
                setActiveModal('tileDetail');
              }}
              isIsometricView={isIsometric}
              boardScale={boardScale}
              boardPixelSize={optimalBoardSize}
              diceResult={diceResult}
              showDiceAnimation={showDiceAnimation}
              onDiceAnimationComplete={handleDiceAnimationComplete}
              onRoll={handleRoll}
            />
          </main>

          {/* RIGHT SPACE: PERINGKAT PLAYER & ROLL DICE */}
          <aside className="w-52 lg:w-64 shrink-0 flex flex-col items-center justify-between gap-2.5 bg-stone-950/45 backdrop-blur-md p-3 rounded-3xl border border-amber-500/40 shadow-[0_12px_36px_rgba(0,0,0,0.6)] z-30">
            {/* TOP SECTION: PERINGKAT PLAYER */}
            <div className="w-full bg-black/40 backdrop-blur-xs p-2.5 md:p-3 rounded-2xl border border-amber-500/30 flex flex-col gap-1.5">
              <div className="flex items-center justify-between pb-1 border-b border-amber-500/20">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs">🏆</span>
                  <span className="text-[10px] md:text-[11px] font-black uppercase text-amber-300 tracking-wider">
                    PERINGKAT PLAYER
                  </span>
                </div>
                <button
                  onClick={() => setActiveModal('leaderboard')}
                  className="text-[9px] font-black text-amber-400 hover:underline uppercase"
                >
                  Detail ➔
                </button>
              </div>

              {/* Live Rankings List */}
              <div className="space-y-1 w-full">
                {(() => {
                  const rankings = [...players]
                    .map((p) => {
                      let propVal = 0;
                      p.propertiesOwned.forEach((tileId) => {
                        const tile = BOARD_TILES.find((t) => t.id === tileId);
                        const state = tileStates[tileId];
                        if (tile && tile.price) propVal += tile.price;
                        if (tile && state && state.houses > 0) {
                          const hCost = tile.houseCost || Math.floor((tile.price || 10000000) * 0.5);
                          propVal += state.houses * hCost;
                        }
                      });
                      return { player: p, netWorth: p.balance + propVal };
                    })
                    .sort((a, b) => b.netWorth - a.netWorth);

                  return rankings.map((item, idx) => {
                    const rankNum = idx + 1;
                    const p = item.player;
                    const isCurrentTurn = p.id === activePlayerIndex;

                    let rankIcon = `#${rankNum}`;
                    if (rankNum === 1) rankIcon = '👑';
                    else if (rankNum === 2) rankIcon = '🥈';
                    else if (rankNum === 3) rankIcon = '🥉';

                    return (
                      <div
                        key={p.id}
                        className={`flex items-center justify-between px-2 py-1 rounded-xl text-[10px] border transition-all ${
                          isCurrentTurn
                            ? 'bg-amber-500/30 border-amber-400 text-amber-200 font-bold ring-1 ring-amber-400/50 shadow-sm'
                            : 'bg-stone-900/60 border-white/10 text-stone-300'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="text-xs font-black shrink-0 w-4 text-center">{rankIcon}</span>
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: p.color }}
                          />
                          <span className="font-extrabold truncate max-w-[80px]">
                            {p.name}
                          </span>
                        </div>

                        <span className="font-mono font-black text-[9.5px] text-emerald-300 shrink-0">
                          {formatCompactCash(p.balance)}
                        </span>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* BOTTOM SECTION: LEMPAR DADU CONTROL PANEL */}
            <div className="w-full flex flex-col items-center gap-2 pt-1 border-t border-white/10">
              <button
                onClick={!isRolling ? handleRoll : undefined}
                disabled={isRolling}
                className={`w-full gui-btn gui-btn-gold py-3 px-3 flex items-center justify-center gap-2.5 shadow-[0_6px_0_#92400e] transition-transform ${
                  isRolling ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
                }`}
              >
                <span className="text-2xl md:text-3xl filter drop-shadow animate-bounce">🎲</span>
                <div className="flex flex-col text-left">
                  <span className="text-xs md:text-sm font-black font-display tracking-wider text-stone-950 uppercase leading-none">
                    {isRolling ? 'MELEMPAR...' : 'LEMPAR DADU'}
                  </span>
                  <span className="text-[8px] md:text-[9px] font-extrabold text-amber-950 mt-0.5 leading-tight">
                    Klik / Tekan Spasi
                  </span>
                </div>
              </button>

              <span className="text-[8.5px] text-amber-200/90 font-bold text-center">
                Tekan SPASI di keyboard untuk melempar!
              </span>
            </div>
          </aside>
        </div>
      )}

      {/* ================= MODAL: MOBILE NAVIGATION & SETTINGS ================= */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-sm gui-card-gold p-4 sm:p-5 rounded-3xl text-stone-900 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b-2 border-amber-800/20 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚙️</span>
                <h3 className="text-sm font-black font-display uppercase tracking-wider text-amber-950">
                  MENU & PENGATURAN
                </h3>
              </div>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="w-8 h-8 rounded-full bg-amber-950/20 text-stone-900 hover:bg-amber-950/30 flex items-center justify-center text-sm font-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {/* Zoom Papan */}
              <div className="p-2.5 rounded-2xl bg-amber-100/90 border border-amber-300 flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-xs text-amber-950 block">🔍 Ukuran Papan:</span>
                  <span className="text-[10px] text-amber-900/80 font-semibold">Skala tampilan papan</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setBoardScale((prev) => Math.max(0.7, Math.round((prev - 0.05) * 100) / 100))}
                    className="gui-btn gui-btn-blue px-2 py-1 text-xs font-black"
                  >
                    ➖
                  </button>
                  <span className="font-mono font-black text-xs text-amber-950 min-w-[36px] text-center">
                    {Math.round(boardScale * 100)}%
                  </span>
                  <button
                    onClick={() => setBoardScale((prev) => Math.min(1.3, Math.round((prev + 0.05) * 100) / 100))}
                    className="gui-btn gui-btn-gold px-2 py-1 text-xs font-black"
                  >
                    ➕
                  </button>
                  <button
                    onClick={() => setBoardScale(1.0)}
                    className="px-1.5 py-1 text-[9px] font-bold rounded bg-amber-200 hover:bg-amber-300 text-amber-950"
                  >
                    Fit
                  </button>
                </div>
              </div>

              {/* Volume Musik & Audio */}
              <div className="p-2.5 rounded-2xl bg-amber-100/90 border border-amber-300 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-amber-950">🎵 Volume Musik:</span>
                  <span className="font-mono font-black text-xs text-amber-900">{Math.round(musicVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={Math.round(musicVolume * 100)}
                  onChange={(e) => {
                    const val = Number(e.target.value) / 100;
                    sound.setMusicVolume(val);
                    setMusicVolume(val);
                    setMusicPlaying(val > 0);
                    if (val > 0) setLastActiveVolume(val);
                  }}
                  className="w-full accent-amber-600 cursor-pointer h-2 bg-stone-300 rounded-lg"
                />
                <div className="flex justify-between items-center text-[10px] pt-0.5">
                  <button
                    onClick={() => {
                      sound.setMusicVolume(0);
                      setMusicVolume(0);
                      setMusicPlaying(false);
                    }}
                    className={`px-2 py-0.5 rounded font-bold ${musicVolume === 0 ? 'bg-amber-600 text-white' : 'bg-amber-200 text-amber-950'}`}
                  >
                    Mute
                  </button>
                  <button
                    onClick={() => {
                      sound.setMusicVolume(0.3);
                      setMusicVolume(0.3);
                      setMusicPlaying(true);
                      setLastActiveVolume(0.3);
                    }}
                    className="px-2 py-0.5 rounded bg-amber-200 font-bold hover:bg-amber-300 text-amber-950"
                  >
                    30%
                  </button>
                  <button
                    onClick={() => {
                      sound.setMusicVolume(0.6);
                      setMusicVolume(0.6);
                      setMusicPlaying(true);
                      setLastActiveVolume(0.6);
                    }}
                    className="px-2 py-0.5 rounded bg-amber-200 font-bold hover:bg-amber-300 text-amber-950"
                  >
                    60%
                  </button>
                  <button
                    onClick={() => {
                      sound.setMusicVolume(1.0);
                      setMusicVolume(1.0);
                      setMusicPlaying(true);
                      setLastActiveVolume(1.0);
                    }}
                    className="px-2 py-0.5 rounded bg-amber-200 font-bold hover:bg-amber-300 text-amber-950"
                  >
                    100%
                  </button>
                </div>
              </div>

              {/* View Angle Toggle (2D / 3D) */}
              <div className="p-2.5 rounded-2xl bg-amber-100/90 border border-amber-300 flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-xs text-amber-950 block">📐 Sudut Pandang Papan:</span>
                  <span className="text-[10px] text-amber-900/80 font-semibold">{isIsometric ? '3D Isometrik' : '2D Datar (Standar)'}</span>
                </div>
                <button
                  onClick={() => setIsIsometric((prev) => !prev)}
                  className="gui-btn gui-btn-gold px-3 py-1 text-xs font-black"
                >
                  {isIsometric ? 'Mode 2D' : 'Mode 3D'}
                </button>
              </div>

              {/* Action Buttons: Peringkat & Menu Utama */}
              <div className="pt-2 border-t border-amber-800/20 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    setActiveModal('leaderboard');
                  }}
                  className="w-full gui-btn gui-btn-gold py-2.5 px-3 text-xs font-black flex items-center justify-center gap-2"
                >
                  <span>🏆</span>
                  <span>Lihat Peringkat & Statistik</span>
                </button>

                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    setScreen('mainMenu');
                  }}
                  className="w-full gui-btn gui-btn-blue py-2.5 px-3 text-xs font-black flex items-center justify-center gap-2"
                >
                  <span>🏠</span>
                  <span>Kembali ke Menu Utama</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODALS ================= */}

      {/* Modal: Peringkat / Leaderboard */}
      {activeModal === 'leaderboard' && (
        <LeaderboardModal
          players={players}
          tiles={BOARD_TILES}
          tileStates={tileStates}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* Modal: Bangun Cagar Budaya */}
      {activeModal === 'build' && (
        <BuildLandmarkModal
          landmarks={landmarks}
          playerCash={activePlayer.balance}
          onUpgradeLandmark={handleUpgradeLandmark}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* Modal: Gerebek Pusaka */}
      {activeModal === 'heist' && (
        <HeistMiniGameModal
          onComplete={handleHeistComplete}
        />
      )}

      {/* Modal: Album Pusaka Budaya */}
      {activeModal === 'album' && (
        <AlbumModal
          cards={albumCards}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* Modal: Misi Budaya Siswa */}
      {activeModal === 'missions' && (
        <MissionsModal
          missions={missions}
          onClaimReward={(missionId) => {
            const m = missions.find((item) => item.id === missionId);
            if (m && !m.claimed) {
              setMissions((prev) =>
                prev.map((item) => (item.id === missionId ? { ...item, claimed: true } : item))
              );
              setPlayers((prev) => {
                const copy = [...prev];
                copy[activePlayerIndex].balance += m.rewardCash;
                copy[activePlayerIndex].diceEnergy = Math.min(200, (copy[activePlayerIndex].diceEnergy || 100) + m.rewardDice);
                return copy;
              });
              sound.playCoin();
              setBannerMessage(`🎉 Klaim Misi "${m.title}": +${formatRupiah(m.rewardCash)} & +${m.rewardDice} 🎲!`);
            }
          }}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* Modal: Kartu Kesempatan */}
      {activeModal === 'kesempatan' && activeKesempatan && (
        <CardModal
          card={activeKesempatan}
          player={activePlayer}
          onClose={handleKesempatanClose}
        />
      )}

      {/* Modal: Kartu Tantangan Kuis */}
      {activeModal === 'tantangan' && activeTantangan && (
        <QuizModal
          card={activeTantangan}
          player={activePlayer}
          onComplete={handleQuizComplete}
        />
      )}

      {/* Modal: Detail Petak & Ensiklopedia */}
      {activeModal === 'tileDetail' && inspectedTile && (
        <HouseDetailModal
          tile={inspectedTile}
          tileState={tileStates[inspectedTile.id] || { owner: null, houses: 0, mortgaged: false }}
          players={players}
          activePlayer={activePlayer}
          isLandedAction={isLandedAction}
          onClose={() => {
            setActiveModal(null);
            setInspectedTile(null);
          }}
        />
      )}

      {/* Modal: Beli Tanah & Bangun Rumah Adat */}
      {activeModal === 'buyHouse' && targetBuyTile && (
        <BuyHouseModal
          tile={targetBuyTile}
          currentState={tileStates[targetBuyTile.id] || { owner: null, houses: 0, mortgaged: false }}
          player={activePlayer}
          onConfirmPurchase={handleConfirmPurchase}
          onClose={() => {
            setActiveModal(null);
            setTargetBuyTile(null);
            setTimeout(endTurn, 600);
          }}
        />
      )}

      {/* Modal: Bayar Sewa & Ambil Alih Properti Lawan */}
      {activeModal === 'rentPay' && rentPaymentInfo && (
        <RentPayModal
          tile={rentPaymentInfo.tile}
          tileState={rentPaymentInfo.tileState}
          visitor={rentPaymentInfo.visitor}
          owner={rentPaymentInfo.owner}
          rentAmount={rentPaymentInfo.rentAmount}
          onTakeover={handleTakeoverProperty}
          onProceed={() => {
            setActiveModal(null);
            setRentPaymentInfo(null);
            setTimeout(endTurn, 600);
          }}
        />
      )}

    </div>
  );
}
