import type { Metadata } from 'next'
import { ContactForm } from '@/components/shared/ContactForm'

export const metadata: Metadata = {
  title: 'Contact Layne',
  description:
    'Get in touch with Layne Hughes — book a free appraisal, arrange a viewing, or ask a question.',
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>
}) {
  const { subject } = await searchParams

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-brand-dark">Contact Layne</h1>
      <p className="mb-8 text-gray-500">
        Fill in the form below and Layne will be in touch within one business day.
        Prefer to call? Reach her directly on{' '}
        <a href="tel:02124686660" className="text-brand-gold hover:text-brand-gold-dark font-medium">
          021 246 8660
        </a>.
      </p>

      <ContactForm subject={subject} />
    </main>
  )
}
