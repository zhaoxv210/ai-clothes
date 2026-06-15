
import { useState, useRef, useCallback, type DragEvent } from 'react'
import { Mannequin } from './mannequin'
import type { ClothingItem, OutfitItem, MannequinPose } from '@/lib/types'
import { CATEGORY_LABELS } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { RotateCcw, Trash2, FlipHorizontal } from 'lucide-react'

// Layer system: determines stacking order
const CATEGORY_LAYER: Record<string, number> = {
  bottom: 0,
  shoes: 1,
  dress: 2,
  top: 2,
  outerwear: 3,
  accessory: 4,
}

export interface CanvasItem extends OutfitItem {
  clothingItem: ClothingItem
}

interface OutfitCanvasProps {
  items: CanvasItem[]
  mannequinPose: MannequinPose
  onItemsChange: (items: CanvasItem[]) => void
  onPoseChange: (pose: MannequinPose) => void
}

export function OutfitCanvas({
  items,
  mannequinPose,
  onItemsChange,
  onPoseChange,
}: OutfitCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const dragOffset = useRef({ x: 0, y: 0 })

  const sortedItems = [...items].sort((a, b) => a.zIndex - b.zIndex)

  const handleCanvasDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      const data = e.dataTransfer.getData('application/json')
      if (!data || !canvasRef.current) return

      const clothingItem: ClothingItem = JSON.parse(data)
      const rect = canvasRef.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      const layer = CATEGORY_LAYER[clothingItem.category] ?? 0

      const newItem: CanvasItem = {
        clothingId: clothingItem.id,
        clothingItem,
        x,
        y,
        scale: 1,
        flipped: false,
        layer,
        zIndex: items.length,
      }

      onItemsChange([...items, newItem])
      setSelectedId(clothingItem.id)
    },
    [items, onItemsChange]
  )

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    setDragging(id)
    setSelectedId(id)
    const item = items.find((i) => i.clothingId === id)
    if (item && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      dragOffset.current = {
        x: e.clientX - rect.left - (item.x / 100) * rect.width,
        y: e.clientY - rect.top - (item.y / 100) * rect.height,
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current || !dragging) return
      const rect = canvasRef.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left - dragOffset.current.x) / rect.width) * 100
      const y = ((e.clientY - rect.top - dragOffset.current.y) / rect.height) * 100

      onItemsChange(
        items.map((item) =>
          item.clothingId === id ? { ...item, x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) } : item
        )
      )
    }

    const handleMouseUp = () => {
      setDragging(null)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  const removeItem = (id: string) => {
    onItemsChange(items.filter((i) => i.clothingId !== id))
    setSelectedId(null)
  }

  const updateScale = (id: string, scale: number) => {
    onItemsChange(items.map((i) => (i.clothingId === id ? { ...i, scale } : i)))
  }

  const flipItem = (id: string) => {
    onItemsChange(items.map((i) => (i.clothingId === id ? { ...i, flipped: !i.flipped } : i)))
  }

  const bringToFront = (id: string) => {
    const maxZ = Math.max(...items.map((i) => i.zIndex), 0)
    onItemsChange(items.map((i) => (i.clothingId === id ? { ...i, zIndex: maxZ + 1 } : i)))
    setSelectedId(id)
  }

  const selectedItem = items.find((i) => i.clothingId === selectedId)

  return (
    <div className="flex gap-4 h-full">
      {/* Canvas area */}
      <div className="flex-1 flex flex-col items-center">
        <div
          ref={canvasRef}
          className="relative w-72 md:w-80 aspect-[2/5] bg-white rounded-xl border-2 border-dashed border-muted-foreground/30 overflow-hidden"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleCanvasDrop}
          onClick={() => setSelectedId(null)}
        >
          <Mannequin pose={mannequinPose} className="absolute inset-0 w-full h-full p-2" />

          {sortedItems.map((item) => (
            <div
              key={item.clothingId}
              className="absolute cursor-grab"
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: `translate(-50%, -50%) scale(${item.scale}) ${item.flipped ? 'scaleX(-1)' : ''}`,
                zIndex: item.zIndex,
                width: '70%',
                maxWidth: '180px',
                outline: selectedId === item.clothingId ? '2px solid #3b82f6' : 'none',
                borderRadius: '4px',
              }}
              onMouseDown={(e) => {
                e.stopPropagation()
                handleMouseDown(e, item.clothingId)
                bringToFront(item.clothingId)
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={item.clothingItem.imageData}
                alt={item.clothingItem.name}
                className="w-full h-auto pointer-events-none select-none"
                draggable={false}
              />
            </div>
          ))}

          {items.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-sm text-muted-foreground/50">从左侧拖入衣</p>
            </div>
          )}
        </div>
      </div>

      {/* Controls panel */}
      <div className="w-56 shrink-0 space-y-4">
        <div>
          <label className="text-xs text-muted-foreground">模特姿势</label>
          <div className="flex gap-2 mt-1">
            <Button
              size="sm"
              variant={mannequinPose === 'front' ? 'default' : 'outline'}
              onClick={() => onPoseChange('front')}
              className="flex-1"
            >
              正面
            </Button>
            <Button
              size="sm"
              variant={mannequinPose === 'side' ? 'default' : 'outline'}
              onClick={() => onPoseChange('side')}
              className="flex-1"
            >
              侧面
            </Button>
          </div>
        </div>

        {selectedItem && (
          <>
            <div className="p-3 bg-muted rounded-lg space-y-3">
              <p className="text-sm font-medium truncate">{selectedItem.clothingItem.name}</p>
              <p className="text-xs text-muted-foreground">
                {CATEGORY_LABELS[selectedItem.clothingItem.category]}
              </p>

              <div>
                <label className="text-xs text-muted-foreground">缩放</label>
                <Slider
                  value={[selectedItem.scale]}
                  min={0.3}
                  max={2}
                  step={0.05}
                  onValueChange={(v) => {
                    const val = Array.isArray(v) ? v[0] : v
                    updateScale(selectedItem.clothingId, val)
                  }}
                />
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => flipItem(selectedItem.clothingId)}>
                  <FlipHorizontal className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => removeItem(selectedItem.clothingId)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Legend */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>已放置：{items.length} </p>
          <p className="text-[10px]">提示：点击选中，拖动调整位</p>
        </div>
      </div>
    </div>
  )
}
