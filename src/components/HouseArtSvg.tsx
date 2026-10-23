import React from 'react';

export const BUILDING_IMAGE_MAP: Record<string, string> = {
  // 1. Candi Borobudur (Magelang)
  candi_borobudur: '/assets/buildings/candi_borobudur_web.png',
  borobudur: '/assets/buildings/candi_borobudur_web.png',
  joglo_jawa: '/assets/buildings/candi_borobudur_web.png',
  candi: '/assets/buildings/candi_borobudur_web.png',

  // 2. Menara Kudus (Kudus)
  menara_kudus: '/assets/buildings/menara_kudus_web.png',
  joglo_kudus: '/assets/buildings/menara_kudus_web.png',
  kudus: '/assets/buildings/menara_kudus_web.png',

  // 3. Tugu Pal Putih Yogyakarta (D.I. Yogyakarta) - NEW
  tugu_jogja: '/assets/aistudio/yogyakarta_c204d16f.png',
  tugu_yogyakarta: '/assets/aistudio/yogyakarta_c204d16f.png',
  yogyakarta: '/assets/aistudio/yogyakarta_c204d16f.png',
  jogja: '/assets/aistudio/yogyakarta_c204d16f.png',
  tugu: '/assets/aistudio/yogyakarta_c204d16f.png',

  // 4. Rumoh Aceh / Krong Bade (Aceh) - NEW
  krong_bade: '/assets/aistudio/aceh_69b683cf.png',
  aceh: '/assets/aistudio/aceh_69b683cf.png',
  rumoh_aceh: '/assets/aistudio/aceh_69b683cf.png',

  // 5. Rumah Bolon Batak Toba (Sumatera Utara) - NEW
  bolon: '/assets/aistudio/sumut_ae3b0220.png',
  rumah_bolon: '/assets/aistudio/sumut_ae3b0220.png',
  sumut: '/assets/aistudio/sumut_ae3b0220.png',
  batak: '/assets/aistudio/sumut_ae3b0220.png',
  toba: '/assets/aistudio/sumut_ae3b0220.png',

  // 6. Rumah Gadang (Padang / Sumatera Barat)
  rumah_gadang: '/assets/buildings/rumah_gadang_web.png',
  gadang: '/assets/buildings/rumah_gadang_web.png',

  // 7. Pura Bali / Gapura Candi Bentar (Bali)
  pura_bali: '/assets/buildings/pura_bali_web.png',
  bali: '/assets/buildings/pura_bali_web.png',
  candi_bentar: '/assets/buildings/pura_bali_web.png',
  gapura_bali: '/assets/buildings/pura_bali_web.png',

  // 8. Bale Tani Suku Sasak (Lombok / NTB)
  sasak: '/assets/aistudio/lombok_0560fc12.png',
  lombok: '/assets/aistudio/lombok_0560fc12.png',
  bale_tani: '/assets/aistudio/lombok_0560fc12.png',
  bale_tani_sasak: '/assets/aistudio/lombok_0560fc12.png',

  // 9. Rumah Kerucut Mbaru Niang Wae Rebo (Flores / NTT)
  mbaru_niang: '/assets/aistudio/mbaru_d905b4c1.png',
  mbaru: '/assets/aistudio/mbaru_d905b4c1.png',
  flores: '/assets/aistudio/mbaru_d905b4c1.png',
  wae_rebo: '/assets/aistudio/mbaru_d905b4c1.png',

  // 10. Rumah Bubungan Tinggi (Banjarmasin / Kalimantan Selatan) - NEW
  bubungan_tinggi: '/assets/aistudio/banjarmasin_76ae10ff.png',
  banjar: '/assets/aistudio/banjarmasin_76ae10ff.png',
  banjarmasin: '/assets/aistudio/banjarmasin_76ae10ff.png',
  rumah_banjar: '/assets/aistudio/banjarmasin_76ae10ff.png',
  rumah_bubungan_tinggi: '/assets/aistudio/banjarmasin_76ae10ff.png',

  // 11. Rumah Radakng (Pontianak / Dayak Kalimantan Barat)
  radakng: '/assets/aistudio/PLAY__5__a3c49750.png',
  dayak_radakng: '/assets/aistudio/PLAY__5__a3c49750.png',
  rumah_radakng: '/assets/aistudio/PLAY__5__a3c49750.png',

  // 12. Rumah Tongkonan (Tana Toraja / Sulawesi Selatan)
  tongkonan: '/assets/aistudio/PLAY__4__1e509b6d.png',
  toraja: '/assets/aistudio/PLAY__4__1e509b6d.png',
  rumah_tongkonan: '/assets/aistudio/PLAY__4__1e509b6d.png',

  // 13. Rumah Honai (Wamena / Papua Pegunungan)
  honai: '/assets/aistudio/PLAY__6__28c526c3.png',
  papua: '/assets/aistudio/PLAY__6__28c526c3.png',
  honai_papua: '/assets/aistudio/PLAY__6__28c526c3.png',
  rumah_honai: '/assets/aistudio/PLAY__6__28c526c3.png',

  // 14. Bandara Nusantara (Hub Penerbangan 3D)
  bandara: '/assets/aistudio/PLAY__8__b2b4a02b.png',
  airport: '/assets/aistudio/PLAY__8__b2b4a02b.png',
  bandara_soetta: '/assets/aistudio/PLAY__8__b2b4a02b.png',
  bandara_bali: '/assets/aistudio/PLAY__8__b2b4a02b.png',

  // 15. Pulau Terasing (Penjara Adat)
  pulau_terasing: '/assets/aistudio/PLAY__7__d8f343dd.png',
  pulau: '/assets/aistudio/PLAY__7__d8f343dd.png',
  penjara: '/assets/aistudio/PLAY__7__d8f343dd.png',
  masuk_penjara: '/assets/aistudio/PLAY__7__d8f343dd.png',

  // 16. Festival Budaya Nusantara (Panggung Gelar Seni & Tari) - NEW
  festival: '/assets/aistudio/festivalbudaya_6c0cb15d.png',
  festival_budaya: '/assets/aistudio/festivalbudaya_6c0cb15d.png',
  parkir_bebas: '/assets/aistudio/festivalbudaya_6c0cb15d.png',
  panggung_budaya: '/assets/aistudio/festivalbudaya_6c0cb15d.png',
};

interface HouseArtSvgProps {
  type: string;
  className?: string;
  size?: number | string;
}

export const HouseArtSvg: React.FC<HouseArtSvgProps> = ({
  type,
  className = '',
  size = 48,
}) => {
  const imgSrc = BUILDING_IMAGE_MAP[type];

  // If this type corresponds to one of the authentic Indonesian buildings, render the image directly
  if (imgSrc) {
    return (
      <div 
        className={`relative inline-flex items-center justify-center shrink-0 overflow-visible ${className}`}
        style={{
          width: typeof size === 'number' ? `${size}px` : size,
          height: typeof size === 'number' ? `${size}px` : size,
          maxWidth: '100%',
          maxHeight: '100%',
        }}
      >
        <img
          src={imgSrc}
          alt={type}
          style={{
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
          }}
          className="w-full h-full object-contain filter drop-shadow-[0_3px_6px_rgba(0,0,0,0.4)] select-none pointer-events-none"
          loading="eager"
        />
      </div>
    );
  }

  // Special Utility / Corner Tile Icons (Bandara, Pelabuhan, etc.)
  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm overflow-visible"
      >
        {/* BANDARA NUSANTARA */}
        {type === 'bandara' && (
          <g>
            <circle cx="50" cy="50" r="46" fill="#0284C7" fillOpacity="0.25" />
            <path d="M16 68 Q50 44 84 68 Z" fill="#0369A1" stroke="#38BDF8" strokeWidth="1.5" />
            <rect x="22" y="68" width="56" height="14" fill="#0C4A6E" />
            <path
              d="M36 40 L60 26 L64 30 L52 42 L66 42 L72 38 L74 42 L68 46 L38 46 Z"
              fill="#F8FAFC"
              stroke="#0284C7"
              strokeWidth="1"
            />
            <circle cx="30" cy="74" r="2" fill="#38BDF8" />
            <circle cx="50" cy="74" r="2" fill="#FDE047" />
            <circle cx="70" cy="74" r="2" fill="#38BDF8" />
          </g>
        )}

        {/* PELABUHAN / KAPAL PHINISI NUSANTARA */}
        {type === 'pelabuhan' && (
          <g>
            <circle cx="50" cy="50" r="46" fill="#0F766E" fillOpacity="0.25" />
            <path d="M12 78 Q26 72 40 78 Q54 84 68 78 Q82 72 90 78" stroke="#2DD4BF" strokeWidth="2.5" fill="none" />
            <path d="M22 66 L30 76 L70 76 L82 62 Z" fill="#78350F" stroke="#FDE68A" strokeWidth="1.2" />
            <line x1="42" y1="28" x2="42" y2="66" stroke="#B45309" strokeWidth="2" />
            <line x1="60" y1="24" x2="60" y2="66" stroke="#B45309" strokeWidth="2" />
            <polygon points="42,30 26,46 42,46" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="0.8" />
            <polygon points="60,26 44,44 60,44" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="0.8" />
            <polygon points="60,26 74,42 60,42" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="0.8" />
          </g>
        )}

        {/* Fallback */}
        {type !== 'bandara' && type !== 'pelabuhan' && (
          <g>
            <circle cx="50" cy="50" r="46" fill="#92400E" fillOpacity="0.25" />
            <polygon points="20,70 50,25 80,70" fill="#B45309" stroke="#FDE68A" strokeWidth="2" />
            <rect x="42" y="55" width="16" height="15" fill="#451A03" />
          </g>
        )}
      </svg>
    </div>
  );
};
