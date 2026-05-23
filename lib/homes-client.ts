import type { Listing } from '@/types'

export const HOMES_AGENT_ID = '9680e0f5-4902-4c9b-a5fc-6f59511c85b6'
export const HOMES_URL = 'https://layne-website-reviews.s3.ap-southeast-2.amazonaws.com/listings.json'

export interface HomesCard {
  id: string
  state: number
  display_price: string
  price: number | null
  date: string
  property_details: {
    street: string
    suburb: string
    city: string
    num_bedrooms: number | null
    num_bathrooms: number | null
    num_car_spaces: number | null
    listing_images: string[]
    headline: string
  }
}

function generateSlug(street: string, suburb: string): string {
  return `${street}-${suburb}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function toTitleCase(s: string): string {
  return s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
}

export function mapHomesListing(card: HomesCard): Listing {
  const pd = card.property_details
  const street = pd.street ?? ''
  const suburb = pd.suburb ?? ''
  const status: Listing['status'] = card.state === 0 ? 'for-sale' : 'sold'
  const listedAt = card.date ? card.date.split('T')[0] : new Date().toISOString().split('T')[0]

  const priceDisplay = card.display_price?.trim() || 'Price on application'
  const priceMatch = priceDisplay.match(/\$\s*([\d,]+)/) ?? priceDisplay.match(/^([\d,]{4,})/)
  const price = priceMatch ? parseInt(priceMatch[1].replace(/,/g, ''), 10) : null

  return {
    id: card.id,
    slug: generateSlug(street, suburb),
    address: {
      street: toTitleCase(street),
      suburb: toTitleCase(suburb),
      city: toTitleCase(pd.city ?? 'Wellington'),
      postcode: '',
    },
    status,
    price,
    priceDisplay,
    bedrooms: pd.num_bedrooms ?? 0,
    bathrooms: pd.num_bathrooms ?? 0,
    carSpaces: pd.num_car_spaces ?? 0,
    images: (pd.listing_images ?? []).slice(0, 6),
    description: pd.headline ?? '',
    inspections: [],
    listedAt,
  }
}

export function sortListings(listings: Listing[]): Listing[] {
  return listings.sort((a, b) => {
    const priority = (s: Listing['status']) =>
      s === 'for-sale' || s === 'for-rent' ? 0 : 1
    const diff = priority(a.status) - priority(b.status)
    if (diff !== 0) return diff
    if (a.soldAt && b.soldAt) return b.soldAt.localeCompare(a.soldAt)
    return 0
  })
}

export async function fetchHomesListings(): Promise<Listing[]> {
  const res = await fetch(HOMES_URL)
  if (!res.ok) return []
  const cards: HomesCard[] = await res.json()
  return sortListings(cards.map(mapHomesListing))
}
