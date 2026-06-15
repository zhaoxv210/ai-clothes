# AI 电子衣橱 · 乔布斯式重新设计 实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ] `）语法来跟踪进度。

**目标：** 将 AI 电子衣橱从多页面 web 应用简化为两屏桌面应用：今日穿搭（主页）和衣橱管理。删除 80% 的页面和组件，聚焦核心体验。

**架构：** 底层 tab 导航切换「今日穿搭」和「衣橱」两屏。所有其他页面（日历、搭配、仪表盘）删除。推荐逻辑用纯函数实现，无外部依赖。

**技术栈：** Vite + React + TypeScript + Tauri v2 + Dexie + Zustand + wouter + Tailwind CSS v4

---

## 文件结构

### 删除
| 文件 | 原因 |
|---|---|
| `src/components/pages/dashboard-page.tsx` | 旧首页，不再需要 |
| `src/components/pages/today-page.tsx` | 被新的 home-page 替代 |
| `src/components/pages/calendar-page.tsx` | 整个日历屏砍掉 |
| `src/components/pages/outfits-page.tsx` | 整个搭配页砍掉 |
| `src/components/pages/outfit-detail-page.tsx` | 搭配详情砍掉 |
| `src/components/pages/outfit-new-page.tsx` | 创建搭配砍掉 |
| `src/components/layout/sidebar.tsx` | 侧边栏替换为底栏 |
| `src/components/outfit/outfit-canvas.tsx` | 拖拽画布砍掉 |
| `src/components/outfit/mannequin.tsx` | 人台组件砍掉 |
| `src/components/closet/clothing-grid.tsx` | 被内联到 closet-page |
| `src/navigate.ts` | 不再需要导航工具函数 |

### 创建
| 文件 | 职责 |
|---|---|
| `src/components/pages/home-page.tsx` | 今日穿搭主屏：天气、推荐卡片、换一套/就穿这个、空白状态 |
| `src/hooks/use-recommendation.ts` | 推荐算法：按季节+品类筛选，随机不重复 |

### 重写/大幅修改
| 文件 | 变动 |
|---|---|
| `src/App.tsx` | 删除 sidebar import 和所有旧路由，替换为底栏双 tab + 两个页面路由 |
| `src/components/pages/closet-page.tsx` | 简化筛选，去除风格/季节筛选，内联网格代码，删除 clothing-grid 依赖 |

### 小改
| 文件 | 变动 |
|---|---|
| `src/components/pages/closet-detail-page.tsx` | 删除编辑表单（保留全屏展示），删除确认弹窗改为 toast 撤销（保留 tsx 结构但简化） |
| `src/components/pages/closet-new-page.tsx` | 减少表单字段：删除"风格"字段 |

---

## 任务

### 任务 1：清理已删除页面 + 路由改写

**文件：**
- 删除：`src/components/pages/dashboard-page.tsx`
- 删除：`src/components/pages/today-page.tsx`
- 删除：`src/components/pages/calendar-page.tsx`
- 删除：`src/components/pages/outfits-page.tsx`
- 删除：`src/components/pages/outfit-detail-page.tsx`
- 删除：`src/components/pages/outfit-new-page.tsx`
- 删除：`src/components/layout/sidebar.tsx`
- 删除：`src/components/outfit/outfit-canvas.tsx`
- 删除：`src/components/outfit/mannequin.tsx`
- 删除：`src/components/closet/clothing-grid.tsx`
- 删除：`src/navigate.ts`
- 重写：`src/App.tsx`

- [ ] **步骤 1：删除所有标记删除的文件**

```bash
Remove-Item "src\components\pages\dashboard-page.tsx" -ErrorAction SilentlyContinue
Remove-Item "src\components\pages\today-page.tsx" -ErrorAction SilentlyContinue
Remove-Item "src\components\pages\calendar-page.tsx" -ErrorAction SilentlyContinue
Remove-Item "src\components\pages\outfits-page.tsx" -ErrorAction SilentlyContinue
Remove-Item "src\components\pages\outfit-detail-page.tsx" -ErrorAction SilentlyContinue
Remove-Item "src\components\pages\outfit-new-page.tsx" -ErrorAction SilentlyContinue
Remove-Item "src\components\layout\sidebar.tsx" -ErrorAction SilentlyContinue
Remove-Item "src\components\outfit\*" -ErrorAction SilentlyContinue
Remove-Item "src\components\closet\clothing-grid.tsx" -ErrorAction SilentlyContinue
Remove-Item "src\navigate.ts" -ErrorAction SilentlyContinue
```

- [ ] **步骤 2：重写 App.tsx——底栏双 tab + 双路由**

```tsx
import { Route, Switch, Link, useLocation } from 'wouter'
import { HomePage } from '@/components/pages/home-page'
import { ClosetPage } from '@/components/pages/closet-page'

function TabBar() {
  const [pathname] = useLocation()
  return (
    <div className="fixed bottom-0 left-0 right-0 h-14 bg-card border-t border-border flex items-center justify-around z-50">
      <Link href="/">
        <div
          className={`flex flex-col items-center gap-0.5 cursor-pointer px-6 py-1 transition-colors ${
            pathname === '/' ? 'text-foreground' : 'text-muted-foreground'
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
      </Link>
      <Link href="/closet">
        <div
          className={`flex flex-col items-center gap-0.5 cursor-pointer px-6 py-1 transition-colors ${
            pathname === '/closet' ? 'text-foreground' : 'text-muted-foreground'
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
      </Link>
    </div>
  )
}

export function App() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-14">
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/closet" component={ClosetPage} />
      </Switch>
      <TabBar />
    </div>
  )
}
```

- [ ] **步骤 3：验证 TypeScript 编译**

运行：`cd ai-clothes; npx tsc --noEmit 2>&1`
预期：引用已删除文件的旧 import 报错，但所有新文件还未创建所以可以接受暂时不干净。继续下一步。

---

### 任务 2：实现推荐算法 hook

**文件：**
- 创建：`src/hooks/use-recommendation.ts`

- [ ] **步骤 1：创建 use-recommendation 文件**

```typescript
import { useState, useCallback, useRef } from 'react'
import type { ClothingItem, Category } from '@/lib/types'

function getCurrentSeason(): string {
  const m = new Date().getMonth() + 1
  if (m >= 3 && m <= 5) return 'spring'
  if (m >= 6 && m <= 8) return 'summer'
  if (m >= 9 && m <= 11) return 'autumn'
  return 'winter'
}

function getRecommendation(
  items: ClothingItem[],
  todayOutfitIds: string[],
  lastPool: { tops: string[]; bottoms: string[]; shoes: string[] } | null
): {
  outfit: { top?: ClothingItem; bottom?: ClothingItem; shoes?: ClothingItem }
  pool: { tops: string[]; bottoms: string[]; shoes: string[] }
} {
  const season = getCurrentSeason()
  const seasonal = items.filter(
    (i) => !todayOutfitIds.includes(i.id) && i.season.includes(season)
  )
  const pool = seasonal.length >= 3 ? seasonal : items.filter((i) => !todayOutfitIds.includes(i.id))

  let tops = pool.filter((i) => i.category === 'top').map((i) => i.id)
  let bottoms = pool.filter((i) => i.category === 'bottom').map((i) => i.id)
  let shoes = pool.filter((i) => i.category === 'shoes').map((i) => i.id)

  if (lastPool) {
    tops = tops.filter((id) => !lastPool.tops.includes(id))
    bottoms = bottoms.filter((id) => !lastPool.bottoms.includes(id))
    shoes = shoes.filter((id) => !lastPool.shoes.includes(id))
    if (tops.length === 0 && bottoms.length === 0 && shoes.length === 0) {
      tops = pool.filter((i) => i.category === 'top').map((i) => i.id)
      bottoms = pool.filter((i) => i.category === 'bottom').map((i) => i.id)
      shoes = pool.filter((i) => i.category === 'shoes').map((i) => i.id)
    }
  }

  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]
  const topId = tops.length > 0 ? pick(tops) : undefined
  const bottomId = bottoms.length > 0 ? pick(bottoms) : undefined
  const shoeId = shoes.length > 0 ? pick(shoes) : undefined

  return {
    outfit: {
      top: topId ? pool.find((i) => i.id === topId) : undefined,
      bottom: bottomId ? pool.find((i) => i.id === bottomId) : undefined,
      shoes: shoeId ? pool.find((i) => i.id === shoeId) : undefined,
    },
    pool: {
      tops: tops.filter((id) => id !== topId),
      bottoms: bottoms.filter((id) => id !== bottomId),
      shoes: shoes.filter((id) => id !== shoeId),
    },
  }
}

export function useRecommendation(items: ClothingItem[]) {
  const [todayOutfitIds, setTodayOutfitIds] = useState<string[]>([])
  const poolRef = useRef<{ tops: string[]; bottoms: string[]; shoes: string[] } | null>(null)
  const [outfit, setOutfit] = useState<{
    top?: ClothingItem
    bottom?: ClothingItem
    shoes?: ClothingItem
  }>(() => getRecommendation(items, [], null).outfit)

  const shuffle = useCallback(() => {
    const result = getRecommendation(items, todayOutfitIds, poolRef.current)
    poolRef.current = result.pool
    setOutfit(result.outfit)
  }, [items, todayOutfitIds])

  const wearToday = useCallback(() => {
    const ids = [
      ...(outfit.top ? [outfit.top.id] : []),
      ...(outfit.bottom ? [outfit.bottom.id] : []),
      ...(outfit.shoes ? [outfit.shoes.id] : []),
    ]
    setTodayOutfitIds((prev) => [...prev, ...ids])
  }, [outfit])

  return { outfit, shuffle, wearToday }
}
```

---

### 任务 3：实现首页（今日穿搭）

**文件：**
- 创建：`src/components/pages/home-page.tsx`
- 依赖：`useClothingItems` (from `@/hooks/use-db`), `useRecommendation`

- [ ] **步骤 1：创建 home-page.tsx**

```tsx
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
```

---

### 任务 4：重写衣橱页面

**文件：**
- 重写：`src/components/pages/closet-page.tsx`

- [ ] **步骤 1：重写 closet-page.tsx——移除 season/style 筛选，内联网格，简化**

```tsx
import { useState } from 'react'
import { useClothingItems } from '@/hooks/use-db'
import { CATEGORY_LABELS, type Category } from '@/lib/types'
import { Link } from 'wouter'

export function ClosetPage() {
  const items = useClothingItems()
  const [, navigate] = useLocation()
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
              <div className="aspect-square bg-muted rounded-lg overflow-hidden border cursor-pointer hover:ring-1 hover:ring-foreground/20 transition-all">
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
```

注意：上面的 `deleteClothingItem` 导入目前不在 closet-page 中用到，但后面的任务会用到。可以先保留或删除导入，在后续任务中添加。

- [ ] **步骤 2：TypeScript 编译检查**

运行：`cd ai-clothes; npx tsc --noEmit 2>&1`
预期：clean，无报错

---

### 任务 5：简化详情页——删除确认弹窗，改为 toast 撤销

**文件：**
- 修改：`src/components/pages/closet-detail-page.tsx`

- [ ] **步骤 1：读取当前文件**

运行前先读取文件：`Read filePath="src/components/pages/closet-detail-page.tsx"`

- [ ] **步骤 2：简化详情页代码**

目标：
- 保留全屏大图 + 底部信息展示
- 删除编辑表单（只保留展示 + 编辑按钮跳转到 `/closet/new` 以编辑模式打开... 实际上，我们的添加流程是用独立页做的。简化方案：删除按钮 + toast 撤销，保留编辑按钮
- 编辑按钮跳转到 `/closet/new?id=xxx`（但需要修改 closet-new-page 支持编辑模式）

更务实的方案：详情页只做两件事——展示和删除。编辑功能去掉（够用即可）。

重写详情页：

```tsx
import { useState, useEffect } from 'react'
import { useParams, Link } from 'wouter'
import { useClothingItems, deleteClothingItem } from '@/hooks/use-db'
import { CATEGORY_LABELS, SEASON_LABELS } from '@/lib/types'

export function ClosetDetailPage() {
  const { id } = useParams()
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
```

- [ ] **步骤 3：TypeScript 编译检查**

运行：`cd ai-clothes; npx tsc --noEmit 2>&1`
预期：clean

---

### 任务 6：简化添加流程——删除"风格"字段

**文件：**
- 修改：`src/components/pages/closet-new-page.tsx`
- 依赖：`src/lib/types.ts`（需要确认 Style 类型是否可移除）

- [ ] **步骤 1：读取 closet-new-page.tsx 当前内容**

- [ ] **步骤 2：在表单中删除"风格"字段组**

查找文件中的 Style 相关部分（包含 STYLE_LABELS、style 状态、style 按钮组的 JSX 块），将其删除。

具体的移除内容：
- 删除 `useState<Style[]>([])` 的 style 相关 state 声明
- 删除 JSX 中"风格"相关的按钮组区块（在 season 选择下面、brand 输入上面）
- 删除 `STYLE_LABELS` 的 import 如果不再使用

- [ ] **步骤 3：TypeScript 编译检查**

运行：`cd ai-clothes; npx tsc --noEmit 2>&1`
预期：clean

---

### 任务 7：最终验证——构建 + 运行

- [ ] **步骤 1：全量构建**

运行：`cd ai-clothes; npm run build 2>&1`
预期：Vite 构建成功

- [ ] **步骤 2：Tauri 构建**

运行：`cd ai-clothes; npx tauri build --no-bundle 2>&1`
预期：Rust 编译成功，生成 exe

- [ ] **步骤 3：启动验证**

运行：`cd ai-clothes; Start-Process -FilePath "src-tauri\target\release\app.exe"`
预期：窗口打开，显示今日穿搭首页

- [ ] **步骤 4：Commit 最终代码**

```bash
git add -A
git commit -m "feat: redesign app with Jobs-inspired minimalism

- Strip down to 2 screens: Today's Outfit + Closet
- Remove calendar, outfits, dashboard, sidebar, navigate
- Add bottom tab navigation
- Add recommendation engine (season-aware, non-repeating)
- Simplify detail page with toast-based delete
- Remove style field from add form
- Delete 10+ unused components"
```
