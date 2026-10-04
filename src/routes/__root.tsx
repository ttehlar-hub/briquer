import {
  HeadContent,
  Scripts,
  createRootRoute,
  Link,
  useLocation,
  useHydrated,
  useParams,
} from '@tanstack/react-router'
import { Dumbbell, Menu, Sun, UsersRound, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getFamilyMember } from '../lib/members'

import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'GymTibTracker' },
      {
        name: 'description',
        content: 'A space for the whole family. Choose your own workouts, routines and nutrition plan.',
      },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Anton&family=Manrope:wght@400;500;600;700;800&display=swap',
      },
    ],
  }),
  shellComponent: RootDocument,
})

const navLinks = [
  { to: '/plans/$member', label: 'Overview' },
  { to: '/plans/$member/workouts', label: 'Workouts' },
  { to: '/plans/$member/routines', label: 'Routines' },
  { to: '/plans/$member/nutrition', label: 'Nutrition' },
] as const

function SiteHeader({ light }: { light: boolean }) {
  const pathname = useLocation({ select: (location) => location.pathname })
  const params = useParams({ strict: false })
  const member = getFamilyMember(params.member)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const isActive = (to: string) => {
    if (!member) return false
    const path = to.replace('$member', member.id)
    return to === '/plans/$member'
      ? pathname.replace(/\/$/, '') === path
      : pathname.startsWith(path)
  }

  return (
    <header className={`site-header ${light ? 'site-header-light' : 'site-header-dark'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          <Link to="/" className="site-brand" aria-label="GymTibTracker home, choose a profile">
            <span className="brand-icon" aria-hidden="true">
              <Dumbbell className="h-5 w-5" strokeWidth={1.9} />
            </span>
            <span>Gym<span className={light ? 'text-[#52725b]' : 'text-volt-400'}>TibTracker</span></span>
          </Link>

          {member ? (
            <>
              <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    params={{ member: member.id }}
                    className={`header-nav-link ${isActive(link.to) ? 'header-nav-active' : ''}`}
                    activeOptions={{ exact: link.to === '/plans/$member' }}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-2">
                <Link to="/" className="profile-switch" aria-label={`Switch profile, currently ${member.name}`}>
                  <span className={`member-avatar member-avatar-${member.tone}`} aria-hidden="true">{member.initial}</span>
                  <span className="text-sm font-semibold">{member.name}</span>
                  <UsersRound className="ml-1 h-4 w-4 opacity-60" aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  onClick={() => setMenuOpen((open) => !open)}
                  className="mobile-menu-button lg:hidden"
                  aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={menuOpen}
                  aria-controls="mobile-navigation"
                >
                  {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </div>
            </>
          ) : (
            <p className="hidden sm:flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#62755e]">
              <Sun className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              Better, together
            </p>
          )}
        </div>
      </div>

      {member && menuOpen && (
        <nav id="mobile-navigation" className="mobile-navigation lg:hidden" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              params={{ member: member.id }}
              onClick={() => setMenuOpen(false)}
              className={`header-nav-link ${isActive(link.to) ? 'header-nav-active' : ''}`}
              activeOptions={{ exact: link.to === '/plans/$member' }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const hydrated = useHydrated()
  const pathname = useLocation({ select: (location) => location.pathname })
  const isHome = pathname === '/'
  const isJankaPlan = /^\/plans\/janka(?:\/|$)/.test(pathname)
  const light = isHome || /^\/plans\/[^/]+\/?$/.test(pathname)
  const bodyClassName = [
    light && 'light-surface',
    isHome && 'home-surface',
    isJankaPlan && 'janka-surface',
  ].filter(Boolean).join(' ')

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className={bodyClassName || undefined} data-hydrated={hydrated}>
        <div className="min-h-screen flex flex-col">
          <a className="skip-link" href="#main-content">Skip to content</a>
          <SiteHeader light={light} />
          <main id="main-content" className="flex-1">{children}</main>
          <footer className={`site-footer ${light ? 'site-footer-light' : ''}`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 text-xs">
              <p className="font-semibold">GymTibTracker</p>
              <p>A little stronger. Together.</p>
            </div>
          </footer>
        </div>
        <Scripts />
      </body>
    </html>
  )
}
