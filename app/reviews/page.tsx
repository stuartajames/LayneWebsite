import type { Metadata } from 'next'
import type { Review } from '@/types'
import { getReviewAggregate, getReviews } from '@/lib/reviews'
import { sanityClient } from '@/lib/sanity'
import { ReviewSummaryBar } from '@/components/reviews/ReviewSummaryBar'
import { ReviewFeed } from '@/components/reviews/ReviewFeed'

export const revalidate = 21600

export const metadata: Metadata = {
  title: 'Client Reviews | Layne Hughes',
  description:
    "Read reviews from Layne Hughes' clients across Wellington's northern suburbs.",
}

const TESTIMONIALS_QUERY = `
  *[_type == "testimonial"] | order(date desc) {
    _id,
    author,
    rating,
    body,
    date
  }
`

type SanityTestimonial = {
  _id: string
  author: string
  rating: number
  body: string
  date: string
}

export default async function ReviewsPage() {
  const [aggregate, rmaResult] = await Promise.all([
    getReviewAggregate(),
    getReviews(0, 6),
  ])

  let initialReviews: Review[]
  let total: number

  if (rmaResult && rmaResult.reviews.length > 0) {
    initialReviews = rmaResult.reviews
    total = rmaResult.total
  } else {
    const testimonials: SanityTestimonial[] = await sanityClient
      .fetch(TESTIMONIALS_QUERY)
      .catch(() => [])
    initialReviews = testimonials.map((t) => ({
      id: t._id,
      source: 'sanity-testimonial' as const,
      author: t.author,
      rating: t.rating,
      body: t.body,
      date: t.date,
    }))
    total = testimonials.length
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-brand-dark">
        Client Reviews
      </h1>
      <p className="mb-8 text-gray-500">
        What Layne's clients say about buying and selling in Wellington's
        northern suburbs.
      </p>

      <div className="mb-8">
        <ReviewSummaryBar aggregate={aggregate} />
      </div>

      <ReviewFeed initialReviews={initialReviews} total={total} />
    </main>
  )
}
