export type Category = 'top' | 'bottom' | 'dress' | 'shoes' | 'accessory' | 'outerwear'
export type Season = 'spring' | 'summer' | 'autumn' | 'winter'
export type Style = 'casual' | 'formal' | 'sporty' | 'vintage' | 'minimal' | 'bohemian' | 'streetwear' | 'romantic'
export type MannequinPose = 'front' | 'side'

export interface ClothingItem {
  id: string
  name: string
  category: Category
  imageData: string
  originalImageData: string
  colors: string[]
  season: Season[]
  brand: string
  favorite: boolean
  tags: string[]
  timesWorn: number
  lastWorn: number | null
  createdAt: number
}

export interface OutfitItem {
  clothingId: string
  x: number
  y: number
  scale: number
  flipped: boolean
  layer: number
  zIndex: number
}

export interface Outfit {
  id: string
  name: string
  items: OutfitItem[]
  mannequinPose: MannequinPose
  thumbnail: string
  tags: string[]
  rating: number
  timesWorn: number
  createdAt: number
  updatedAt: number
}

export const CATEGORY_LABELS: Record<Category, string> = {
  top: '上装',
  bottom: '下装',
  dress: '连衣裙',
  shoes: '鞋子',
  accessory: '配饰',
  outerwear: '外套',
}

export const CATEGORY_COLORS: Record<Category, string> = {
  top: 'bg-blue-100 text-blue-800 border-blue-200',
  bottom: 'bg-green-100 text-green-800 border-green-200',
  dress: 'bg-purple-100 text-purple-800 border-purple-200',
  shoes: 'bg-amber-100 text-amber-800 border-amber-200',
  accessory: 'bg-pink-100 text-pink-800 border-pink-200',
  outerwear: 'bg-orange-100 text-orange-800 border-orange-200',
}

export const SEASON_LABELS: Record<Season, string> = {
  spring: '春季',
  summer: '夏季',
  autumn: '秋季',
  winter: '冬季',
}

export const STYLE_LABELS: Record<Style, string> = {
  casual: '休闲',
  formal: '正式',
  sporty: '运动',
  vintage: '复古',
  minimal: '简约',
  bohemian: '波西米亚',
  streetwear: '街头',
  romantic: '浪漫',
}
