'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/listings', label: 'Listings' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/market-insights', label: 'Market' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-tight" onClick={() => setOpen(false)}>
          <span className="text-base font-bold tracking-wide text-brand-dark">
            LAYNE HUGHES
          </span>
          <span className="text-xs font-medium tracking-widest text-brand-gold uppercase">
            Harcourts
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium transition-colors hover:text-brand-gold ${
                pathname.startsWith(href)
                  ? 'text-brand-gold'
                  : 'text-gray-600'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <Link
          href="/contact"
          className="hidden rounded-full bg-brand-gold px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-gold-dark md:inline-flex"
        >
          Contact Layne
        </Link>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="flex flex-col justify-center gap-1.5 p-2 md:hidden"
        >
          <span className={`block h-0.5 w-6 bg-brand-dark transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block h-0.5 w-6 bg-brand-dark transition-opacity ${open ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-6 bg-brand-dark transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-gray-100 bg-white px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-2" aria-label="Mobile navigation">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-brand-bg ${
                  pathname.startsWith(href)
                    ? 'text-brand-gold'
                    : 'text-gray-700'
                }`}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-brand-gold px-5 py-2.5 text-center text-sm font-semibold text-white hover:bg-brand-gold-dark"
            >
              Contact Layne
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
