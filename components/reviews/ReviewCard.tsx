import type { Review } from '@/types'
import { StarRating } from '@/components/shared/StarRating'

type Props = { review: Review }

export function ReviewCard({ review }: Props) {
  const formatted = new Date(review.date).toLocaleDateString('en-NZ', {
    year: 'numeric',
    month: 'long',
  })

  return (
    <article className="flex flex-col gap-3 rounded-lg bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-brand-dark">{review.author}</span>
          <time
            dateTime={review.date}
            className="text-xs text-gray-400"
          >
            {formatted}
          </time>
        </div>
        {review.isRecommended && (
          <span className="shrink-0 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-green-200">
            Recommended
          </span>
        )}
      </div>
      <StarRating rating={review.rating} size="sm" />
      <p className="text-sm leading-relaxed text-gray-600">{review.body}</p>
      {review.reviewUrl && (
        <a
          href={review.reviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start text-xs font-medium text-brand-gold hover:text-brand-gold-dark transition-colors"
        >
          View on RateMyAgent →
        </a>
      )}
    </article>
  )
}
