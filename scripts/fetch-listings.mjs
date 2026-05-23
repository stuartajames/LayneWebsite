/**
 * Fetches current listings from homes.co.nz and uploads them to S3.
 * Run during CI after AWS credentials are configured.
 *
 * Usage:
 *   node scripts/fetch-listings.mjs
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const HOMES_AGENT_ID = '9680e0f5-4902-4c9b-a5fc-6f59511c85b6'
const BUCKET = 'layne-website-reviews'
const KEY = 'listings.json'
const REGION = 'ap-southeast-2'

const res = await fetch(`https://gateway.homes.co.nz/agents/${HOMES_AGENT_ID}/listings`)
if (!res.ok) {
  console.error(`Failed to fetch listings: ${res.status} ${res.statusText}`)
  process.exit(1)
}

const data = await res.json()
const json = JSON.stringify(data.cards ?? [])

const s3 = new S3Client({ region: REGION })
await s3.send(
  new PutObjectCommand({
    Bucket: BUCKET,
    Key: KEY,
    Body: json,
    ContentType: 'application/json',
  })
)

console.log(`Uploaded ${(data.cards ?? []).length} listings to s3://${BUCKET}/${KEY}`)
