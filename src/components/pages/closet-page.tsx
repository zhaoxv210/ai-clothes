
import { useClothingItems } from '@/hooks/use-db'
import { useAppStore } from '@/store/use-store'
import { CATEGORY_LABELS, SEASON_LABELS, STYLE_LABELS, type Category, type Season, type Style } from '@/lib/types'
import { ClothingGrid } from '@/components/closet/clothing-grid'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search } from 'lucide-react'

export function ClosetPage() {
  const items = useClothingItems()
  const { closetFilter, setClosetFilter } = useAppStore()

  const filtered = items.filter((item) => {
    if (closetFilter.category !== 'all' && item.category !== closetFilter.category) return false
    if (closetFilter.season !== 'all' && !item.season.includes(closetFilter.season)) return false
    if (closetFilter.style !== 'all' && !item.style.includes(closetFilter.style)) return false
    if (
      closetFilter.search &&
      !item.name.toLowerCase().includes(closetFilter.search.toLowerCase())
    )
      return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">我的衣橱</h1>
        <span className="text-sm text-muted-foreground">
          共{filtered.length} / {items.length}件        </span>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索衣服..."
            className="pl-8"
            value={closetFilter.search}
            onChange={(e) => setClosetFilter({ search: e.target.value })}
          />
        </div>

        <Select
          value={closetFilter.category}
          onValueChange={(v) => setClosetFilter({ category: v as Category | 'all' })}
        >
          <SelectTrigger className="w-28">
            <SelectValue placeholder="品类" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部</SelectItem>
            {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => (
              <SelectItem key={cat} value={cat}>
                {CATEGORY_LABELS[cat]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={closetFilter.season}
          onValueChange={(v) => setClosetFilter({ season: v as Season | 'all' })}
        >
          <SelectTrigger className="w-28">
            <SelectValue placeholder="季节" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部</SelectItem>
            {(Object.keys(SEASON_LABELS) as Season[]).map((s) => (
              <SelectItem key={s} value={s}>
                {SEASON_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={closetFilter.style}
          onValueChange={(v) => setClosetFilter({ style: v as Style | 'all' })}
        >
          <SelectTrigger className="w-28">
            <SelectValue placeholder="风格" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部</SelectItem>
            {(Object.keys(STYLE_LABELS) as Style[]).map((s) => (
              <SelectItem key={s} value={s}>
                {STYLE_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          {items.length === 0 ? '衣橱还是空的，去上传衣服吧' : '没有匹配的衣服'}
        </div>
      ) : (
        <ClothingGrid items={filtered} />
      )}
    </div>
  )
}
