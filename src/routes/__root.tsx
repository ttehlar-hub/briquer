import {
  HeadContent,
  Scripts,
  createRootRoute,
  Link,
} from '@tanstack/react-router'
import { Dumbbell } from 'lucide-react'

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

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-gray-900 text-white sticky top-0 z-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-8 h-16">
              <Link to="/" className="flex items-center gap-2 font-bold text-lg">
                <Dumbbell className="w-6 h-6 text-emerald-400" />
                Gym Tracker
              </Link>
              <nav className="flex gap-6 text-sm font-medium">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-gray-300 hover:text-white transition-colors"
                    activeProps={{ className: 'text-emerald-400' }}
                    activeOptions={{ exact: link.to === '/' }}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>
          {children}
        </div>
        <Scripts />
      </body>
    </html>
  )
}
