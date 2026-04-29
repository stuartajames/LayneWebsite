import { defineField, defineType } from 'sanity'

export const listingSchema = defineType({
  name: 'listing',
  title: 'Listing',
  type: 'document',
  fields: [
    defineField({
      name: 'street',
      title: 'Street Address',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'suburb',
      title: 'Suburb',
      type: 'string',
      options: {
        list: [
          'Broadmeadows', 'Churton Park', 'Glenside', 'Grenada North',
          'Grenada Village', 'Johnsonville', 'Khandallah', 'Newlands',
          'Ngaio', 'Raroa', 'Tawa', 'Wadestown',
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
      initialValue: 'Wellington',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'postcode',
      title: 'Postcode',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'street', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'For Sale', value: 'for-sale' },
          { title: 'Sold', value: 'sold' },
          { title: 'For Rent', value: 'for-rent' },
          { title: 'Leased', value: 'leased' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'priceDisplay',
      title: 'Price Display Text',
      type: 'string',
      description: 'e.g. "Offers Over $850,000" or "By Negotiation"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (numeric, for sorting)',
      type: 'number',
      description: 'Numeric value for sort — not displayed directly',
    }),
    defineField({
      name: 'bedrooms',
      title: 'Bedrooms',
      type: 'number',
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: 'bathrooms',
      title: 'Bathrooms',
      type: 'number',
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: 'carSpaces',
      title: 'Car Spaces',
      type: 'number',
      initialValue: 0,
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: (r) => r.max(6).required(),
      description: 'Maximum 6 images. Upload at 1280px width max.',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 6,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'inspections',
      title: 'Inspection Times',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'date', title: 'Date', type: 'date' }),
            defineField({ name: 'time', title: 'Time', type: 'string', description: 'e.g. "1:00pm – 1:30pm"' }),
          ],
          preview: { select: { title: 'date', subtitle: 'time' } },
        },
      ],
    }),
    defineField({
      name: 'listedAt',
      title: 'Listed Date',
      type: 'date',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'soldAt',
      title: 'Sold Date',
      type: 'date',
    }),
  ],
  preview: {
    select: { title: 'street', subtitle: 'status', media: 'images.0' },
  },
  orderings: [
    { title: 'Listed (newest)', name: 'listedAtDesc', by: [{ field: 'listedAt', direction: 'desc' }] },
  ],
})
