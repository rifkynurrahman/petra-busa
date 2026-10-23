import React from 'react';
import { AvatarId } from '../types/game';

interface AvatarSvgProps {
  avatarId: AvatarId;
  className?: string;
  size?: number | string;
  showBadge?: boolean;
}

export const AvatarSvg: React.FC<AvatarSvgProps> = ({
  avatarId,
  className = '',
  size = 64,
  showBadge = false,
}) => {
  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md overflow-visible"
      >
        <defs>
          {/* Kudus Gradients */}
          <linearGradient id="kudus-bg" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop stopColor="#78350F" />
            <stop offset="1" stopColor="#451A03" />
          </linearGradient>
          <linearGradient id="kudus-caping" x1="20" y1="10" x2="100" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F59E0B" />
            <stop offset="0.6" stopColor="#D97706" />
            <stop offset="1" stopColor="#92400E" />
          </linearGradient>
          <linearGradient id="kudus-gold" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#FDE68A" />
            <stop offset="1" stopColor="#D97706" />
          </linearGradient>

          {/* Minang Gradients */}
          <linearGradient id="minang-bg" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop stopColor="#881337" />
            <stop offset="1" stopColor="#4C0519" />
          </linearGradient>
          <linearGradient id="minang-suntiang" x1="10" y1="0" x2="110" y2="50" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FDE047" />
            <stop offset="0.5" stopColor="#EAB308" />
            <stop offset="1" stopColor="#CA8A04" />
          </linearGradient>

          {/* Bali Gradients */}
          <linearGradient id="bali-bg" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop stopColor="#064E3B" />
            <stop offset="1" stopColor="#022C22" />
          </linearGradient>
          <linearGradient id="bali-udeng" x1="25" y1="15" x2="95" y2="45" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="0.7" stopColor="#FEF08A" />
            <stop offset="1" stopColor="#CA8A04" />
          </linearGradient>

          {/* Dayak Gradients */}
          <linearGradient id="dayak-bg" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0C4A6E" />
            <stop offset="1" stopColor="#082F49" />
          </linearGradient>
          <linearGradient id="dayak-crest" x1="15" y1="0" x2="105" y2="45" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38BDF8" />
            <stop offset="0.5" stopColor="#0284C7" />
            <stop offset="1" stopColor="#0369A1" />
          </linearGradient>
        </defs>

        {/* 1. ADAT KUDUS (Special focus: Caping Kalo, Menara Kudus motif, Beskap Kudus) */}
        {avatarId === 'kudus' && (
          <g>
            {/* Base round portrait frame */}
            <circle cx="60" cy="60" r="54" fill="url(#kudus-bg)" stroke="#F59E0B" strokeWidth="4" />
            
            {/* Subtle Menara Kudus background silhouette */}
            <path
              d="M52 24 L68 24 L66 40 L54 40 Z M50 40 L70 40 L69 52 L51 52 Z M48 52 L72 52 L71 62 L49 62 Z"
              fill="#D97706"
              fillOpacity="0.22"
            />

            {/* Shoulders & Beskap Kudus */}
            <path
              d="M26 106 C26 84 38 74 60 74 C82 74 94 84 94 106 Z"
              fill="#18181B"
              stroke="#D97706"
              strokeWidth="2"
            />
            {/* Gold embroidery on Beskap collar & chest */}
            <path d="M52 74 L60 92 L68 74" stroke="#FDE68A" strokeWidth="2.5" fill="none" />
            <line x1="60" y1="92" x2="60" y2="106" stroke="#FDE68A" strokeWidth="2" strokeDasharray="3 3" />
            {/* Batik Kudus neck sash */}
            <path d="M42 86 C50 96 70 96 78 86" stroke="#B45309" strokeWidth="3" />

            {/* Neck & Face */}
            <rect x="53" y="60" width="14" height="18" fill="#DEB887" rx="4" />
            <ellipse cx="60" cy="54" rx="16" ry="19" fill="#F5D0A9" />

            {/* Facial details */}
            {/* Eyes */}
            <ellipse cx="54" cy="53" rx="2" ry="1.5" fill="#451A03" />
            <ellipse cx="66" cy="53" rx="2" ry="1.5" fill="#451A03" />
            {/* Eyebrows */}
            <path d="M51 49 Q54 47 57 49" stroke="#451A03" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M63 49 Q66 47 69 49" stroke="#451A03" strokeWidth="1.5" strokeLinecap="round" />
            {/* Polite smile */}
            <path d="M56 61 Q60 64 64 61" stroke="#92400E" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            {/* Subtle cheeks */}
            <ellipse cx="50" cy="57" rx="2.5" ry="1.5" fill="#F87171" fillOpacity="0.4" />
            <ellipse cx="70" cy="57" rx="2.5" ry="1.5" fill="#F87171" fillOpacity="0.4" />

            {/* Traditional Caping Kalo Kudus (Distinctive curved wide bamboo woven hat) */}
            {/* Caping woven brim */}
            <ellipse cx="60" cy="38" rx="42" ry="16" fill="url(#kudus-caping)" stroke="#78350F" strokeWidth="1.5" />
            {/* Caping weave pattern lines */}
            <path d="M22 38 Q60 26 98 38" stroke="#78350F" strokeWidth="1" strokeOpacity="0.4" fill="none" />
            <path d="M26 41 Q60 30 94 41" stroke="#78350F" strokeWidth="1" strokeOpacity="0.4" fill="none" />
            <line x1="36" y1="36" x2="48" y2="24" stroke="#78350F" strokeWidth="0.8" strokeOpacity="0.5" />
            <line x1="60" y1="38" x2="60" y2="22" stroke="#78350F" strokeWidth="0.8" strokeOpacity="0.5" />
            <line x1="84" y1="36" x2="72" y2="24" stroke="#78350F" strokeWidth="0.8" strokeOpacity="0.5" />
            {/* Elevated conical dome of Caping Kalo */}
            <path
              d="M40 36 C42 22 50 16 60 16 C70 16 78 22 80 36 Z"
              fill="url(#kudus-caping)"
              stroke="#B45309"
              strokeWidth="1.5"
            />
            {/* Ornate pinnacle gold crest of Kudus */}
            <circle cx="60" cy="15" r="4.5" fill="#FDE68A" stroke="#B45309" strokeWidth="1" />
            <path d="M60 10 L60 15" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
            {/* Caping braided chin strap */}
            <path d="M38 42 Q60 74 82 42" stroke="#B45309" strokeWidth="1.5" fill="none" strokeDasharray="2 2" />
          </g>
        )}

        {/* 2. ADAT MINANGKABAU (Suntiang megah, Songket merah marun) */}
        {avatarId === 'minang' && (
          <g>
            <circle cx="60" cy="60" r="54" fill="url(#minang-bg)" stroke="#E11D48" strokeWidth="4" />

            {/* Shoulders & Baju Kurung Minang */}
            <path
              d="M26 106 C26 84 38 74 60 74 C82 74 94 84 94 106 Z"
              fill="#9F1239"
              stroke="#FDE047"
              strokeWidth="2"
            />
            {/* Golden Songket Sash */}
            <path d="M38 80 L82 106" stroke="#FACC15" strokeWidth="6" strokeLinecap="round" />
            <path d="M38 80 L82 106" stroke="#991B1B" strokeWidth="1" strokeDasharray="3 3" />

            {/* Neck & Face */}
            <rect x="53" y="60" width="14" height="18" fill="#DEB887" rx="4" />
            <ellipse cx="60" cy="54" rx="15" ry="18" fill="#F5D0A9" />

            {/* Facial details */}
            <ellipse cx="54" cy="54" rx="2" ry="1.5" fill="#4C0519" />
            <ellipse cx="66" cy="54" rx="2" ry="1.5" fill="#4C0519" />
            <path d="M51 50 Q54 48 57 50" stroke="#4C0519" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M63 50 Q66 48 69 50" stroke="#4C0519" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M56 62 Q60 65 64 62" stroke="#BE123C" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            <ellipse cx="49" cy="58" rx="2.5" ry="1.5" fill="#F43F5E" fillOpacity="0.45" />
            <ellipse cx="71" cy="58" rx="2.5" ry="1.5" fill="#F43F5E" fillOpacity="0.45" />

            {/* Suntiang Minang (Magnificent multi-tiered golden headdress with curved horns) */}
            {/* Side sweeping tiers */}
            <path
              d="M16 46 Q34 26 48 40 L60 30 L72 40 Q86 26 104 46 Q90 52 76 44 L60 48 L44 44 Q30 52 16 46 Z"
              fill="url(#minang-suntiang)"
              stroke="#A16207"
              strokeWidth="1.2"
            />
            {/* Top crown tier resembling curved buffalo horns */}
            <path
              d="M32 30 Q44 12 60 18 Q76 12 88 30 Q74 24 60 26 Q46 24 32 30 Z"
              fill="#FACC15"
              stroke="#A16207"
              strokeWidth="1"
            />
            {/* Peak central flower ornament */}
            <circle cx="60" cy="14" r="5" fill="#FDE047" stroke="#A16207" strokeWidth="1" />
            <circle cx="48" cy="20" r="3" fill="#FDE047" />
            <circle cx="72" cy="20" r="3" fill="#FDE047" />
            {/* Dangling jurai ornaments */}
            <line x1="24" y1="48" x2="24" y2="62" stroke="#FACC15" strokeWidth="1.5" strokeDasharray="2 2" />
            <line x1="96" y1="48" x2="96" y2="62" stroke="#FACC15" strokeWidth="1.5" strokeDasharray="2 2" />
            <circle cx="24" cy="63" r="2.5" fill="#FDE047" />
            <circle cx="96" cy="63" r="2.5" fill="#FDE047" />
          </g>
        )}

        {/* 3. ADAT BALI (Udeng putih keemasan, Bunga Jepun Kamboja) */}
        {avatarId === 'bali' && (
          <g>
            <circle cx="60" cy="60" r="54" fill="url(#bali-bg)" stroke="#10B981" strokeWidth="4" />

            {/* Shoulders & Saput Poleng Bali */}
            <path
              d="M26 106 C26 84 38 74 60 74 C82 74 94 84 94 106 Z"
              fill="#065F46"
              stroke="#34D399"
              strokeWidth="2"
            />
            {/* Checkerboard Poleng detail on shoulder */}
            <rect x="36" y="86" width="8" height="8" fill="#18181B" />
            <rect x="44" y="86" width="8" height="8" fill="#FAFAFA" />
            <rect x="36" y="94" width="8" height="8" fill="#FAFAFA" />
            <rect x="44" y="94" width="8" height="8" fill="#18181B" />
            {/* Yellow ceremonial sash */}
            <path d="M52 74 L68 106" stroke="#FACC15" strokeWidth="4" />

            {/* Neck & Face */}
            <rect x="53" y="60" width="14" height="18" fill="#DEB887" rx="4" />
            <ellipse cx="60" cy="54" rx="16" ry="18" fill="#F5D0A9" />

            {/* Facial details */}
            <ellipse cx="54" cy="53" rx="2" ry="1.5" fill="#022C22" />
            <ellipse cx="66" cy="53" rx="2" ry="1.5" fill="#022C22" />
            <path d="M51 49 Q54 47 57 49" stroke="#022C22" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M63 49 Q66 47 69 49" stroke="#022C22" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M56 61 Q60 64 64 61" stroke="#047857" strokeWidth="1.8" strokeLinecap="round" fill="none" />

            {/* Balinese Udeng Headwrap (Folded white & gold turban with triangular pinnacle) */}
            <path
              d="M32 46 C32 30 44 26 60 26 C76 26 88 30 88 46 Q60 40 32 46 Z"
              fill="url(#bali-udeng)"
              stroke="#CA8A04"
              strokeWidth="1.5"
            />
            {/* Forehead fold band */}
            <path d="M34 46 Q60 38 86 46" stroke="#EAB308" strokeWidth="3" fill="none" />
            {/* Udeng distinctive triangular crest fold at top */}
            <path
              d="M52 26 L60 12 L68 26 Z"
              fill="#FFFFFF"
              stroke="#CA8A04"
              strokeWidth="1.5"
            />
            <path d="M58 14 L62 26" stroke="#EAB308" strokeWidth="1.5" />
            {/* Yellow Frangipani / Bunga Jepun tucked above right ear */}
            <circle cx="78" cy="38" r="4.5" fill="#FEF08A" stroke="#CA8A04" strokeWidth="0.8" />
            <circle cx="78" cy="38" r="2" fill="#EAB308" />
          </g>
        )}

        {/* 4. ADAT DAYAK KALIMANTAN (Mahkota Bulu Enggang, Kalung Taring & Manik) */}
        {avatarId === 'dayak' && (
          <g>
            <circle cx="60" cy="60" r="54" fill="url(#dayak-bg)" stroke="#0EA5E9" strokeWidth="4" />

            {/* Shoulders & Beaded Warrior Vest */}
            <path
              d="M26 106 C26 84 38 74 60 74 C82 74 94 84 94 106 Z"
              fill="#075985"
              stroke="#38BDF8"
              strokeWidth="2"
            />
            {/* Dayak ethnic beaded pattern */}
            <path d="M44 82 L60 98 L76 82" stroke="#FACC15" strokeWidth="2.5" fill="none" />
            {/* Animal claw / fang amulet */}
            <path d="M57 98 Q60 106 63 98 Z" fill="#F8FAFC" stroke="#0F172A" strokeWidth="1" />

            {/* Neck & Face */}
            <rect x="53" y="60" width="14" height="18" fill="#DEB887" rx="4" />
            <ellipse cx="60" cy="54" rx="16" ry="18" fill="#F5D0A9" />

            {/* Facial details */}
            <ellipse cx="54" cy="53" rx="2" ry="1.5" fill="#082F49" />
            <ellipse cx="66" cy="53" rx="2" ry="1.5" fill="#082F49" />
            <path d="M51 49 Q54 47 57 49" stroke="#082F49" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M63 49 Q66 47 69 49" stroke="#082F49" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M56 61 Q60 64 64 61" stroke="#0369A1" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            {/* Warrior tribal cheek paint marks */}
            <line x1="44" y1="56" x2="50" y2="58" stroke="#38BDF8" strokeWidth="1.5" />
            <line x1="76" y1="56" x2="70" y2="58" stroke="#38BDF8" strokeWidth="1.5" />

            {/* Dayak Beaded Headband */}
            <rect x="36" y="38" width="48" height="8" rx="2" fill="#EAB308" stroke="#0C4A6E" strokeWidth="1.2" />
            <circle cx="44" cy="42" r="1.5" fill="#DC2626" />
            <circle cx="52" cy="42" r="1.5" fill="#0284C7" />
            <circle cx="60" cy="42" r="1.5" fill="#DC2626" />
            <circle cx="68" cy="42" r="1.5" fill="#0284C7" />
            <circle cx="76" cy="42" r="1.5" fill="#DC2626" />

            {/* Iconic Bulu Enggang (Hornbill Feathers Headdress) */}
            {/* Center tall feather */}
            <path
              d="M57 38 C55 20 57 8 60 4 C63 8 65 20 63 38 Z"
              fill="#FFFFFF"
              stroke="#0F172A"
              strokeWidth="1.2"
            />
            {/* Feather black band tip */}
            <path d="M57 14 C58 10 60 7 60 4 C60 7 62 10 63 14 Z" fill="#0F172A" />
            {/* Left feather */}
            <path
              d="M47 38 C41 24 38 14 36 10 C42 16 48 26 53 38 Z"
              fill="#FFFFFF"
              stroke="#0F172A"
              strokeWidth="1.2"
            />
            <path d="M40 18 C39 15 37 12 36 10 C38 12 41 15 42 18 Z" fill="#0F172A" />
            {/* Right feather */}
            <path
              d="M73 38 C67 26 78 16 84 10 C82 14 79 24 67 38 Z"
              fill="#FFFFFF"
              stroke="#0F172A"
              strokeWidth="1.2"
            />
            <path d="M78 18 C80 15 83 12 84 10 C83 12 81 15 80 18 Z" fill="#0F172A" />
          </g>
        )}
      </svg>

      {/* Floating badge if enabled */}
      {showBadge && (
        <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 text-[10px] font-bold bg-amber-400 text-amber-950 rounded shadow-md border border-amber-300">
          {avatarId.toUpperCase()}
        </span>
      )}
    </div>
  );
};
