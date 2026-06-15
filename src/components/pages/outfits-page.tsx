
import { Link } from 'wouter'
import { useOutfits } from '@/hooks/use-db'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, ShirtIcon } from 'lucide-react'

export function OutfitsPage() {
  const outfits = useOutfits()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">我的搭配</h1>
        <Link href="/outfits/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            新建搭配
          </Button>
        </Link>
      </div>

      {outfits.length === 0 ? (
        <div className="text-center py-20">
          <ShirtIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">还没有搭配，去创建第一个吧</p>
          <Link href="/outfits/new">
            <Button className="mt-4">开始搭</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {outfits.map((outfit) => (
            <Link key={outfit.id} href={`/outfits/${outfit.id}`}>
              <Card className="hover:shadow-md transition-shadow overflow-hidden">
                <div className="aspect-[2/3] bg-muted flex items-center justify-center relative">
                  {outfit.thumbnail ? (
                    <img src={outfit.thumbnail} alt={outfit.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <ShirtIcon className="h-8 w-8 text-muted-foreground/50" />
                      <span className="text-xs text-muted-foreground">
                        {outfit.items.length}件                      </span>
                    </div>
                  )}
                </div>
                <CardContent className="p-3">
                  <p className="font-medium truncate text-sm">{outfit.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(outfit.createdAt).toLocaleDateString('zh-CN')}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
