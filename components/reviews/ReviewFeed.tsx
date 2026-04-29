'use client'

import { useState } from 'react'
import type { Review } from '@/types'
import { ReviewCard } from './ReviewCard'

type Props = {
  initialReviews: Review[]
  total: number
}

export function ReviewFeed({ initialReviews, total }: Props) {
  const [reviews, setReviews] = useState(initialReviews)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const canLoadMore =
    reviews[0]?.source === 'ratemyagent' && reviews.length < total

  async function loadMore() {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch(
        `/api/reviews?skip=${reviews.length}&take=6`
      )
      if (!res.ok) throw new Error('Failed to load reviews')
      const data: { reviews: Review[]; total: number } = await res.json()
      setReviews((prev) => [...prev, ...data.reviews])
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  if (reviews.length === 0) {
    return (
      <p className="py-8 text-center text-gray-500">
        No reviews available yet.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {canLoadMore && (
        <div className="flex flex-col items-center gap-2">
          {error && (
            <p className="text-sm text-red-600">
              Could not load more reviews — please try again.
            </p>
          )}
          <button
            onClick={loadMore}
            disabled={loading}
            className="rounded-full border border-brand-gold px-6 py-2 text-sm font-medium text-brand-gold transition-colors hover:bg-brand-gold hover:text-white disabled:opacity-50"
          >
            {loading ? 'Loading…' : `Load more (${total - reviews.length} remaining)`}
          </button>
        </div>
      )}
    </div>
  )
}
