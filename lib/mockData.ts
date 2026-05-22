import type { Listing } from '@/types'

export const MOCK_LISTINGS: Listing[] = [
  {
    id: 'mock-listing-1',
    slug: '42-broderick-road-johnsonville',
    address: {
      street: '42 Broderick Road',
      suburb: 'Johnsonville',
      city: 'Wellington',
      postcode: '6037',
    },
    status: 'for-sale',
    price: 795000,
    priceDisplay: 'Offers over $795,000',
    bedrooms: 3,
    bathrooms: 2,
    carSpaces: 1,
    images: [],
    description:
      'A warm and inviting family home positioned in one of Johnsonville\'s most sought-after streets. Featuring generous living spaces across two levels, a sunny north-facing deck, and a low-maintenance garden — this property is perfect for growing families or investors. Walking distance to Johnsonville train station and local schools.',
    inspections: [
      { date: '2026-05-03', time: '11:00–11:30am' },
      { date: '2026-05-10', time: '11:00–11:30am' },
    ],
    listedAt: '2026-04-20',
  },
  {
    id: 'mock-listing-2',
    slug: '15-awarua-street-ngaio',
    address: {
      street: '15 Awarua Street',
      suburb: 'Ngaio',
      city: 'Wellington',
      postcode: '6035',
    },
    status: 'sold',
    price: 985000,
    priceDisplay: 'Sold $985,000',
    bedrooms: 4,
    bathrooms: 2,
    carSpaces: 2,
    images: [],
    description:
      'A beautifully presented character home blending original features with modern updates. Set on a well-established section with stunning bush views, double garaging, and an easy flow to a private outdoor entertaining area. Sold by tender within three weeks.',
    inspections: [],
    listedAt: '2026-03-01',
    soldAt: '2026-03-22',
  },
  {
    id: 'mock-listing-3',
    slug: '8-khandallah-road-khandallah',
    address: {
      street: '8 Khandallah Road',
      suburb: 'Khandallah',
      city: 'Wellington',
      postcode: '6035',
    },
    status: 'sold',
    price: 850000,
    priceDisplay: 'Sold $850,000',
    bedrooms: 3,
    bathrooms: 1,
    carSpaces: 1,
    images: [],
    description:
      'A classic Khandallah villa with high ceilings, native timber floors, and a sun-drenched garden. Renovated kitchen and bathroom, with a separate laundry and off-street parking. Achieved $45,000 above the CV in a competitive multi-offer situation.',
    inspections: [],
    listedAt: '2026-02-10',
    soldAt: '2026-03-01',
  },
]

