'use client'
import { useSearchParams } from 'next/navigation'

const PRINCESS_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');
  :root {
    --background: #fff0f8;
    --foreground: #6b0057;
    --brand-gold: #ff69b4;
    --brand-gold-dark: #e0408a;
    --brand-dark: #4b0082;
    --brand-bg: #fce4f5;
  }
  body { font-family: 'Pacifico', cursive !important; }
  h1::before, h2::before { content: '✨ '; }
  h1::after, h2::after { content: ' 🦄'; }
`

export function PrincessMode() {
  const params = useSearchParams()
  if (!params.has('princess')) return null
  return <style dangerouslySetInnerHTML={{ __html: PRINCESS_CSS }} />
}
