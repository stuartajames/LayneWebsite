import { defineField, defineType } from 'sanity'

export const agentProfileSchema = defineType({
  name: 'agentProfile',
  title: 'Agent Profile',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'text',
      rows: 8,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Profile Photo',
      type: 'image',
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'yearsExperience',
      title: 'Years of Experience',
      type: 'number',
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: (r) => r.required().email(),
    }),
    defineField({
      name: 'credentials',
      title: 'Credentials & Awards',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'e.g. "Harcourts Diamond Club", "Licensed Real Estate Agent (REAA 2008)"',
    }),
  ],
  preview: {
    select: { title: 'name', media: 'photo' },
  },
})
