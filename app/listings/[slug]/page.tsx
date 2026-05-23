import type { Metadata } from 'next'
import Link from 'next/link'
import { getListings } from '@/lib/listings'
import { ListingDetail } from '@/components/listings/ListingDetail'

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

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/listings"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-gold transition-colors"
      >
        ← Back to listings
      </Link>
      <ListingDetail slug={slug} />
    </main>
  )
}
