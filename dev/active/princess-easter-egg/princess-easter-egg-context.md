# Princess Easter Egg — Context

Last Updated: 2026-04-29

---

## Key Files

| File | Role |
|---|---|
| `app/globals.css` | Defines all CSS custom properties (`--brand-gold`, `--background`, etc.) — these are what we override |
| `app/layout.tsx` | Root layout — mount `<PrincessMode />` + `<Suspense>` here |
| `components/PrincessMode.tsx` | **New file** — client component, detects `?princess`, injects override `<style>` |

## Constraints

- **Next.js 15 App Router**: `useSearchParams()` requires a `<Suspense>` boundary in the layout; without it Next.js throws a build-time error about static rendering.
- **Tailwind v4**: CSS tokens are defined via `@theme inline` in `globals.css`. Overriding the underlying `--var` values in `:root` takes precedence over the `@theme` mappings — no Tailwind config changes needed.
- **`dangerouslySetInnerHTML`**: Safe here because the CSS string is a hardcoded constant, not user-controlled input.
- **Google Fonts `@import` inside `<style>`**: Works in all modern browsers. Not ideal for performance, but this is an Easter egg.

## Dependencies

None — no new packages required. Uses `next/navigation` (`useSearchParams`), already a Next.js built-in.

## Decisions

- **Client component (not middleware/cookie)**: Simplest approach. Query param is ephemeral — no persistence needed.
- **`<style>` injection over class toggle**: Avoids the need to thread a prop or context through every component. CSS variable override propagates automatically.
- **Pacifico font**: Fun, readable, unmistakably "princess". Available on Google Fonts. Loaded via `@import` in the injected style (not `next/font`) to keep it isolated to Easter egg mode.
