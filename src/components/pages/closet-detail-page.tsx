
import { Link, useParams } from 'wouter'
import { useState } from 'react'
import { useNavigate } from '@/navigate'
import { useClothingItem, deleteClothingItem, updateClothingItem } from '@/hooks/use-db'
import { CATEGORY_LABELS, SEASON_LABELS, STYLE_LABELS } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Heart, Trash2, Pencil } from 'lucide-react'

export function ClosetDetailPage() {
  const params = useParams()
  const { id } = params as { id: string }
  const navigate = useNavigate()
  const item = useClothingItem(id)
  const [editing, setEditing] = useState(false)

  if (!item) {
    return <div className="text-center py-20 text-muted-foreground">衣服不存在或已删除</div>
  }

  const handleDelete = async () => {
    if (confirm('确定删除这件衣服吗？')) {
      await deleteClothingItem(id)
      navigate('/closet')
    }
  }

  const toggleFavorite = async () => {
    await updateClothingItem(id, { favorite: !item.favorite })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/closet">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold flex-1">{item.name}</h1>
        <Button variant="outline" size="icon" onClick={toggleFavorite}>
          <Heart className={`h-4 w-4 ${item.favorite ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
        <Button variant="outline" size="icon" onClick={() => setEditing(!editing)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="destructive" size="icon" onClick={handleDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-[3/4] bg-muted rounded-xl overflow-hidden flex items-center justify-center border">
          <img src={item.imageData} alt={item.name} className="w-full h-full object-contain" />
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm text-muted-foreground">品类</label>
            <p><Badge variant="outline">{CATEGORY_LABELS[item.category]}</Badge></p>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">颜色</label>
            <div className="flex gap-1.5 mt-1">
              {item.colors.map((c, i) => (
                <div key={i} className="w-6 h-6 rounded-full border" style={{ backgroundColor: c }} title={c} />
              ))}
            </div>
          </div>

          {item.season.length > 0 && (
            <div>
              <label className="text-sm text-muted-foreground">季节</label>
              <div className="flex gap-1.5 mt-1">
                {item.season.map((s) => (<Badge key={s} variant="secondary">{SEASON_LABELS[s]}</Badge>))}
              </div>
            </div>
          )}

          {item.style.length > 0 && (
            <div>
              <label className="text-sm text-muted-foreground">风格</label>
              <div className="flex gap-1.5 mt-1 flex-wrap">
                {item.style.map((s) => (<Badge key={s} variant="outline">{STYLE_LABELS[s]}</Badge>))}
              </div>
            </div>
          )}

          {item.brand && (
            <div>
              <label className="text-sm text-muted-foreground">品牌</label>
              <p>{item.brand}</p>
            </div>
          )}

          <div className="text-sm text-muted-foreground space-y-1">
            <p>穿过 {item.timesWorn} </p>
            <p>添加于{new Date(item.createdAt).toLocaleDateString('zh-CN')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
