import Link from 'next/link'
import Image from 'next/image'
import { getReviewAggregate } from '@/lib/reviews'
import { MOCK_LISTINGS, MOCK_SUBURB_STATS } from '@/lib/mockData'
import { ReviewSummaryBar } from '@/components/reviews/ReviewSummaryBar'
import { ListingCard } from '@/components/listings/ListingCard'
import { MarketInsightsStrip } from '@/components/market/MarketInsightsStrip'

export const revalidate = 21600

export default async function Home() {
  const aggregate = await getReviewAggregate()
  const featuredListings = MOCK_LISTINGS.slice(0, 3)
  const stripStats = MOCK_SUBURB_STATS.slice(0, 6)

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-brand-dark text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-20 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div className="flex flex-1 flex-col gap-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-gold">
              Harcourts Wellington City
            </p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              Wellington&apos;s Northern Suburbs Specialist
            </h1>
            <p className="max-w-lg text-lg leading-relaxed text-gray-300">
              Helping families buy and sell in Khandallah, Ngaio, Johnsonville,
              Tawa and the surrounding suburbs — with local knowledge, honest
              advice, and a 4.9★ track record.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="rounded-full bg-brand-gold px-7 py-3 font-semibold text-white transition-colors hover:bg-brand-gold-dark"
              >
                Contact Layne
              </Link>
              <Link
                href="/listings"
                className="rounded-full border border-white/30 px-7 py-3 font-semibold text-white transition-colors hover:bg-white/10"
              >
                View listings
              </Link>
            </div>
          </div>
          {/* Hero photo */}
          <div className="flex-shrink-0 lg:w-80">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
              <Image
                src="/layne-hero.jpg"
                alt="Layne Hughes — Harcourts Wellington City"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 320px"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Review summary bar */}
      {aggregate && (
        <section className="bg-white border-b border-gray-100">
          <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
            <ReviewSummaryBar aggregate={aggregate} />
          </div>
        </section>
      )}

      {/* Listings teaser */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-2xl font-bold text-brand-dark">Current Listings</h2>
          <Link
            href="/listings"
            className="text-sm font-medium text-brand-gold hover:text-brand-gold-dark transition-colors"
          >
            All listings →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      {/* Market insights strip */}
      <section className="bg-brand-bg">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <MarketInsightsStrip stats={stripStats} />
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-brand-gold">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Thinking of buying or selling?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-white/90">
            Get a free, no-obligation appraisal of your property from a specialist
            who knows your neighbourhood.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-block rounded-full bg-white px-8 py-3 font-semibold text-brand-gold transition-colors hover:bg-brand-bg"
          >
            Book a free appraisal
          </Link>
        </div>
      </section>
    </div>
  )
}
