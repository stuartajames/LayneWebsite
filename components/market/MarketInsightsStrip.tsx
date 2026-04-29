import Link from 'next/link'
import type { SuburbStat } from '@/types'

type Props = { stats: SuburbStat[] }

function formatPrice(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}m`
  return `$${(n / 1000).toFixed(0)}k`
}

export function MarketInsightsStrip({ stats }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-xl font-bold text-brand-dark">Market Insights</h2>
        <Link
          href="/market-insights"
          className="text-sm font-medium text-brand-gold hover:text-brand-gold-dark transition-colors"
        >
          All suburbs →
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        {stats.map((stat) => {
          const changePositive = stat.yearOnYearChange >= 0
          return (
            <div
              key={stat.suburb}
              className="flex shrink-0 flex-col gap-1 rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5 w-44"
            >
              <span className="text-sm font-semibold text-brand-dark">{stat.suburb}</span>
              <span className="text-lg font-bold text-brand-dark">
                {formatPrice(stat.medianSalePrice)}
              </span>
              <span
                className={`text-xs font-medium ${
                  changePositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {changePositive ? '+' : ''}{stat.yearOnYearChange.toFixed(1)}% YoY
              </span>
              <span className="text-xs text-gray-400">{stat.medianDaysOnMarket} days avg</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
