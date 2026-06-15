
import { Link } from 'wouter'
import { useClothingItems, useOutfits } from '@/hooks/use-db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sun } from 'lucide-react'

const SEASON_MONTHS = {
  spring: [3, 4, 5],
  summer: [6, 7, 8],
  autumn: [9, 10, 11],
  winter: [12, 1, 2],
}

export function TodayPage() {
  const items = useClothingItems()
  const outfits = useOutfits()

  const month = new Date().getMonth() + 1
  const currentSeason = (Object.entries(SEASON_MONTHS).find(([, months]) =>
    months.includes(month)
  )?.[0] ?? 'spring') as keyof typeof SEASON_MONTHS

  const seasonalItems = items.filter((item) => item.season.includes(currentSeason as any))
  const seasonalOutfits = outfits.filter((outfit) => items.some((ci) =>
    outfit.items.some((oi) => oi.clothingId === ci.id && ci.season.includes(currentSeason as any))
  ))

  const seasonLabel: Record<string, string> = {
    spring: '春季',
    summer: '夏季',
    autumn: '秋季',
    winter: '冬季',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">今日穿搭</h1>
        <span className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-sky-50 border-sky-200">
        <CardContent className="py-6">
          <div className="flex items-center gap-3">
            <Sun className="h-10 w-10 text-amber-500" />
            <div>
              <p className="text-lg font-semibold">当前季节：{seasonLabel[currentSeason]}</p>
              <p className="text-sm text-muted-foreground">
                适合当季的衣服共 {seasonalItems.length} 件              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {seasonalItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-2">还没有适合 {seasonLabel[currentSeason]} 的衣</p>
            <Link href="/closet/new">
              <Button>添加衣服</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">当季单品</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {seasonalItems.slice(0, 12).map((item) => (
                  <Link key={item.id} href={`/closet/${item.id}`}>
                    <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden border">
                      <img src={item.imageData} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">历史推荐搭配</CardTitle>
            </CardHeader>
            <CardContent>
              {seasonalOutfits.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  还没有当季搭配，去{' '}
                  <Link href="/outfits/new" className="text-primary underline">
                    创建搭配
                  </Link>
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {seasonalOutfits.slice(0, 6).map((outfit) => (
                    <Link key={outfit.id} href={`/outfits/${outfit.id}`}>
                      <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden border flex items-center justify-center text-xs text-muted-foreground">
                        {outfit.name}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
