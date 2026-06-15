
import { Link } from 'wouter'
import { useClothingItem } from '@/hooks/use-db'
import { CATEGORY_LABELS } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ClothingCardProps {
  id: string
}

export function ClothingCard({ id }: ClothingCardProps) {
  const item = useClothingItem(id)

  if (!item) return null

  return (
    <Link href={`/closet/${id}`} className="block group">
      <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden border relative hover:shadow-md transition-shadow">
        <img
          src={item.imageData}
          alt={item.name}
          className="w-full h-full object-contain p-1"
        />
        <div className="absolute top-1.5 right-1.5">
          <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0', 'bg-white/80')}>
            {CATEGORY_LABELS[item.category]}
          </Badge>
        </div>
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent p-2 pt-4">
          <p className="text-white text-xs font-medium truncate">{item.name}</p>
        </div>
      </div>
    </Link>
  )
}
