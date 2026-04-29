import { defineField, defineType } from 'sanity'

export const testimonialSchema = defineType({
  name: 'testimonial',
  title: 'Testimonial (reviews fallback)',
  description: 'Shown on the site when RateMyAgent API credentials are unavailable. Add 3–5 testimonials from Layne\'s clients here.',
  type: 'document',
  fields: [
    defineField({
      name: 'author',
      title: 'Client Name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      options: {
        list: [
          { title: '⭐⭐⭐⭐⭐ 5 stars', value: 5 },
          { title: '⭐⭐⭐⭐ 4 stars', value: 4 },
          { title: '⭐⭐⭐ 3 stars', value: 3 },
        ],
        layout: 'radio',
      },
      initialValue: 5,
      validation: (r) => r.required().min(1).max(5),
    }),
    defineField({
      name: 'body',
      title: 'Review Text',
      type: 'text',
      rows: 4,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured (show on home page)',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'author', subtitle: 'date' },
  },
  orderings: [
    { title: 'Newest first', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] },
  ],
})
