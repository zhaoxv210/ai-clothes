import { create } from 'zustand'
import type { Category, Season, Style, MannequinPose } from '@/lib/types'

interface AppState {
  sidebarOpen: boolean
  toggleSidebar: () => void

  closetFilter: {
    category: Category | 'all'
    season: Season | 'all'
    style: Style | 'all'
    search: string
  }
  setClosetFilter: (filter: Partial<AppState['closetFilter']>) => void

  selectedOutfitId: string | null
  setSelectedOutfitId: (id: string | null) => void

  mannequinPose: MannequinPose
  setMannequinPose: (pose: MannequinPose) => void
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  closetFilter: {
    category: 'all',
    season: 'all',
    style: 'all',
    search: '',
  },
  setClosetFilter: (filter) =>
    set((s) => ({ closetFilter: { ...s.closetFilter, ...filter } })),

  selectedOutfitId: null,
  setSelectedOutfitId: (id) => set({ selectedOutfitId: id }),

  mannequinPose: 'front',
  setMannequinPose: (pose) => set({ mannequinPose: pose }),
}))
