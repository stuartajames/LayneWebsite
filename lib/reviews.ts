import type { Review, ReviewAggregate } from '@/types'
import { getRmaToken } from './rmaToken'
import { MOCK_AGGREGATE, MOCK_REVIEWS } from './mockReviews'

const AGENT_CODE = process.env.LAYNE_AGENT_CODE
const API_BASE =
  process.env.RATEMYAGENT_API_URL ?? 'https://developers.ratemyagent.co.nz'

export async function getReviewAggregate(): Promise<ReviewAggregate | null> {
  if (!process.env.RATEMYAGENT_CLIENT_ID) return MOCK_AGGREGATE
  try {
    const token = await getRmaToken()
    const res = await fetch(`${API_BASE}/agent/${AGENT_CODE}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 21600 },
    })
    if (!res.ok) return null
    const data = await res.json()
    return {
      overallStars: data.OverallStars,
      reviewCount: data.ReviewCount,
      profileUrl: data.RmaAgentProfileUrl,
    }
  } catch {
    return null
  }
}

export async function getReviews(
  skip = 0,
  take = 6
): Promise<{ reviews: Review[]; total: number } | null> {
  if (!process.env.RATEMYAGENT_CLIENT_ID) {
    const page = MOCK_REVIEWS.slice(skip, skip + take)
    return { reviews: page, total: MOCK_REVIEWS.length }
  }
  try {
    const token = await getRmaToken()
    const url = new URL(`${API_BASE}/agent/${AGENT_CODE}/sales/reviews`)
    url.searchParams.set('skip', String(skip))
    url.searchParams.set('take', String(take))
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 21600 },
    })
    if (!res.ok) return null
    const data = await res.json()
    const reviews: Review[] = (data.Results ?? []).map(
      (r: {
        ReviewCode: { Code: string | null; Number: number } | null
        ReviewerName: string | null
        StarRating: number | null
        Description: string | null
        ReviewedOn: string
        IsRecommended: boolean
        ReviewUrl: string | null
      }) => ({
        id: r.ReviewCode?.Code ?? String(r.ReviewCode?.Number ?? ''),
        source: 'ratemyagent' as const,
        author: r.ReviewerName ?? 'Anonymous',
        rating: r.StarRating ?? 0,
        body: r.Description ?? '',
        date: r.ReviewedOn.split('T')[0],
        isRecommended: r.IsRecommended,
        reviewUrl: r.ReviewUrl ?? undefined,
      })
    )
    return { reviews, total: data.Total }
  } catch {
    return null
  }
}
