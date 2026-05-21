import type { Metadata } from 'next'
import { getReviews } from '@/lib/reviews'
import { ReviewFeed } from '@/components/reviews/ReviewFeed'

export const revalidate = 21600

export const metadata: Metadata = {
  title: 'Client Reviews | Layne Hughes',
  description:
    "Read reviews from Layne Hughes' clients across Wellington's northern suburbs.",
}

export default async function ReviewsPage() {
  const result = await getReviews(0, 100)
  const reviews = result?.reviews ?? []

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-brand-dark">
        Client Reviews
      </h1>
      <p className="mb-8 text-gray-500">
        What Layne&apos;s clients say about buying and selling in Wellington&apos;s
        northern suburbs.
      </p>

      <ReviewFeed reviews={reviews} />
    </main>
  )
}
