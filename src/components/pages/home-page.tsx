import { useClothingItems } from '@/hooks/use-db'
import { useRecommendation } from '@/hooks/use-recommendation'
import { Link } from 'wouter'

export function HomePage() {
  const items = useClothingItems()
  const { outfit, shuffle, wearToday } = useRecommendation(items)

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto rounded-2xl bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
            <span className="text-3xl text-muted-foreground/50">+</span>
          </div>
          <p className="text-muted-foreground">还没有衣服，先添加一些吧</p>
          <Link
            href="/closet"
            className="inline-block px-6 py-2.5 bg-foreground text-background rounded-full text-sm font-medium"
          >
            去添加
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 pb-20 gap-8">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">16° 多云</p>
      </div>

      <div className="w-full max-w-sm">
        <div className="aspect-[3/4] bg-card rounded-2xl border overflow-hidden shadow-sm">
          <div className="h-full flex flex-col items-center justify-center gap-3 p-6">
            {outfit.top && (
              <div className="w-full aspect-[4/3] bg-muted rounded-lg overflow-hidden border">
                <img
                  src={outfit.top.imageData}
                  alt={outfit.top.name}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            {outfit.bottom && (
              <div className="w-full aspect-[4/3] bg-muted rounded-lg overflow-hidden border">
                <img
                  src={outfit.bottom.imageData}
                  alt={outfit.bottom.name}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            {outfit.shoes && (
              <div className="w-16 h-16 bg-muted rounded-full overflow-hidden border">
                <img
                  src={outfit.shoes.imageData}
                  alt={outfit.shoes.name}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <p className="text-sm text-center text-muted-foreground">
              {[outfit.top?.name, outfit.bottom?.name, outfit.shoes?.name]
                .filter(Boolean)
                .join(' + ')}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={shuffle}
          className="px-6 py-2.5 rounded-full border border-border text-sm font-medium hover:bg-muted transition-colors"
        >
          换一套
        </button>
        <button
          onClick={wearToday}
          className="px-6 py-2.5 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
        >
          就穿这个
        </button>
      </div>
    </div>
  )
}
