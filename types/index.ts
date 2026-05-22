export interface Listing {
  id: string
  slug: string
  address: {
    street: string
    suburb: string
    city: string
    postcode: string
  }
  status: 'for-sale' | 'sold' | 'leased' | 'for-rent'
  price: number | null
  priceDisplay: string
  bedrooms: number
  bathrooms: number
  carSpaces: number
  images: string[] // max 6, served via Sanity CDN through custom loader
  description: string
  inspections: { date: string; time: string }[]
  listedAt: string
  soldAt?: string
}

export interface Review {
  id: string
  source: 's3' | 'sanity-testimonial'
  author: string
  rating: number // 1–5
  body: string
  date: string
  reviewType?: string
  reviewUrl?: string
  imageUrl?: string
  isRecommended?: boolean
}


export interface AgentProfile {
  name: string
  bio: string
  photo: string
  yearsExperience: number
  phone: string
  email: string
  credentials: string[]
}
