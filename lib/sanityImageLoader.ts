import type { ImageLoaderProps } from 'next/image'
import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from './sanity'

const builder = imageUrlBuilder(sanityClient)

// Custom next/image loader for Sanity CDN.
// Maps Next.js width/quality params to Sanity's image pipeline URL params.
// Required to avoid fetching originals and blowing the 10GB free-tier bandwidth cap.
export function sanityImageLoader({ src, width, quality }: ImageLoaderProps): string {
  return builder
    .image(src)
    .width(width)
    .quality(quality ?? 80)
    .format('webp')
    .url()
}
