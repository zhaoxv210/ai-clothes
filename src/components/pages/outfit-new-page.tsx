
import { useState } from 'react'
import { Link } from 'wouter'
import { useNavigate } from '@/navigate'
import { useClothingItems, saveOutfit } from '@/hooks/use-db'
import { OutfitCanvas } from '@/components/outfit/outfit-canvas'
import type { CanvasItem } from '@/components/outfit/outfit-canvas'
import type { Category, MannequinPose } from '@/lib/types'
import { CATEGORY_LABELS } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Save, X } from 'lucide-react'

export function OutfitNewPage() {
  const navigate = useNavigate()
  const allItems = useClothingItems()
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([])
  const [mannequinPose, setMannequinPose] = useState<MannequinPose>('front')
  const [outfitName, setOutfitName] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all')
  const [saving, setSaving] = useState(false)

  const filteredItems = allItems.filter(
    (item) => categoryFilter === 'all' || item.category === categoryFilter
  )

  const handleItemClick = (item: (typeof allItems)[number]) => {
    if (canvasItems.find((i) => i.clothingId === item.id)) return
    const layer =
      item.category === 'bottom' ? 0
      : item.category === 'shoes' ? 1
      : item.category === 'outerwear' ? 3
      : item.category === 'accessory' ? 4
      : 2
    const yPos =
      item.category === 'bottom' ? 65
      : item.category === 'shoes' ? 88
      : item.category === 'accessory' ? 20
      : 30

    setCanvasItems([
      ...canvasItems,
      {
        clothingId: item.id,
        clothingItem: item,
        x: 50,
        y: yPos,
        scale: 1,
        flipped: false,
        layer,
        zIndex: canvasItems.length,
      },
    ])
  }

  const handleSave = async () => {
    if (canvasItems.length === 0 && !outfitName.trim()) return
    setSaving(true)

    const outfit = await saveOutfit({
      name: outfitName.trim() || `搭配 ${new Date().toLocaleDateString('zh-CN')}`,
      items: canvasItems.map(({ clothingItem: _, ...rest }) => rest),
      mannequinPose,
      thumbnail: '',
      tags: [],
      rating: 0,
    })

    navigate(`/outfits/${outfit.id}`)
  }

  const filterOptions: { value: Category | 'all'; label: string }[] = [
    { value: 'all', label: '全部' },
    ...(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => ({
      value: cat,
      label: CATEGORY_LABELS[cat],
    })),
  ]

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col">
      <div className="flex items-center gap-3 pb-4 shrink-0">
        <Link href="/outfits">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <Input
          placeholder="搭配名称（可选）"
          value={outfitName}
          onChange={(e) => setOutfitName(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={handleSave} disabled={saving || canvasItems.length === 0}>
          <Save className="h-4 w-4 mr-2" />
          保存搭配
        </Button>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        <div className="w-56 shrink-0 flex flex-col border rounded-lg overflow-hidden">
          <div className="flex flex-wrap gap-1 p-2 border-b">
            {filterOptions.map((f) => (
              <Badge
                key={f.value}
                variant={categoryFilter === f.value ? 'default' : 'outline'}
                className="cursor-pointer text-[11px]"
                onClick={() => setCategoryFilter(f.value)}
              >
                {f.label}
              </Badge>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {filteredItems.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-8">
                该分类暂无衣服              </p>
            )}
            {filteredItems.map((item) => {
              const placed = canvasItems.find((i) => i.clothingId === item.id)
              return (
                <div
                  key={item.id}
                  className={`aspect-[3/4] bg-muted rounded-lg border overflow-hidden cursor-pointer relative group hover:ring-2 hover:ring-primary transition-all ${
                    placed ? 'ring-2 ring-green-500 opacity-60' : ''
                  }`}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('application/json', JSON.stringify(item))
                  }}
                  onClick={() => handleItemClick(item)}
                >
                  <img
                    src={item.imageData}
                    alt={item.name}
                    className="w-full h-full object-contain p-1 pointer-events-none"
                    draggable={false}
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/40 to-transparent p-1 pt-3">
                    <p className="text-white text-[10px] truncate">{item.name}</p>
                  </div>
                  {placed && (
                    <div
                      className="absolute top-1 right-1 bg-green-500 rounded-full p-0.5"
                      onClick={(e) => {
                        e.stopPropagation()
                        setCanvasItems(canvasItems.filter((ci) => ci.clothingId !== item.id))
                      }}
                    >
                      <X className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex-1 flex items-start justify-center pt-4">
          <OutfitCanvas
            items={canvasItems}
            mannequinPose={mannequinPose}
            onItemsChange={setCanvasItems}
            onPoseChange={setMannequinPose}
          />
        </div>
      </div>
    </div>
  )
}
