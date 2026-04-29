# Princess Easter Egg — Plan

Last Updated: 2026-04-29

---

## Executive Summary

Add a hidden Easter egg: when `?princess` is present in any URL query string, override all default CSS with a princess/unicorn/pink theme. The site still functions identically — only the visual layer changes. Zero impact on production appearance for normal visitors.

---

## Current State Analysis

| Item | Detail |
|---|---|
| Framework | Next.js 15, App Router |
| Styling | Tailwind v4 + CSS custom properties in `app/globals.css` |
| CSS tokens | `--brand-gold`, `--brand-dark`, `--brand-bg`, `--background`, `--foreground` defined in `:root` |
| Layout entry | `app/layout.tsx` — server component, wraps all pages |
| Font | Geist Sans + Geist Mono loaded from Google Fonts |

All colour tokens are CSS custom properties. Overriding them at `:root` or on `<html>` propagates instantly throughout the entire component tree — no per-component changes needed.

---

## Proposed Future State

When a visitor loads any page with `?princess` in the query string (e.g. `https://laynesaywellhughes.co.nz/?princess`):

- CSS custom properties are overridden with princess palette
- A Google Font suitable for a whimsical princess aesthetic loads (Pacifico or Dancing Script)
- Optional: a sparkle/unicorn emoji favicon swap
- Normal visitors see zero change

### Princess Palette

| Token | Current | Princess Override |
|---|---|---|
| `--background` | `#ffffff` | `#fff0f8` (blush white) |
| `--foreground` | `#1a1a1a` | `#6b0057` (deep plum) |
| `--brand-gold` | `#c9a84c` | `#ff69b4` (hot pink) |
| `--brand-gold-dark` | `#a8873a` | `#e0408a` (darker pink) |
| `--brand-dark` | `#1a1a1a` | `#4b0082` (indigo/purple) |
| `--brand-bg` | `#f9f7f4` | `#fce4f5` (lavender blush) |
| `body font` | Geist Sans | Pacifico (cursive) or Dancing Script |

---

## Implementation Approach

### Query Param Detection

Next.js 15 App Router: `searchParams` is available as a prop on page Server Components, but not directly in the root layout. The cleanest approach:

**Option A (recommended): Client component in layout**
- Create `components/PrincessMode.tsx` — a `'use client'` component
- Uses `useSearchParams()` hook to detect `?princess`
- When active, renders a `<style>` tag into `<head>` that overrides `:root` CSS variables and swaps the font
- Mount this component in `app/layout.tsx` inside a `<Suspense>` boundary (required for `useSearchParams` in Next.js 15)

**Option B: Middleware**
- `middleware.ts` reads query param, sets a cookie, layout reads cookie
- More complex, involves cookie/header overhead — overkill for an Easter egg

**Option A is correct.**

### Font Loading

- Pacifico is a Google Font available via `next/font/google`
- Load it conditionally: since `next/font` must be called at module level, load the font always but only apply the CSS variable when princess mode is active
- Alternatively, inject a `<link>` to Google Fonts via the style tag override — acceptable for an Easter egg (not performance-critical)

---

## Implementation Phases

### Phase 1 — Core CSS Override (S)
1. Create `components/PrincessMode.tsx` client component
2. Detect `?princess` via `useSearchParams()`
3. Inject `<style>` tag with CSS variable overrides
4. Mount in `app/layout.tsx` wrapped in `<Suspense>`

### Phase 2 — Font Swap (S)
5. Add Pacifico font load to the injected style tag
6. Override `body { font-family }` in the injected styles

### Phase 3 — Bonus Flourishes (XS, optional)
7. Inject `::before`/`::after` sparkle emoji on headings (pure CSS `content:`)
8. Add unicorn favicon swap via `<link rel="icon">` DOM manipulation

---

## Technical Details

### `components/PrincessMode.tsx`

```tsx
'use client'
import { useSearchParams } from 'next/navigation'

const PRINCESS_CSS = `
  :root {
    --background: #fff0f8;
    --foreground: #6b0057;
    --brand-gold: #ff69b4;
    --brand-gold-dark: #e0408a;
    --brand-dark: #4b0082;
    --brand-bg: #fce4f5;
  }
  @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');
  body { font-family: 'Pacifico', cursive !important; }
  h1, h2, h3::before { content: '✨ '; }
  h1::after, h2::after { content: ' 🦄'; }
`

export function PrincessMode() {
  const params = useSearchParams()
  if (!params.has('princess')) return null
  return <style dangerouslySetInnerHTML={{ __html: PRINCESS_CSS }} />
}
```

### `app/layout.tsx` change

```tsx
import { Suspense } from 'react'
import { PrincessMode } from '@/components/PrincessMode'

// Inside <html>:
<Suspense>
  <PrincessMode />
</Suspense>
```

The `<Suspense>` wrapper is mandatory in Next.js 15 when using `useSearchParams()` outside of a page component.

---

## Risk Assessment

| Risk | Likelihood | Mitigation |
|---|---|---|
| `useSearchParams` causes full-page Suspense boundary waterfall | Low | Wrap only `PrincessMode` in its own `<Suspense>` — rest of layout renders normally |
| Google Fonts `@import` inside `<style>` tag blocked by CSP | Low | No CSP currently configured; note for Phase 3 launch CSP addition |
| Font flashes on load (FOUC) | Low/acceptable | This is an Easter egg — flash is fine |
| `dangerouslySetInnerHTML` XSS concern | None | CSS string is a hard-coded constant, not user input |

---

## Success Metrics

- `/?princess` renders full pink/unicorn theme, all pages
- `/?foo=bar` renders normal theme (no regression)
- `npm run build` passes with TypeScript clean
- No changes to existing components required

---

## Effort Estimate

Total: **~1 hour** (S)
- `PrincessMode.tsx`: 20 min
- `layout.tsx` update: 5 min
- Browser verification across pages: 20 min
- Bonus flourishes: 15 min optional
