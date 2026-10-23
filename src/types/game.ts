export type AvatarId = 'kudus' | 'batak' | 'jawa' | 'kebaya' | 'minang' | 'bali' | 'dayak';

export interface AvatarInfo {
  id: AvatarId;
  name: string;
  region: string;
  hatGarb: string;
  badge: string;
  color: string;
  accentColor: string;
  textColor: string;
  bgGradient: string;
  description: string;
  quote: string;
  customPng?: string;
}

export type TileType =
  | 'start'
  | 'property'
  | 'kesempatan'
  | 'tantangan'
  | 'pajak'
  | 'penjara'
  | 'parkir_bebas'
  | 'masuk_penjara'
  | 'stasiun'
  | 'heist';

export interface TileData {
  id: number;
  name: string;
  shortName: string;
  province: string;
  island: 'Jawa' | 'Sumatera' | 'Bali-Nusra' | 'Kalimantan' | 'Sulawesi' | 'Maluku-Papua' | 'Khusus';
  colorGroup: string;
  type: TileType;
  price?: number;
  baseRent?: number;
  houseRent?: [number, number, number];
  hotelRent?: number;
  houseCost?: number;
  houseSvgType: string;
  houseName: string;
  trivia: string;
  culturalPhilosophy: string;
  cashReward?: number;
}

export interface TileState {
  owner: number | null;
  houses: number; // 0 to 4
  mortgaged: boolean;
}

export interface Player {
  id: number;
  name: string;
  avatarId: AvatarId;
  color: string;
  accentColor: string;
  balance: number;
  position: number;
  inJail: boolean;
  jailTurns: number;
  getOutOfJailCards: number;
  isBankrupt: boolean;
  isAI: boolean;
  propertiesOwned: number[];
  customPawnUrl?: string;
  netWorth?: number;
  diceEnergy?: number;
}

export interface Landmark {
  id: string;
  name: string;
  region: string;
  svgType: string;
  level: number; // 0 to 5
  maxLevel: number;
  baseCost: number;
  multiplier: number;
  description: string;
  stages: string[];
}

export interface AlbumCard {
  id: string;
  title: string;
  category: 'Kudus' | 'Sumatera' | 'Jawa-Bali' | 'Kalimantan-Papua';
  stars: number;
  collected: boolean;
  count: number;
  description: string;
}

export interface CulturalMission {
  id: string;
  title: string;
  target: number;
  current: number;
  rewardDice: number;
  rewardCash: number;
  completed: boolean;
  claimed: boolean;
}

export interface PlayerProfile {
  name: string;
  avatarId: AvatarId;
  cash: number;
  diceEnergy: number;
  maxDiceEnergy: number;
  netWorth: number;
  position: number;
  inJail: boolean;
  jailTurns: number;
  shields: number;
  maxShields: number;
  customPawnUrl?: string;
}

export interface KesempatanCard {
  id: string;
  type: 'kesempatan';
  title: string;
  subtitle: string;
  description: string;
  effect: 'money_gain' | 'money_loss' | 'move_to' | 'jail_free' | 'go_to_jail' | 'dice_gain' | 'all_players_pay';
  amount?: number;
  destinationTileId?: number;
  badge: string;
}

export interface TantanganCard {
  id: string;
  type: 'tantangan';
  title: string;
  badge: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  reward?: number;
  rewardCash: number;
  rewardDice: number;
  penalty: number;
  explanation: string;
  relatedRegion: string;
}

export interface GameLogEntry {
  id: string;
  text: string;
  type: 'info' | 'money' | 'warning' | 'quiz' | 'build';
  timestamp: number;
}
