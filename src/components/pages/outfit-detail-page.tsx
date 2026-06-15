
import { Link, useParams } from 'wouter'
import { useState } from 'react'
import { useNavigate } from '@/navigate'
import { useOutfit, useClothingItem, deleteOutfit } from '@/hooks/use-db'
import { Mannequin } from '@/components/outfit/mannequin'
import { CATEGORY_LABELS } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Trash2, Pencil } from 'lucide-react'

export function OutfitDetailPage() {
  const params = useParams()
  const { id } = params as { id: string }
  const navigate = useNavigate()
  const outfit = useOutfit(id)
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (!outfit) {
    return <div className="text-center py-20 text-muted-foreground">搭配不存在或已删</div>
  }

  const handleDelete = async () => {
    await deleteOutfit(id)
    navigate('/outfits')
  }

  const sortedItems = [...outfit.items].sort((a, b) => a.zIndex - b.zIndex)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/outfits">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold flex-1">{outfit.name}</h1>
        <Link href={`/outfits/new`}>
          <Button variant="outline" size="sm">
            <Pencil className="h-4 w-4 mr-2" />
            重新编辑
          </Button>
        </Link>
        {confirmDelete ? (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setConfirmDelete(false)}>
              取消
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              确认删除
            </Button>
          </div>
        ) : (
          <Button variant="destructive" size="icon" onClick={() => setConfirmDelete(true)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex justify-center">
          <div className="relative w-72 aspect-[2/5] bg-white rounded-xl border overflow-hidden">
            <Mannequin pose={outfit.mannequinPose} className="absolute inset-0 w-full h-full p-2" />
            {sortedItems.map((item) => {
              const clothingItem = useClothingItem(item.clothingId)
              if (!clothingItem) return null
              return (
                <div
                  key={item.clothingId}
                  className="absolute"
                  style={{
                    left: `${item.x}%`,
                    top: `${item.y}%`,
                    transform: `translate(-50%, -50%) scale(${item.scale}) ${item.flipped ? 'scaleX(-1)' : ''}`,
                    zIndex: item.zIndex,
                    width: '70%',
                    maxWidth: '180px',
                  }}
                >
                  <img
                    src={clothingItem.imageData}
                    alt={clothingItem.name}
                    className="w-full h-auto pointer-events-none"
                    draggable={false}
                  />
                </div>
              )
            })}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">搭配清单</h2>
          <div className="grid grid-cols-2 gap-3">
            {sortedItems.map((item) => {
              const clothingItem = useClothingItem(item.clothingId)
              if (!clothingItem) return null
              return (
                <Link
                  key={item.clothingId}
                  href={`/closet/${item.clothingId}`}
                  className="flex items-center gap-3 p-2 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="w-14 h-14 rounded-md bg-muted overflow-hidden shrink-0">
                    <img src={clothingItem.imageData} alt={clothingItem.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{clothingItem.name}</p>
                    <Badge variant="outline" className="text-[10px] mt-0.5">
                      {CATEGORY_LABELS[clothingItem.category]}
                    </Badge>
                  </div>
                </Link>
              )
            })}
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              创建于{new Date(outfit.createdAt).toLocaleDateString('zh-CN')}
            </p>
            {outfit.timesWorn > 0 && (
              <p className="text-sm text-muted-foreground mt-1">穿过 {outfit.timesWorn} </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
