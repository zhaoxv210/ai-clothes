import { useState, useCallback, useRef } from 'react'
import type { ClothingItem, Season } from '@/lib/types'

function getCurrentSeason(): Season {
  const m = new Date().getMonth() + 1
  if (m >= 3 && m <= 5) return 'spring'
  if (m >= 6 && m <= 8) return 'summer'
  if (m >= 9 && m <= 11) return 'autumn'
  return 'winter'
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function getRecommendation(
  items: ClothingItem[],
  todayOutfitIds: string[],
  lastPool: { tops: string[]; bottoms: string[]; shoes: string[] } | null
): {
  outfit: { top?: ClothingItem; bottom?: ClothingItem; shoes?: ClothingItem }
  pool: { tops: string[]; bottoms: string[]; shoes: string[] }
} {
  const season = getCurrentSeason()

  const seasonPool = shuffleArray(
    items.filter(
      (i) =>
        !todayOutfitIds.includes(i.id) && i.category !== 'accessory' && i.category !== 'outerwear'
    )
  )

  let seasonal = seasonPool.filter((i) => i.season.includes(season))
  if (seasonal.length < 3) {
    seasonal = seasonPool
  }

  let tops = seasonal.filter((i) => i.category === 'top').map((i) => i.id)
  let bottoms = seasonal.filter((i) => i.category === 'bottom').map((i) => i.id)
  let shoes = seasonal.filter((i) => i.category === 'shoes').map((i) => i.id)

  if (lastPool) {
    tops = tops.filter((id) => !lastPool.tops.includes(id))
    bottoms = bottoms.filter((id) => !lastPool.bottoms.includes(id))
    shoes = shoes.filter((id) => !lastPool.shoes.includes(id))
    if (tops.length === 0 && bottoms.length === 0 && shoes.length === 0) {
      tops = seasonal.filter((i) => i.category === 'top').map((i) => i.id)
      bottoms = seasonal.filter((i) => i.category === 'bottom').map((i) => i.id)
      shoes = seasonal.filter((i) => i.category === 'shoes').map((i) => i.id)
    }
  }

  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]
  const topId = tops.length > 0 ? pick(tops) : undefined
  const bottomId = bottoms.length > 0 ? pick(bottoms) : undefined
  const shoeId = shoes.length > 0 ? pick(shoes) : undefined

  return {
    outfit: {
      top: topId ? seasonal.find((i) => i.id === topId) : undefined,
      bottom: bottomId ? seasonal.find((i) => i.id === bottomId) : undefined,
      shoes: shoeId ? seasonal.find((i) => i.id === shoeId) : undefined,
    },
    pool: {
      tops: tops.filter((id) => id !== topId),
      bottoms: bottoms.filter((id) => id !== bottomId),
      shoes: shoes.filter((id) => id !== shoeId),
    },
  }
}

export function useRecommendation(items: ClothingItem[]) {
  const [todayOutfitIds, setTodayOutfitIds] = useState<string[]>([])
  const poolRef = useRef<{ tops: string[]; bottoms: string[]; shoes: string[] } | null>(null)
  const [outfit, setOutfit] = useState<{
    top?: ClothingItem
    bottom?: ClothingItem
    shoes?: ClothingItem
  }>(() => getRecommendation(items, [], null).outfit)

  const shuffle = useCallback(() => {
    const result = getRecommendation(items, todayOutfitIds, poolRef.current)
    poolRef.current = result.pool
    setOutfit(result.outfit)
  }, [items, todayOutfitIds])

  const wearToday = useCallback(() => {
    const ids = [
      ...(outfit.top ? [outfit.top.id] : []),
      ...(outfit.bottom ? [outfit.bottom.id] : []),
      ...(outfit.shoes ? [outfit.shoes.id] : []),
    ]
    setTodayOutfitIds((prev) => [...new Set([...prev, ...ids])])
  }, [outfit])

  return { outfit, shuffle, wearToday }
}
