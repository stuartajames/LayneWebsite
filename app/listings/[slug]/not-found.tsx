import Link from 'next/link'

export default function ListingNotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="text-2xl font-bold text-brand-dark">
        This property is no longer available
      </h1>
      <p className="mt-2 text-gray-500">
        It may have been sold, leased, or the listing has been removed.
      </p>
      <Link
        href="/listings"
        className="mt-6 rounded-full bg-brand-gold px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-gold-dark"
      >
        View current listings
      </Link>
    </main>
  )
}
