import { Router, Switch, Route, Link, useLocation } from 'wouter'
import { useState, useEffect, useCallback } from 'react'
import { HomePage } from '@/components/pages/home-page'
import { ClosetPage } from '@/components/pages/closet-page'
import { ClosetDetailPage } from '@/components/pages/closet-detail-page'
import { ClosetNewPage } from '@/components/pages/closet-new-page'

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

export default function App() {
  return (
    <Router hook={useHashLocation}>
      <div className="min-h-screen bg-background text-foreground pb-14">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/closet" component={ClosetPage} />
          <Route path="/closet/new" component={ClosetNewPage} />
          <Route path="/closet/:id" component={ClosetDetailPage} />
        </Switch>
        <TabBar />
      </div>
    </Router>
  )
}
