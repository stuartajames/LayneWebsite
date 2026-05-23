'use client'

import { useEffect, useState } from 'react'
import type { Listing } from '@/types'
import { fetchHomesListings } from '@/lib/homes-client'
import { ListingCard } from './ListingCard'

export function ListingGrid() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHomesListings()
      .then(setListings)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    )
  }

  const forSale = listings.filter((l) => l.status === 'for-sale' || l.status === 'for-rent')
  const sold = listings.filter((l) => l.status === 'sold' || l.status === 'leased')

  const tabs = [
    ...(forSale.length > 0 ? [{ id: 'for-sale', label: 'For Sale', items: forSale }] : []),
    ...(sold.length > 0 ? [{ id: 'sold', label: 'Recently Sold', items: sold }] : []),
  ]

  if (tabs.length === 0) {
    return (
      <p className="py-12 text-center text-gray-500">No listings at the moment — check back soon.</p>
    )
  }

  return <ListingTabs tabs={tabs} />
}

function ListingTabs({
  tabs,
}: {
  tabs: { id: string; label: string; items: Listing[] }[]
}) {
  const [active, setActive] = useState(tabs[0].id)
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
