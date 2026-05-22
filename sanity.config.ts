import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'

export default defineConfig({
  name: 'layne-hughes-real-estate',
  title: 'Layne Hughes Real Estate',

  projectId: 'hw0zvsfo',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Agent Profile')
              .child(
                S.document()
                  .schemaType('agentProfile')
                  .documentId('agentProfile')
              ),
            S.divider(),
            S.documentTypeListItem('listing').title('Listings'),
            S.documentTypeListItem('suburbStat').title('Suburb Statistics'),
            S.documentTypeListItem('testimonial').title('Testimonials (fallback)'),
          ]),
    }),
    visionTool(),
  ],

  schema: { types: schemaTypes },
})
