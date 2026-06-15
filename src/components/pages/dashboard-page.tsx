
import { useClothingItems, useOutfits } from '@/hooks/use-db'
import { CATEGORY_LABELS, type Category } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shirt, ShirtIcon, Layers } from 'lucide-react'
import { Link } from 'wouter'

export function DashboardPage() {
  const items = useClothingItems()
  const outfits = useOutfits()

  const categoryCounts = items.reduce(
    (acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const favoriteCount = items.filter((i) => i.favorite).length
  const recentItems = items.slice(0, 6)
  const recentOutfits = outfits.slice(0, 4)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">衣橱仪表</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">总件</CardTitle>
            <Shirt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{items.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">搭配</CardTitle>
            <ShirtIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{outfits.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">收藏</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{favoriteCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">品类分布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => {
                const count = categoryCounts[cat] || 0
                const pct = items.length ? (count / items.length) * 100 : 0
                return (
                  <div key={cat} className="flex items-center gap-2 text-sm">
                    <span className="w-16">{CATEGORY_LABELS[cat]}</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-muted-foreground">{count}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">最近搭</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOutfits.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                还没有搭配，{' '}
                <Link href="/outfits/new" className="text-primary underline">
                  去创建一个</Link>
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {recentOutfits.map((o) => (
                  <Link key={o.id} href={`/outfits/${o.id}`}>
                    <div className="aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center text-xs text-muted-foreground border">
                      {o.thumbnail ? (
                        <img src={o.thumbnail} alt={o.name} className="w-full h-full object-cover" />
                      ) : (
                        o.name
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">最近添</CardTitle>
        </CardHeader>
        <CardContent>
          {recentItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              衣橱还是空的，{' '}
              <Link href="/closet/new" className="text-primary underline">
                上传第一件衣服</Link>
            </p>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {recentItems.map((item) => (
                <Link key={item.id} href={`/closet/${item.id}`}>
                  <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden border">
                    <img
                      src={item.imageData}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
