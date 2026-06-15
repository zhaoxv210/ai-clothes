
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/use-store'

export function Header() {
  const toggleSidebar = useAppStore((s) => s.toggleSidebar)
  const sidebarOpen = useAppStore((s) => s.sidebarOpen)

  return (
    <header className="h-14 border-b border-border bg-card flex items-center px-4 gap-3 sticky top-0 z-30">
      <Button variant="ghost" size="icon" onClick={toggleSidebar}>
        <Menu className="h-5 w-5" />
      </Button>
      <span className="font-medium text-sm text-muted-foreground">
        AI 电子衣橱
      </span>
    </header>
  )
}
