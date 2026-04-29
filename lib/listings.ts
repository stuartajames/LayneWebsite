import type { Listing } from '@/types'
import imageUrlBuilder from '@sanity/image-url'
import { getRmaToken } from './rmaToken'
import { sanityClient } from './sanity'

const AGENT_CODE = process.env.LAYNE_AGENT_CODE ?? 'layne-hughes-at845'
const API_BASE =
  process.env.RATEMYAGENT_API_URL ?? 'https://developers.ratemyagent.co.nz'

const builder = imageUrlBuilder(sanityClient)

// Swagger: ListingModel
interface RmaListingModel {
  CampaignCode: string | null
  StreetAddress: string | null
  Suburb: string | null
  State: string | null
  Postcode: string | null
  Status: string | null
  Price: string | null
  Bedrooms: number
  Bathrooms: number
  Carparks: number
  Images: { Type: string | null; Url: string | null; Order: number }[] | null
  Description: string | null
  ResultDate: string | null
  AuctionDate: string | null
}

function parsePrice(raw: string | null): { price: number | null; priceDisplay: string } {
  if (!raw) return { price: null, priceDisplay: 'Price on application' }
  const match = raw.match(/[\d,]+/)
  const price = match ? parseInt(match[0].replace(/,/g, ''), 10) : null
  return { price, priceDisplay: raw }
}

function generateSlug(street: string, suburb: string): string {
  return `${street}-${suburb}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function mapStatus(rmaStatus: string | null): Listing['status'] {
  switch (rmaStatus?.toLowerCase()) {
    case 'current':
    case 'active':
      return 'for-sale'
    case 'leased':
      return 'leased'
    case 'for rent':
    case 'for-rent':
    case 'forrent':
      return 'for-rent'
    default:
      return 'sold'
  }
}

function mapRmaListing(r: RmaListingModel): Listing {
  const { price, priceDisplay } = parsePrice(r.Price)
  const street = r.StreetAddress ?? ''
  const suburb = r.Suburb ?? ''
  const today = new Date().toISOString().split('T')[0]
  const resultDate = r.ResultDate ? r.ResultDate.split('T')[0] : null
  const status = mapStatus(r.Status)
  const isActive = status === 'for-sale' || status === 'for-rent'

  const images = (r.Images ?? [])
    .filter((img) => img.Url)
    .sort((a, b) => a.Order - b.Order)
    .slice(0, 6)
    .map((img) => img.Url as string)

  const inspections: Listing['inspections'] = r.AuctionDate
    ? [{ date: r.AuctionDate.split('T')[0], time: 'Auction' }]
    : []

  return {
    id: r.CampaignCode ?? generateSlug(street, suburb),
    slug: generateSlug(street, suburb),
    address: { street, suburb, city: 'Wellington', postcode: r.Postcode ?? '' },
    status,
    price,
    priceDisplay,
    bedrooms: r.Bedrooms,
    bathrooms: r.Bathrooms,
    carSpaces: r.Carparks,
    images,
    description: r.Description ?? '',
    inspections,
    listedAt: resultDate ?? today,
    ...(isActive ? {} : { soldAt: resultDate ?? today }),
  }
}

export async function getRmaListings(): Promise<Listing[]> {
  if (!process.env.RATEMYAGENT_CLIENT_ID) return []
  try {
    const token = await getRmaToken()
    const PAGE_SIZE = 100
    let skip = 0
    const all: RmaListingModel[] = []

    while (true) {
      const url = new URL(`${API_BASE}/agent/${AGENT_CODE}/sales/listings`)
      url.searchParams.set('skip', String(skip))
      url.searchParams.set('take', String(PAGE_SIZE))
      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 21600 },
      })
      if (!res.ok) return []
      const data = await res.json()
      const results: RmaListingModel[] = data.Results ?? []
      all.push(...results)
      if (all.length >= data.Total || results.length < PAGE_SIZE) break
      skip += PAGE_SIZE
    }

    return all.map(mapRmaListing)
  } catch {
    return []
  }
}

export async function getSanityListings(): Promise<Listing[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw: any[] = await sanityClient.fetch(
      `*[_type == "listing"] | order(status asc, listedAt desc)`,
      {},
      { next: { tags: ['listings'] } }
    )
    return (raw ?? []).map((doc) => ({
      id: doc._id as string,
      slug: (doc.slug?.current as string) ?? '',
      address: {
        street: (doc.street as string) ?? '',
        suburb: (doc.suburb as string) ?? '',
        city: (doc.city as string) ?? 'Wellington',
        postcode: (doc.postcode as string) ?? '',
      },
      status: doc.status as Listing['status'],
      price: (doc.price as number | null) ?? null,
      priceDisplay: (doc.priceDisplay as string) ?? 'Price on application',
      bedrooms: (doc.bedrooms as number) ?? 0,
      bathrooms: (doc.bathrooms as number) ?? 0,
      carSpaces: (doc.carSpaces as number) ?? 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      images: (doc.images ?? []).map((img: any) =>
        builder.image(img).width(1280).format('webp').url()
      ),
      description: (doc.description as string) ?? '',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      inspections: (doc.inspections ?? []).map((ins: any) => ({
        date: ins.date as string,
        time: ins.time as string,
      })),
      listedAt: (doc.listedAt as string) ?? '',
      soldAt: (doc.soldAt as string | undefined) ?? undefined,
    }))
  } catch {
    return []
  }
}

export async function getListings(): Promise<Listing[]> {
  const rma = await getRmaListings()
  const listings = rma.length > 0 ? rma : await getSanityListings()

  return listings.sort((a, b) => {
    const priority = (s: Listing['status']) =>
      s === 'for-sale' || s === 'for-rent' ? 0 : 1
    const diff = priority(a.status) - priority(b.status)
    if (diff !== 0) return diff
    if (a.soldAt && b.soldAt) return b.soldAt.localeCompare(a.soldAt)
    return 0
  })
}
