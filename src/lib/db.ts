import Dexie, { type Table } from 'dexie'
import type { ClothingItem, Outfit } from './types'

export class WardrobeDB extends Dexie {
  clothingItems!: Table<ClothingItem, string>
  outfits!: Table<Outfit, string>

  constructor() {
    super('wardrobeDB')
    this.version(1).stores({
      clothingItems: 'id, category, season, style, favorite, createdAt',
      outfits: 'id, tags, rating, createdAt',
    })
  }
}

export const db = new WardrobeDB()
