import Link from 'next/link'

const SOCIAL_LINKS = [
  { href: 'https://www.facebook.com/layneharcourts', label: 'Facebook' },
  { href: 'https://www.linkedin.com/in/layne-hughes-05b561213/', label: 'LinkedIn' },
  { href: 'https://www.instagram.com/laynehughes_harcourts/', label: 'Instagram' },
  { href: 'https://www.youtube.com/@laynehughes-realestate4068', label: 'YouTube' },
]

export function Footer() {
  return (
    <footer className="bg-brand-dark text-gray-400">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Identity */}
          <div className="flex flex-col gap-2">
            <span className="text-base font-bold tracking-wide text-white">
              LAYNE HUGHES
            </span>
            <span className="text-xs font-medium tracking-widest text-brand-gold uppercase">
              Harcourts Wellington City
            </span>
            <p className="mt-2 text-sm leading-relaxed">
              Your specialist for Wellington&apos;s northern suburbs — from Tawa
              to Wadestown.
            </p>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
              Get in touch
            </h3>
            <a
              href="tel:02124686660"
              className="text-sm hover:text-brand-gold transition-colors"
            >
              021 246 8660
            </a>
            <a
              href="mailto:layne@harcourts.co.nz"
              className="text-sm hover:text-brand-gold transition-colors"
            >
              layne@harcourts.co.nz
            </a>
            <a
              href="https://www.ratemyagent.co.nz/real-estate-agent/layne-hughes-at845/sales/overview"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:text-brand-gold transition-colors"
            >
              Reviews on RateMyAgent →
            </a>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
              Follow
            </h3>
            {SOCIAL_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:text-brand-gold transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} Layne Hughes. Licensed Real Estate
            Consultant. Harcourts Wellington City (Team Group Realty Ltd REAA 2008).
          </p>
          <Link href="/privacy" className="hover:text-brand-gold transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  )
}
