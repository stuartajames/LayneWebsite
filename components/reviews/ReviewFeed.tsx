'use client'

import { useEffect, useState } from 'react'
import type { Review } from '@/types'
import { ReviewCard } from './ReviewCard'

const S3_URL = 'https://layne-website-reviews.s3.ap-southeast-2.amazonaws.com/reviews.json'

export function ReviewFeed() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(S3_URL)
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then((data) => {
        setReviews(data.map((r: Omit<Review, 'id' | 'source'> & { reviewType?: string }, i: number) => ({
          id: `s3-${i}`,
          source: 's3' as const,
          ...r,
        })))
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 rounded-lg bg-gray-100 animate-pulse" />
        ))}
      </div>
    )
  }

  if (error || reviews.length === 0) {
    return (
      <p className="py-8 text-center text-gray-500">No reviews available yet.</p>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  )
}
