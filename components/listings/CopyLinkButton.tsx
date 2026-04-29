'use client'

import { useState } from 'react'

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={copy}
      className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-brand-gold hover:text-brand-gold"
    >
      {copied ? 'Link copied!' : 'Copy link'}
    </button>
  )
}
