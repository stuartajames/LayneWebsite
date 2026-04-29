import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-bold text-brand-dark">Privacy Policy</h1>
      <div className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-black/5">
        <p className="text-sm text-gray-500 italic">
          Privacy policy content to be provided by Layne Hughes. This page will be
          updated before launch to comply with the New Zealand Privacy Act 2020.
        </p>
      </div>
    </main>
  )
}
