# Princess Easter Egg — Tasks

Last Updated: 2026-04-29
Status: **Not started**
Estimate: ~1 hour total

---

## Checklist

### Phase 1 — Core (required)

- [ ] **T1** Create `components/PrincessMode.tsx`
  - `'use client'` directive
  - Import `useSearchParams` from `next/navigation`
  - If `params.has('princess')` is false, return `null`
  - Return `<style dangerouslySetInnerHTML={{ __html: PRINCESS_CSS }} />`
  - CSS overrides: `--background #fff0f8`, `--foreground #6b0057`, `--brand-gold #ff69b4`, `--brand-gold-dark #e0408a`, `--brand-dark #4b0082`, `--brand-bg #fce4f5`
  - **Acceptance:** Component renders null on normal URLs, renders style tag on `?princess`

- [ ] **T2** Add `<Suspense><PrincessMode /></Suspense>` to `app/layout.tsx`
  - Import `Suspense` from `react`
  - Import `PrincessMode` from `@/components/PrincessMode`
  - Place inside `<html>` before `<body>` (or inside `<body>` before `<Header>`) — either works
  - **Acceptance:** `npm run build` passes with no TypeScript errors

### Phase 2 — Font Swap (required)

- [ ] **T3** Add Pacifico font override to `PRINCESS_CSS` constant in `PrincessMode.tsx`
  - `@import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');`
  - `body { font-family: 'Pacifico', cursive !important; }`
  - **Acceptance:** `?princess` pages use Pacifico font

### Phase 3 — Bonus Flourishes (optional)

- [ ] **T4** Add sparkle/unicorn decorations to headings via CSS `content:`
  - `h1::before { content: '✨ '; }` and `h1::after { content: ' 🦄'; }`
  - Same for `h2`
  - **Acceptance:** Page headings show sparkle+unicorn emoji in princess mode only

- [ ] **T5** Browser verification
  - Open `http://localhost:3000/?princess` — verify pink theme + Pacifico font on all pages
  - Open `http://localhost:3000/` — verify no change to normal theme
  - Open `http://localhost:3000/listings?princess` — verify theme persists across routes
  - **Acceptance:** All routes respond correctly to presence/absence of `?princess`

---

## Notes

- No new npm packages needed
- If `npm run build` errors about `useSearchParams` needing Suspense: ensure `<Suspense>` wraps only `<PrincessMode>`, not the whole layout
- The `@import` in an injected `<style>` tag causes a FOUC on the font — acceptable for an Easter egg
