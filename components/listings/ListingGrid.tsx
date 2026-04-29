'use client'

import { useState } from 'react'
import type { Listing } from '@/types'
import { ListingCard } from './ListingCard'

type Props = { listings: Listing[] }

export function ListingGrid({ listings }: Props) {
  const forSale = listings.filter((l) => l.status === 'for-sale' || l.status === 'for-rent')
  const sold = listings.filter((l) => l.status === 'sold' || l.status === 'leased')

  const tabs = [
    ...(forSale.length > 0 ? [{ id: 'for-sale', label: 'For Sale', items: forSale }] : []),
    ...(sold.length > 0 ? [{ id: 'sold', label: 'Recently Sold', items: sold }] : []),
  ]

  const defaultTab = forSale.length > 0 ? 'for-sale' : 'sold'
  const [active, setActive] = useState(defaultTab)

  if (tabs.length === 0) {
    return (
      <p className="py-12 text-center text-gray-500">No listings at the moment — check back soon.</p>
    )
  }

  const current = tabs.find((t) => t.id === active) ?? tabs[0]

  return (
    <div className="flex flex-col gap-6">
      {tabs.length > 1 && (
        <div className="flex gap-1 rounded-xl bg-gray-100 p-1 sm:self-start">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                active === tab.id
                  ? 'bg-white text-brand-dark shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {current.items.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  )
}
