/**
 * Scrapes all reviews from Layne Hughes' RateMyAgent profile.
 *
 * Because the site uses DataDome bot protection, this script opens a VISIBLE
 * browser window and waits for you to manually pass the "Slide right" CAPTCHA.
 * Once you're through it navigates and scrapes all pages automatically.
 *
 * Usage:
 *   node scripts/scrape-reviews.mjs
 *   node scripts/scrape-reviews.mjs --output reviews.json
 */

import { chromium } from 'playwright'
import { writeFileSync } from 'fs'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const PROFILE_URL =
  'https://www.ratemyagent.co.nz/real-estate-agent/layne-hughes-at845/sales/reviews'

const args = process.argv.slice(2)
const outputFile = args.includes('--output') ? args[args.indexOf('--output') + 1] : null

async function scrapeAllReviews() {
  // Connect to your already-running Chrome instance (started with --remote-debugging-port=9222)
  const browser = await chromium.connectOverCDP('http://localhost:9222')
  const context = browser.contexts()[0]
  const page = await context.newPage()
  const allReviews = []

  try {
    console.log('\nOpening browser...')
    await page.goto(PROFILE_URL, { waitUntil: 'domcontentloaded', timeout: 30_000 })

    // Check if DataDome CAPTCHA is present
    const captchaFrame = page.frameLocator('iframe[title="DataDome CAPTCHA"]')
    const hasCaptcha = await captchaFrame.locator('button').isVisible({ timeout: 3000 }).catch(() => false)

    if (hasCaptcha) {
      console.log('\n┌─────────────────────────────────────────────────────┐')
      console.log('│  ACTION REQUIRED                                    │')
      console.log('│                                                     │')
      console.log('│  A "Slide right to secure your access" CAPTCHA      │')
      console.log('│  has appeared in the browser window.                │')
      console.log('│                                                     │')
      console.log('│  Please solve it manually, then come back here.     │')
      console.log('│  The script will continue automatically once the    │')
      console.log('│  review page loads.                                 │')
      console.log('└─────────────────────────────────────────────────────┘\n')
    }

    // Wait until the review content appears (user solves CAPTCHA, page loads)
    console.log('Waiting for review page to load...')
    await page.waitForSelector(
      '[class*="review"], [class*="Review"], article',
      { timeout: 120_000 }  // 2 min for manual CAPTCHA
    )
    console.log('Review page loaded. Starting extraction...')

    let pageNum = 1
    while (true) {
      console.log(`  Scraping page ${pageNum}...`)

      const reviews = await page.evaluate(() => {
        const selectorSets = [
          '[data-testid="review-card"]',
          '[class*="review-card"]',
          '[class*="ReviewCard"]',
          'article[class*="review"]',
          'article',
        ]

        let cards = []
        for (const sel of selectorSets) {
          cards = Array.from(document.querySelectorAll(sel))
          if (cards.length > 0) break
        }

        return cards.map((card) => {
          // Rating — count rma-icon elements inside rma-star-rating
          const starEl = card.querySelector('rma-star-rating')
          const rating = starEl ? starEl.querySelectorAll('rma-icon').length : 0

          // Date — relative text in div.text-steel-70
          const date = card.querySelector('.text-steel-70')?.textContent?.trim() ?? ''

          // Body — p.line-clamp-5
          const body = card.querySelector('p.line-clamp-5')?.textContent?.trim() ?? ''

          // Title — aria-label on the review link (skip if it's just the agent name)
          const linkEl = card.querySelector('a[data-id="view-full-review"]')
          const title = linkEl?.getAttribute('aria-label') ?? ''

          // Review URL — for reference
          const reviewUrl = linkEl?.getAttribute('href') ?? ''

          // Reviewer names are not shown on this page
          const author = 'Anonymous'

          // Review type (Seller/Buyer)
          const reviewType = card.querySelector('.absolute.right-4')?.textContent?.trim() ?? ''

          // Property image
          const imageUrl = card.querySelector('img:not([aria-hidden])')?.getAttribute('src') ?? ''

          const isRecommended = true

          return { author, title, rating, body, date, reviewType, reviewUrl, imageUrl, isRecommended }
        })
      })

      const validReviews = reviews.filter((r) => r.body.length > 10)
      allReviews.push(...validReviews)
      console.log(`    Found ${validReviews.length} reviews (running total: ${allReviews.length})`)

      // Next page
      const nextBtn = page.locator('a[title="Next page"]').first()

      const isNextVisible = await nextBtn.isVisible({ timeout: 2000 }).catch(() => false)
      if (!isNextVisible) {
        console.log('  No more pages found.')
        break
      }

      const currentUrl = page.url()
      await nextBtn.click()
      await page.waitForURL(url => url.toString() !== currentUrl, { timeout: 15_000 })
      await page.waitForTimeout(1500)
      pageNum++
    }
  } finally {
    await page.close()
  }

  return allReviews
}

const reviews = await scrapeAllReviews()

console.log(`\nDone. Total reviews scraped: ${reviews.length}`)

const json = JSON.stringify(reviews, null, 2)

if (outputFile) {
  writeFileSync(outputFile, json)
  console.log(`Saved to ${outputFile}`)
}

console.log('Uploading to S3...')
const s3 = new S3Client({})
await s3.send(new PutObjectCommand({
  Bucket: 'layne-website-reviews',
  Key: 'reviews.json',
  Body: json,
  ContentType: 'application/json',
}))
console.log('Uploaded to s3://layne-website-reviews/reviews.json')
