import type { Listing } from '@/types'
import { HOMES_AGENT_ID, mapHomesListing, sortListings, HomesCard } from './homes-client'

const HOMES_DIRECT_URL = `https://gateway.homes.co.nz/agents/${HOMES_AGENT_ID}/listings`
import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from './sanity'

const builder = imageUrlBuilder(sanityClient)

export async function getHomesListings(): Promise<Listing[]> {
  try {
    const res = await fetch(HOMES_DIRECT_URL, { next: { revalidate: 21600 } })
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
