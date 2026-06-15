
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db'
import type { ClothingItem, Outfit } from '@/lib/types'
import { generateId } from '@/lib/id'

export function useClothingItems() {
  return useLiveQuery(() => db.clothingItems.orderBy('createdAt').reverse().toArray()) ?? []
}

export function useClothingItem(id: string | undefined) {
  return useLiveQuery(() => (id ? db.clothingItems.get(id) : undefined), [id])
}

export function useOutfits() {
  return useLiveQuery(() => db.outfits.orderBy('createdAt').reverse().toArray()) ?? []
}

export function useOutfit(id: string | undefined) {
  return useLiveQuery(() => (id ? db.outfits.get(id) : undefined), [id])
}

export async function addClothingItem(
  data: Omit<ClothingItem, 'id' | 'createdAt' | 'timesWorn' | 'lastWorn'>
) {
  const item: ClothingItem = {
    ...data,
    id: generateId(),
    timesWorn: 0,
    lastWorn: null,
    createdAt: Date.now(),
  }
  await db.clothingItems.add(item)
  return item
}

export async function updateClothingItem(
  id: string,
  data: Partial<ClothingItem>
) {
  await db.clothingItems.update(id, data)
}

export async function deleteClothingItem(id: string) {
  await db.clothingItems.delete(id)
}

export async function saveOutfit(
  data: Omit<Outfit, 'id' | 'createdAt' | 'updatedAt' | 'timesWorn'>
) {
  const now = Date.now()
  const outfit: Outfit = {
    ...data,
    id: generateId(),
    timesWorn: 0,
    createdAt: now,
    updatedAt: now,
  }
  await db.outfits.add(outfit)
  return outfit
}

export async function updateOutfit(id: string, data: Partial<Outfit>) {
  await db.outfits.update(id, { ...data, updatedAt: Date.now() })
}

export async function deleteOutfit(id: string) {
  await db.outfits.delete(id)
}
