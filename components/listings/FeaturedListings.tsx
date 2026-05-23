'use client'

import { useEffect, useState } from 'react'
import type { Listing } from '@/types'
import { fetchHomesListings } from '@/lib/homes-client'
import { ListingCard } from './ListingCard'

export function FeaturedListings() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHomesListings()
      .then((all) => setListings(all.slice(0, 3)))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-64 rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    )
  }

  if (listings.length === 0) {
    return (
      <p className="py-8 text-center text-gray-400">No current listings — check back soon.</p>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  )
}
