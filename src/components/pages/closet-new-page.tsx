
import { useState, useRef } from 'react'
import { useLocation } from 'wouter'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { addClothingItem } from '@/hooks/use-db'
import { extractColors } from '@/lib/color-utils'
import {
  CATEGORY_LABELS,
  SEASON_LABELS,
  type Category,
  type Season,
} from '@/lib/types'
import { Upload, Camera, Loader2, CheckCircle2 } from 'lucide-react'
import { removeBackground } from '@imgly/background-removal'

export function ClosetNewPage() {
  const [, navigate] = useLocation()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState<'select' | 'processing' | 'info'>('select')
  const [progress, setProgress] = useState('')
  const [originalImage, setOriginalImage] = useState('')
  const [processedImage, setProcessedImage] = useState('')
  const [colors, setColors] = useState<string[]>([])

  const [name, setName] = useState('')
  const [category, setCategory] = useState<Category | ''>('')
  const [season, setSeason] = useState<Season[]>([])

  const [brand, setBrand] = useState('')

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string
      setOriginalImage(dataUrl)
      setStep('processing')
      setProgress('正在抠图...')

      try {
        const blob = await removeBackground(dataUrl, {
          progress: (p: string | number) => {
            const pct = typeof p === 'number' ? Math.round(p * 100) : p
            setProgress(`正在抠图... ${pct}%`)
          },
        })
        const processedUrl = URL.createObjectURL(blob)
        setProcessedImage(processedUrl)
        setProgress('正在提取颜色...')

        const extracted = await extractColors(processedUrl, 4)
        setColors(extracted)
        setProgress('')
        setStep('info')
      } catch (err) {
        setProgress('抠图失败，使用原图')
        setProcessedImage(dataUrl)
        const extracted = await extractColors(dataUrl, 4)
        setColors(extracted)
        setProgress('')
        setStep('info')
      }
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = 'image/*'
      fileInputRef.current.capture = 'environment'
      fileInputRef.current.click()
    }
  }

  const toggleSeason = (s: Season) => {
    setSeason((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))
  }

  const handleSave = async () => {
    if (!category || !name.trim()) return
    const finalImage = processedImage || originalImage

    await addClothingItem({
      name: name.trim(),
      category: category as Category,
      imageData: finalImage,
      originalImageData: originalImage,
      colors,
      season,
      brand,
      favorite: false,
      tags: [],
    })

    navigate('/closet')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">添加衣服</h1>

      {step === 'select' && (
        <Card
          className="border-dashed cursor-pointer hover:bg-muted/50 transition-colors"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
            <Upload className="h-12 w-12 text-muted-foreground" />
            <div className="text-center">
              <p className="font-medium">点击上传或拖拽图</p>
              <p className="text-sm text-muted-foreground mt-1">
                支持 JPG / PNG / WebP
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}>
                <Upload className="h-4 w-4 mr-2" />
                选择文件
              </Button>
              <Button variant="outline" onClick={(e) => { e.stopPropagation(); handleCameraCapture() }}>
                <Camera className="h-4 w-4 mr-2" />
                拍照
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFile(file)
              }}
            />
          </CardContent>
        </Card>
      )}

      {step === 'processing' && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="font-medium">{progress}</p>
            {originalImage && (
              <img
                src={originalImage}
                alt="原始图片"
                className="w-32 h-32 object-contain rounded-lg border opacity-50"
              />
            )}
          </CardContent>
        </Card>
      )}

      {step === 'info' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground block mb-1">原图</label>
              <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden border flex items-center justify-center">
                <img src={originalImage} alt="原图" className="w-full h-full object-contain" />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-1">抠图</label>
              <div className="aspect-[3/4] bg-[repeating-conic-gradient(#e5e5e5_0_25%,_#fff_0_50%)_50%/20px_20px] rounded-lg overflow-hidden border flex items-center justify-center relative">
                <CheckCircle2 className="absolute top-2 right-2 h-5 w-5 text-green-500 bg-white rounded-full" />
                <img src={processedImage} alt="抠图结果" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">名称 *</label>
              <Input
                placeholder="例如：白色衬衫"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">品类 *</label>
              <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择品类" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {CATEGORY_LABELS[cat]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">颜色（自动提取）</label>
              <div className="flex gap-2 mt-1">
                {colors.map((c, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border" style={{ backgroundColor: c }} title={c} />
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">季节（可多选）</label>
              <div className="flex gap-2 mt-1 flex-wrap">
                {(Object.keys(SEASON_LABELS) as Season[]).map((s) => (
                  <Badge
                    key={s}
                    variant={season.includes(s) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleSeason(s)}
                  >
                    {SEASON_LABELS[s]}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">品牌（选填</label>
              <Input
                placeholder="例如：Uniqlo"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => { setStep('select'); setOriginalImage(''); setProcessedImage('') }}>
              重新上传
            </Button>
            <Button onClick={handleSave} disabled={!name.trim() || !category}>
              保存到衣橱</Button>
          </div>
        </div>
      )}
    </div>
  )
}
