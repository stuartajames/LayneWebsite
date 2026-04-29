import type { ReviewAggregate } from '@/types'
import { StarRating } from '@/components/shared/StarRating'

type Props = { aggregate: ReviewAggregate | null }

export function ReviewSummaryBar({ aggregate }: Props) {
  if (!aggregate) return null

  return (
    <div className="flex items-center gap-4 rounded-lg bg-white px-6 py-4 shadow-sm ring-1 ring-black/5">
      <StarRating rating={aggregate.overallStars} size="lg" />
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-bold text-brand-dark">
          {aggregate.overallStars.toFixed(1)}
        </span>
        <span className="text-sm text-gray-500">/ 5</span>
      </div>
      <div className="h-5 w-px bg-gray-200" aria-hidden="true" />
      <span className="text-sm text-gray-600">
        {aggregate.reviewCount.toLocaleString()} reviews
      </span>
      <a
        href={aggregate.profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="ml-auto text-sm font-medium text-brand-gold hover:text-brand-gold-dark transition-colors"
      >
        View on RateMyAgent →
      </a>
    </div>
  )
}
