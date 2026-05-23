import type { Metadata } from 'next'
import { AgentProfile } from '@/components/about/AgentProfile'

export const metadata: Metadata = {
  title: 'About Layne',
  description:
    "Learn about Layne Hughes — licensed real estate consultant with Harcourts Wellington City, specialising in Wellington's northern suburbs.",
}

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <AgentProfile />
    </main>
  )
}
