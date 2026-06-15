import { useState } from 'react'
import { useClothingItems } from '@/hooks/use-db'
import { CATEGORY_LABELS, type Category } from '@/lib/types'
import { Link } from 'wouter'

export function ClosetPage() {
  const items = useClothingItems()
  const [filterCat, setFilterCat] = useState<Category | 'all'>('all')
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = items.filter((item) => {
    if (filterCat !== 'all' && item.category !== filterCat) return false
    if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="min-h-screen p-4 pb-16">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">衣橱</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="text-sm text-muted-foreground px-3 py-1 rounded-full hover:bg-muted transition-colors"
        >
          筛选
        </button>
      </div>

      {showFilters && (
        <div className="mb-4 p-3 rounded-xl bg-card border backdrop-blur-xl space-y-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterCat('all')}
              className={`px-3 py-1 rounded-full text-xs ${
                filterCat === 'all' ? 'bg-foreground text-background' : 'bg-muted'
              }`}
            >
              全部
            </button>
            {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                className={`px-3 py-1 rounded-full text-xs ${
                  filterCat === cat ? 'bg-foreground text-background' : 'bg-muted'
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索衣服..."
            className="w-full bg-transparent border-b border-border pb-1 text-sm outline-none placeholder:text-muted-foreground/50"
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground text-sm">
          暂无衣服
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {filtered.map((item) => (
            <Link key={item.id} href={`/closet/${item.id}`}>
              <div className="relative aspect-square bg-muted rounded-lg overflow-hidden border cursor-pointer hover:ring-1 hover:ring-foreground/20 transition-all">
                <img
                  src={item.imageData}
                  alt={item.name}
                  className="w-full h-full object-contain"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-1">
                  <p className="text-[10px] text-white truncate">{item.name}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Link
        href="/closet/new"
        className="fixed bottom-20 right-5 w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg"
      >
        <span className="text-xl">+</span>
      </Link>
    </div>
  )
}
