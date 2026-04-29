import type { Listing, SuburbStat } from '@/types'

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

export const MOCK_SUBURB_STATS: SuburbStat[] = [
  { suburb: 'Broadmeadows',   medianSalePrice: 710000, medianDaysOnMarket: 38, salesVolume: 8,  yearOnYearChange: -2.1, updatedAt: '2026-03-31' },
  { suburb: 'Churton Park',   medianSalePrice: 825000, medianDaysOnMarket: 32, salesVolume: 18, yearOnYearChange:  1.4, updatedAt: '2026-03-31' },
  { suburb: 'Glenside',       medianSalePrice: 760000, medianDaysOnMarket: 35, salesVolume: 6,  yearOnYearChange: -0.8, updatedAt: '2026-03-31' },
  { suburb: 'Grenada North',  medianSalePrice: 745000, medianDaysOnMarket: 40, salesVolume: 10, yearOnYearChange:  0.5, updatedAt: '2026-03-31' },
  { suburb: 'Grenada Village', medianSalePrice: 720000, medianDaysOnMarket: 42, salesVolume: 7, yearOnYearChange: -1.2, updatedAt: '2026-03-31' },
  { suburb: 'Johnsonville',   medianSalePrice: 780000, medianDaysOnMarket: 30, salesVolume: 24, yearOnYearChange:  2.3, updatedAt: '2026-03-31' },
  { suburb: 'Khandallah',     medianSalePrice: 920000, medianDaysOnMarket: 28, salesVolume: 14, yearOnYearChange:  3.1, updatedAt: '2026-03-31' },
  { suburb: 'Newlands',       medianSalePrice: 755000, medianDaysOnMarket: 34, salesVolume: 20, yearOnYearChange:  0.9, updatedAt: '2026-03-31' },
  { suburb: 'Ngaio',          medianSalePrice: 895000, medianDaysOnMarket: 29, salesVolume: 12, yearOnYearChange:  2.7, updatedAt: '2026-03-31' },
  { suburb: 'Raroa',          medianSalePrice: 870000, medianDaysOnMarket: 31, salesVolume: 9,  yearOnYearChange:  1.8, updatedAt: '2026-03-31' },
  { suburb: 'Tawa',           medianSalePrice: 720000, medianDaysOnMarket: 36, salesVolume: 28, yearOnYearChange: -0.4, updatedAt: '2026-03-31' },
  { suburb: 'Wadestown',      medianSalePrice: 1050000, medianDaysOnMarket: 26, salesVolume: 8, yearOnYearChange:  4.2, updatedAt: '2026-03-31' },
]
