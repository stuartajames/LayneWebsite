import { defineField, defineType } from 'sanity'

export const suburbStatSchema = defineType({
  name: 'suburbStat',
  title: 'Suburb Statistics',
  type: 'document',
  fields: [
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
      name: 'medianSalePrice',
      title: 'Median Sale Price (NZD)',
      type: 'number',
      description: 'From REINZ monthly report',
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: 'medianDaysOnMarket',
      title: 'Median Days on Market',
      type: 'number',
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: 'salesVolume',
      title: 'Quarterly Sales Volume',
      type: 'number',
      description: 'Number of sales in the quarter — from REINZ',
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: 'yearOnYearChange',
      title: 'Year-on-Year Price Change (%)',
      type: 'number',
      description: 'Positive = growth, negative = decline',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Data Updated',
      type: 'date',
      description: 'Date of the REINZ report this data is from',
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: 'suburb', subtitle: 'updatedAt' },
  },
})
