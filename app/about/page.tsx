import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAgentProfile } from '@/lib/bio'

export const metadata: Metadata = {
  title: 'About Layne',
  description:
    "Learn about Layne Hughes — licensed real estate consultant with Harcourts Wellington City, specialising in Wellington's northern suburbs.",
}

const FALLBACK_CREDENTIALS = [
  'Licensed Real Estate Consultant (REAA 2008)',
  'Harcourts Wellington City — Top Performer',
  'Specialist in Wellington northern suburbs',
  '4.9★ average across 76 verified RateMyAgent reviews',
]

const FALLBACK_BIO = [
  "Layne Hughes is a licensed real estate consultant with Harcourts Wellington City, bringing genuine passion and deep local knowledge to every property transaction. Based in Wellington's northern suburbs, Layne has built a reputation for honest communication, meticulous preparation, and delivering outstanding results in any market.",
  "Whether you're selling the family home, searching for your next property, or wanting to understand what your home is worth, Layne provides the guidance and expertise to make the process as smooth as possible.",
  "With a 4.9-star average across 76 verified reviews on RateMyAgent, Layne's clients consistently highlight her professionalism, responsiveness, and ability to achieve results beyond expectations.",
]

const SUBURBS = [
  { name: 'Broadmeadows', x: 180, y: 60 },
  { name: 'Churton Park',  x: 155, y: 95 },
  { name: 'Glenside',      x: 200, y: 130 },
  { name: 'Grenada North', x: 120, y: 70 },
  { name: 'Grenada Village', x: 100, y: 100 },
  { name: 'Johnsonville',  x: 170, y: 135 },
  { name: 'Khandallah',    x: 230, y: 165 },
  { name: 'Newlands',      x: 140, y: 115 },
  { name: 'Ngaio',         x: 215, y: 190 },
  { name: 'Raroa',         x: 245, y: 195 },
  { name: 'Tawa',          x: 95,  y: 130 },
  { name: 'Wadestown',     x: 250, y: 225 },
]

export default async function AboutPage() {
  const profile = await getAgentProfile()
  const credentials = profile?.credentials?.length ? profile.credentials : FALLBACK_CREDENTIALS
  const bioParas = profile?.bio
    ? profile.bio.split('\n').filter(Boolean)
    : FALLBACK_BIO
  const photoSrc = profile?.photo || '/layne-hero.jpg'

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-2">
        {/* Photo + credentials */}
        <div className="flex flex-col gap-6">
          <div className="relative aspect-[3/4] max-w-sm overflow-hidden rounded-2xl">
            <Image
              src={photoSrc}
              alt="Layne Hughes — Harcourts Wellington City"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 384px"
            />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold text-brand-dark">Credentials</h2>
            <ul className="flex flex-col gap-2">
              {credentials.map((c) => (
                <li key={c} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold">✓</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bio + map */}
        <div className="flex flex-col gap-8">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-brand-gold">
              Harcourts Wellington City
            </p>
            <h1 className="mb-4 text-3xl font-bold text-brand-dark">Layne Hughes</h1>
            <div className="flex flex-col gap-4 text-sm leading-relaxed text-gray-600">
              {bioParas.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          {/* Northern suburbs SVG map */}
          <div>
            <h2 className="mb-3 font-semibold text-brand-dark">
              Area of expertise
            </h2>
            <div className="overflow-hidden rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5">
              <svg
                viewBox="0 0 360 300"
                className="w-full"
                aria-label="Map of Wellington's northern suburbs"
                role="img"
              >
                {/* Background shape suggesting Wellington/NZ landmass */}
                <path
                  d="M60,20 C80,15 130,10 180,18 C230,26 290,40 320,70
                     C340,90 345,120 335,155 C325,185 305,210 280,240
                     C260,260 240,275 220,285 C200,295 180,295 165,285
                     C145,272 130,250 118,228 C100,200 85,170 75,145
                     C62,115 52,80 60,20Z"
                  fill="#f0f4f0"
                  stroke="#d1d5db"
                  strokeWidth="1"
                />
                {/* Suburb dots */}
                {SUBURBS.map(({ name, x, y }) => (
                  <g key={name}>
                    <circle cx={x} cy={y} r="5" fill="#c9a84c" opacity="0.9" />
                    <text
                      x={x + 8}
                      y={y + 4}
                      fontSize="9"
                      fill="#374151"
                      fontFamily="system-ui, sans-serif"
                    >
                      {name}
                    </text>
                  </g>
                ))}
                {/* Wellington label */}
                <text
                  x="185"
                  y="270"
                  fontSize="10"
                  fill="#9ca3af"
                  fontFamily="system-ui, sans-serif"
                  textAnchor="middle"
                >
                  Wellington CBD
                </text>
              </svg>
            </div>
          </div>

          <Link
            href="/contact"
            className="self-start rounded-full bg-brand-gold px-7 py-3 font-semibold text-white transition-colors hover:bg-brand-gold-dark"
          >
            Get in touch with Layne
          </Link>
        </div>
      </div>
    </main>
  )
}
