import type { SuburbStat } from '@/types'

type Props = { stat: SuburbStat }

function formatPrice(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}m`
  return `$${(n / 1000).toFixed(0)}k`
}

function formatChange(n: number) {
  const sign = n >= 0 ? '+' : ''
  return `${sign}${n.toFixed(1)}%`
}

export function SuburbStatCard({ stat }: Props) {
  const changePositive = stat.yearOnYearChange >= 0
  const updatedFormatted = new Date(stat.updatedAt).toLocaleDateString('en-NZ', {
    month: 'short',
    year: 'numeric',
  })

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-brand-dark">{stat.suburb}</h3>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            changePositive
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {formatChange(stat.yearOnYearChange)} YoY
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-gray-400">Median price</span>
          <span className="text-sm font-semibold text-brand-dark">
            {formatPrice(stat.medianSalePrice)}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-gray-400">Days on market</span>
          <span className="text-sm font-semibold text-brand-dark">
            {stat.medianDaysOnMarket}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-gray-400">Sales (qtr)</span>
          <span className="text-sm font-semibold text-brand-dark">
            {stat.salesVolume}
          </span>
        </div>
      </div>

      <p className="text-xs text-gray-400">Updated {updatedFormatted} · REINZ</p>
    </div>
  )
}
