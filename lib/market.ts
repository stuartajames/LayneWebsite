import type { SuburbStat } from '@/types'
import { sanityClient } from './sanity'

export async function getSuburbStats(): Promise<SuburbStat[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw: any[] = await sanityClient.fetch(
      `*[_type == "suburbStat"] | order(suburb asc)`,
      {},
      { next: { tags: ['market'] } }
    )
    return (raw ?? []).map((doc) => ({
      suburb: doc.suburb as string,
      medianSalePrice: doc.medianSalePrice as number,
      medianDaysOnMarket: doc.medianDaysOnMarket as number,
      salesVolume: doc.salesVolume as number,
      yearOnYearChange: doc.yearOnYearChange as number,
      updatedAt: doc.updatedAt as string,
    }))
  } catch {
    return []
  }
}
