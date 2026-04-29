let cachedToken: { value: string; expiresAt: number } | null = null

export async function getRmaToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.value
  }
  const res = await fetch(process.env.RATEMYAGENT_TOKEN_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.RATEMYAGENT_CLIENT_ID!,
      client_secret: process.env.RATEMYAGENT_CLIENT_SECRET!,
      scope: 'read:agent-data',
    }),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`RMA token request failed: ${res.status}`)
  const data = await res.json()
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  }
  return cachedToken.value
}
