import type { Metadata } from 'next'
import { MOCK_SUBURB_STATS } from '@/lib/mockData'
import { SuburbStatCard } from '@/components/market/SuburbStatCard'

export const metadata: Metadata = {
  title: 'Market Insights',
  description:
    "Median sale prices, days on market, and year-on-year trends for Wellington's 12 northern suburbs — updated quarterly from REINZ data.",
}

export default function MarketInsightsPage() {
  const updatedFormatted = new Date(MOCK_SUBURB_STATS[0].updatedAt).toLocaleDateString('en-NZ', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-brand-dark">Market Insights</h1>
      <p className="mb-8 text-gray-500">
        Quarterly data for Wellington&apos;s northern suburbs from the REINZ monthly report.
        Last updated {updatedFormatted}.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_SUBURB_STATS.map((stat) => (
          <SuburbStatCard key={stat.suburb} stat={stat} />
        ))}
      </div>
      <p className="mt-8 text-xs text-gray-400">
        Source: Real Estate Institute of New Zealand (REINZ). Data reflects completed sales
        and is for informational purposes only.
      </p>
    </main>
  )
}
