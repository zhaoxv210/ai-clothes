
import { Link, useLocation } from 'wouter'
import { cn } from '@/lib/utils'
import {
  Shirt,
  ShirtIcon,
  Sparkles,
  Calendar,
  Home,
  Sun,
  Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const navItems = [
  { href: '/', label: '仪表盘', icon: Home },
  { href: '/closet', label: '我的衣橱', icon: Shirt },
  { href: '/outfits', label: '我的搭配', icon: ShirtIcon },
  { href: '/today', label: '今日穿搭', icon: Sun },
  { href: '/calendar', label: '穿搭日历', icon: Calendar },
]

export function Sidebar({ open }: { open: boolean }) {
  const [pathname] = useLocation()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-full bg-card border-r border-border transition-all duration-300 flex flex-col',
        open ? 'w-56' : 'w-0 -translate-x-full'
      )}
    >
      <div className="flex items-center gap-2 px-4 h-14 shrink-0">
        <Sparkles className="h-5 w-5 text-primary" />
        {open && <span className="font-semibold text-lg">AI 衣橱</span>}
      </div>

      <Separator />

      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={active ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-3"
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      <Separator />

      <div className="p-2">
        <Link href="/closet/new">
          <Button className="w-full justify-start gap-3">
            <Plus className="h-4 w-4" />
            添加衣服
          </Button>
        </Link>
      </div>
    </aside>
  )
}
