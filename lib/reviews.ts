import type { Review } from '@/types'

const S3_URL = 'https://layne-website-reviews.s3.ap-southeast-2.amazonaws.com/reviews.json'

type S3Review = {
  author: string
  rating: number
  body: string
  date: string
  reviewType: string
  reviewUrl: string
  imageUrl: string
  isRecommended: boolean
}

export async function getReviews(
  skip = 0,
  take = 100
): Promise<{ reviews: Review[]; total: number } | null> {
  try {
    const res = await fetch(S3_URL, { next: { revalidate: 21600 } })
    if (!res.ok) return null
    const all: S3Review[] = await res.json()
    const reviews = all.slice(skip, skip + take).map((r, i) => ({
      id: `s3-${i}`,
      source: 's3' as const,
      author: r.author,
      rating: r.rating,
      body: r.body,
      date: r.date,
      reviewType: r.reviewType,
      reviewUrl: r.reviewUrl,
      imageUrl: r.imageUrl,
      isRecommended: r.isRecommended,
    }))
    return { reviews, total: all.length }
  } catch {
    return null
  }
}
