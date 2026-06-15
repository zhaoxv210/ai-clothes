import { Router, Switch, Route } from 'wouter'
import { useState, useEffect, useCallback } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { useAppStore } from '@/store/use-store'
import { cn } from '@/lib/utils'
import { DashboardPage } from '@/components/pages/dashboard-page'
import { ClosetPage } from '@/components/pages/closet-page'
import { ClosetDetailPage } from '@/components/pages/closet-detail-page'
import { ClosetNewPage } from '@/components/pages/closet-new-page'
import { OutfitsPage } from '@/components/pages/outfits-page'
import { OutfitDetailPage } from '@/components/pages/outfit-detail-page'
import { OutfitNewPage } from '@/components/pages/outfit-new-page'
import { TodayPage } from '@/components/pages/today-page'
import { CalendarPage } from '@/components/pages/calendar-page'

const hashLocation = () => {
  return window.location.hash.replace(/^#/, '') || '/'
}

const hashNavigate = (to: string) => {
  window.location.hash = to
}

const useHashLocation: () => [string, (to: string) => void] = () => {
  const [loc, setLoc] = useState(hashLocation)

  useEffect(() => {
    const handler = () => setLoc(hashLocation())
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  const navigate = useCallback((to: string) => hashNavigate(to), [])
  return [loc, navigate]
}

export default function App() {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen)

  return (
    <Router hook={useHashLocation}>
      <div className="flex min-h-screen">
        <Sidebar open={sidebarOpen} />
        <div
          className={cn(
            'flex-1 flex flex-col transition-all duration-300',
            sidebarOpen ? 'ml-56' : 'ml-0'
          )}
        >
          <Header />
          <main className="flex-1 p-6">
            <Switch>
              <Route path="/" component={DashboardPage} />
              <Route path="/closet" component={ClosetPage} />
              <Route path="/closet/new" component={ClosetNewPage} />
              <Route path="/closet/:id" component={ClosetDetailPage} />
              <Route path="/outfits" component={OutfitsPage} />
              <Route path="/outfits/new" component={OutfitNewPage} />
              <Route path="/outfits/:id" component={OutfitDetailPage} />
              <Route path="/today" component={TodayPage} />
              <Route path="/calendar" component={CalendarPage} />
            </Switch>
          </main>
        </div>
      </div>
    </Router>
  )
}
