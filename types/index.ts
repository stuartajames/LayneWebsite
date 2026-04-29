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
  source: 'ratemyagent' | 'sanity-testimonial'
  author: string
  rating: number // 1–5
  body: string
  date: string
  isRecommended?: boolean
  reviewUrl?: string
}

export interface ReviewAggregate {
  overallStars: number
  reviewCount: number
  profileUrl: string
}

export interface SuburbStat {
  suburb: string
  medianSalePrice: number
  medianDaysOnMarket: number
  salesVolume: number      // quarterly — from REINZ monthly reports
  yearOnYearChange: number // percentage
  updatedAt: string        // displayed so users can see data freshness
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
