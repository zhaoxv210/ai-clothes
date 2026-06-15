import { useState } from 'react'
import { useParams, Link } from 'wouter'
import { useClothingItems, deleteClothingItem } from '@/hooks/use-db'
import { CATEGORY_LABELS, SEASON_LABELS } from '@/lib/types'

export function ClosetDetailPage() {
  const params = useParams()
  const { id } = params as { id: string }
  const items = useClothingItems()
  const item = items.find((i) => i.id === id)
  const [deleted, setDeleted] = useState(false)

  const handleDelete = async () => {
    if (item) {
      await deleteClothingItem(item.id)
      setDeleted(true)
      setTimeout(() => window.history.back(), 1500)
    }
  }

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <p className="text-muted-foreground text-sm">
          {deleted ? '已删除' : '衣服不存在'}
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 bg-muted flex items-center justify-center p-4">
        <img
          src={item.imageData}
          alt={item.name}
          className="max-w-full max-h-full object-contain"
        />
      </div>
      <div className="p-4 space-y-2 pb-8">
        <h2 className="text-lg font-semibold">{item.name}</h2>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
            {CATEGORY_LABELS[item.category]}
          </span>
          {item.season.map((s) => (
            <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-muted">
              {SEASON_LABELS[s]}
            </span>
          ))}
        </div>
        {item.brand && (
          <p className="text-sm text-muted-foreground">{item.brand}</p>
        )}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleDelete}
            className="flex-1 py-2 rounded-full border border-border text-sm"
          >
            删除
          </button>
        </div>
      </div>
      {deleted && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-foreground text-background px-4 py-2 rounded-full text-sm shadow-lg">
          已删除
        </div>
      )}
    </div>
  )
}
