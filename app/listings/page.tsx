import type { Metadata } from 'next'
import { getListings } from '@/lib/listings'
import { ListingGrid } from '@/components/listings/ListingGrid'

export const metadata: Metadata = {
  title: 'Listings',
  description:
    "Browse Layne Hughes' current listings and recently sold properties in Wellington's northern suburbs.",
}

export default async function ListingsPage() {
  const listings = await getListings()
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-brand-dark">Listings</h1>
      <p className="mb-8 text-gray-500">
        Current and recently sold properties in Wellington&apos;s northern suburbs.
      </p>
      <ListingGrid listings={listings} />
    </main>
  )
}
