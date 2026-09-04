import {
  HeadContent,
  Scripts,
  createRootRoute,
  Link,
  useLocation,
  useNavigate,
} from '@tanstack/react-router'
import { Dumbbell, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Gym Tracker',
      },
      {
        name: 'description',
        content: 'Log workout sessions, build routines and track nutrition in one place.',
      },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Anton&family=Barlow:wght@400;500;600;700;800&display=swap',
      },
    ],
  }),
  shellComponent: RootDocument,
})

const navLinks = [
  { to: '/', label: 'Overview' },
  { to: '/workouts', label: 'Workouts' },
  { to: '/routines', label: 'Routines' },
  { to: '/nutrition', label: 'Nutrition' },
] as const

function isActive(pathname: string, to: string) {
  return to === '/' ? pathname === '/' : pathname.startsWith(to)
}

function SiteHeader() {
  const pathname = useLocation({ select: (location) => location.pathname })
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-ink-950/85 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          <Link
            to="/"
            className="flex items-center gap-2.5 font-display uppercase tracking-wide text-lg text-white"
          >
            <span className="bg-volt-400 text-ink-950 p-1.5 rounded-lg shadow-[0_6px_18px_-6px_rgba(217,248,74,0.6)]">
              <Dumbbell className="w-5 h-5" strokeWidth={2.5} />
            </span>
            Gym<span className="text-volt-400">Tracker</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-pill ${isActive(pathname, link.to) ? 'nav-pill-active' : ''}`}
                activeOptions={{ exact: link.to === '/' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="md:hidden btn-ghost px-3 py-2"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="md:hidden border-t border-white/10 bg-ink-950/95 px-4 pb-4 pt-2 shadow-2xl">
          {navLinks.map((link) => {
            const active = isActive(pathname, link.to)
            return (
              <button
                key={link.to}
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  navigate({ to: link.to })
                }}
                className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wider transition ${
                  active
                    ? 'bg-volt-400 text-ink-950'
                    : 'text-bone-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.label}
                {active && <span className="h-1.5 w-1.5 rounded-full bg-ink-950" />}
              </button>
            )
          })}
        </nav>
      )}
    </header>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="min-h-screen flex flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-white/10 py-6">
            <p className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-bone-700 uppercase tracking-[0.2em]">
              Gym Tracker — train hard, log everything
            </p>
          </footer>
        </div>
        <Scripts />
      </body>
    </html>
  )
}
