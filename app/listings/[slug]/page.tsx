import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getListings } from '@/lib/listings'
import { CopyLinkButton } from '@/components/listings/CopyLinkButton'

export async function generateStaticParams() {
  const listings = await getListings()
  return listings.map((l) => ({ slug: l.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const listings = await getListings()
  const listing = listings.find((l) => l.slug === slug)
  if (!listing) return {}
  return {
    title: `${listing.address.street}, ${listing.address.suburb}`,
    description: listing.description.slice(0, 160),
  }
}

const STATUS_LABELS: Record<string, string> = {
  'for-sale': 'For Sale',
  'sold': 'Sold',
  'for-rent': 'For Rent',
  'leased': 'Leased',
}

const STATUS_STYLES: Record<string, string> = {
  'for-sale': 'bg-brand-gold text-white',
  'sold': 'bg-gray-700 text-white',
  'for-rent': 'bg-blue-600 text-white',
  'leased': 'bg-gray-500 text-white',
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const listings = await getListings()
  const listing = listings.find((l) => l.slug === slug)
  if (!listing) notFound()

  const { address, status, priceDisplay, bedrooms, bathrooms, carSpaces, description, inspections, images } = listing

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Back */}
      <Link
        href="/listings"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-gold transition-colors"
      >
        ← Back to listings
      </Link>

      {/* Image gallery */}
      {images.length > 0 ? (
        <div className="mb-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {images.slice(0, 6).map((src, i) => (
            <div key={i} className={`relative overflow-hidden rounded-xl bg-gray-100 ${i === 0 ? 'aspect-[4/3] sm:col-span-2 lg:col-span-2' : 'aspect-[4/3]'}`}>
              <img src={src} alt={`${address.street} — photo ${i + 1}`} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-8 aspect-[16/7] rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-sm text-gray-400">
          Photos coming soon
        </div>
      )}

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Main info */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="flex flex-wrap items-start gap-3">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[status]}`}>
              {STATUS_LABELS[status]}
            </span>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-brand-dark sm:text-3xl">
              {address.street}
            </h1>
            <p className="text-gray-500">{address.suburb}, {address.city} {address.postcode}</p>
          </div>

          <p className="text-xl font-semibold text-gray-700">{priceDisplay}</p>

          <div className="flex gap-6 text-sm text-gray-600">
            <span className="flex flex-col items-center gap-0.5">
              <span className="text-xl font-bold text-brand-dark">{bedrooms}</span>
              <span>Bedrooms</span>
            </span>
            <span className="flex flex-col items-center gap-0.5">
              <span className="text-xl font-bold text-brand-dark">{bathrooms}</span>
              <span>Bathrooms</span>
            </span>
            {carSpaces > 0 && (
              <span className="flex flex-col items-center gap-0.5">
                <span className="text-xl font-bold text-brand-dark">{carSpaces}</span>
                <span>Car spaces</span>
              </span>
            )}
          </div>

          <div>
            <h2 className="mb-2 font-semibold text-brand-dark">About this property</h2>
            <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-line">{description}</p>
          </div>

          <div className="flex gap-2">
            <CopyLinkButton />
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          {/* Inspections */}
          {inspections.length > 0 && (
            <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-black/5">
              <h2 className="mb-3 font-semibold text-brand-dark">Open homes</h2>
              <ul className="flex flex-col gap-2">
                {inspections.map((ins, i) => (
                  <li key={i} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">
                      {new Date(ins.date).toLocaleDateString('en-NZ', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                    <span className="text-gray-500">{ins.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact CTA */}
          <div className="rounded-xl bg-brand-dark p-5 text-white">
            <h2 className="mb-1 font-semibold">Interested in this property?</h2>
            <p className="mb-4 text-sm text-gray-300">
              Contact Layne to arrange a private viewing or ask a question.
            </p>
            <Link
              href={`/contact?subject=${encodeURIComponent(`${address.street}, ${address.suburb}`)}`}
              className="block rounded-full bg-brand-gold px-5 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-gold-dark"
            >
              Enquire about this property
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
