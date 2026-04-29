import type { NextRequest } from 'next/server'
import { getReviews } from '@/lib/reviews'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const skip = Math.max(0, parseInt(searchParams.get('skip') ?? '0', 10))
  const take = Math.min(24, Math.max(1, parseInt(searchParams.get('take') ?? '6', 10)))

  const result = await getReviews(skip, take)
  if (!result) {
    return Response.json({ error: 'Reviews unavailable' }, { status: 503 })
  }
  return Response.json(result)
}
