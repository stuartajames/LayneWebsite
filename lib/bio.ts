import type { AgentProfile } from '@/types'
import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from './sanity'

const builder = imageUrlBuilder(sanityClient)

export async function getAgentProfile(): Promise<AgentProfile | null> {
  try {
    const doc = await sanityClient.fetch(
      `*[_type == "agentProfile"][0]`,
      {},
      { next: { tags: ['bio'] } }
    )
    if (!doc) return null
    return {
      name: doc.name as string,
      bio: doc.bio as string,
      photo: doc.photo
        ? builder.image(doc.photo).width(800).format('webp').url()
        : '',
      yearsExperience: doc.yearsExperience as number,
      phone: doc.phone as string,
      email: doc.email as string,
      credentials: (doc.credentials as string[]) ?? [],
    }
  } catch {
    return null
  }
}
