import Link from 'next/link'
import type { Listing } from '@/types'

const STATUS_STYLES: Record<Listing['status'], string> = {
  'for-sale': 'bg-brand-gold text-white',
  'sold':     'bg-gray-700 text-white',
  'for-rent': 'bg-blue-600 text-white',
  'leased':   'bg-gray-500 text-white',
}

const STATUS_LABELS: Record<Listing['status'], string> = {
  'for-sale': 'For Sale',
  'sold':     'Sold',
  'for-rent': 'For Rent',
  'leased':   'Leased',
}

type Props = { listing: Listing }

export function ListingCard({ listing }: Props) {
  const { address, status, priceDisplay, bedrooms, bathrooms, carSpaces, slug } = listing

  return (
    <Link
      href={`/listings/${slug}`}
      className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5 transition hover:shadow-md hover:ring-brand-gold/30"
    >
      {/* Image / placeholder */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200">
        <span className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
          Photo coming soon
        </span>
        <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[status]}`}>
          {STATUS_LABELS[status]}
        </span>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="font-semibold text-brand-dark group-hover:text-brand-gold transition-colors">
          {address.street}
        </p>
        <p className="text-sm text-gray-500">
          {address.suburb}, {address.city}
        </p>
        <p className="mt-1 text-sm font-medium text-gray-700">{priceDisplay}</p>
        <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
          <span>{bedrooms} bed</span>
          <span>{bathrooms} bath</span>
          {carSpaces > 0 && <span>{carSpaces} car</span>}
        </div>
      </div>
    </Link>
  )
}
