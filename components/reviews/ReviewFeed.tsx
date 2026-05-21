'use client'

import type { Review } from '@/types'
import { ReviewCard } from './ReviewCard'

type Props = { reviews: Review[] }

export function ReviewFeed({ reviews }: Props) {
  if (reviews.length === 0) {
    return (
      <p className="py-8 text-center text-gray-500">
        No reviews available yet.
      </p>
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
