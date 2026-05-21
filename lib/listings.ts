import type { Listing } from '@/types'
import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from './sanity'

const HOMES_AGENT_ID =
  process.env.HOMES_AGENT_ID ?? '9680e0f5-4902-4c9b-a5fc-6f59511c85b6'

const builder = imageUrlBuilder(sanityClient)

function generateSlug(street: string, suburb: string): string {
  return `${street}-${suburb}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function toTitleCase(s: string): string {
  return s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
}

// ---- homes.co.nz ----

interface HomesCard {
  id: string
  state: number // 0 = active/for-sale
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

function mapHomesListing(card: HomesCard): Listing {
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

export async function getHomesListings(): Promise<Listing[]> {
  try {
    const res = await fetch(
      `https://gateway.homes.co.nz/agents/${HOMES_AGENT_ID}/listings`,
      { next: { revalidate: 21600 } }
    )
    if (!res.ok) return []
    const data = await res.json()
    const cards: HomesCard[] = data.cards ?? []
    return cards.map(mapHomesListing)
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
  const homes = await getHomesListings()
  if (homes.length > 0) return sortListings(homes)
  return sortListings(await getSanityListings())
}

function sortListings(listings: Listing[]): Listing[] {
  return listings.sort((a, b) => {
    const priority = (s: Listing['status']) =>
      s === 'for-sale' || s === 'for-rent' ? 0 : 1
    const diff = priority(a.status) - priority(b.status)
    if (diff !== 0) return diff
    if (a.soldAt && b.soldAt) return b.soldAt.localeCompare(a.soldAt)
    return 0
  })
}
