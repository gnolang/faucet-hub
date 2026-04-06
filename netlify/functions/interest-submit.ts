import type { Handler, HandlerEvent } from '@netlify/functions'
import * as crypto from 'crypto'

const REQUIRED_FIELDS = ['github_token', 'email', 'gno_address', 'building_interest', 'how_learned', 'country', 'requested_gnot_amount'] as const

const SCOPES = 'https://www.googleapis.com/auth/spreadsheets'

function base64url(input: string | Buffer): string {
  const buf = typeof input === 'string' ? Buffer.from(input) : input
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

async function getAccessToken(credentials: { client_email: string; private_key: string }): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const payload = base64url(
    JSON.stringify({
      iss: credentials.client_email,
      scope: SCOPES,
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    })
  )

  const privateKey = credentials.private_key.replace(/\\n/g, '\n')
  const signature = crypto.sign('RSA-SHA256', Buffer.from(`${header}.${payload}`), privateKey)
  const jwt = `${header}.${payload}.${base64url(signature)}`

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  })

  const data = await response.json()
  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || 'Failed to obtain Google access token')
  }

  return data.access_token
}

const handler: Handler = async (event: HandlerEvent) => {
  const headers = {
    'Content-Type': 'application/json',
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  let body: Record<string, string>
  try {
    body = JSON.parse(event.body || '{}')
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON body' }) }
  }

  // Validate required fields
  const missingFields = REQUIRED_FIELDS.filter((field) => !body[field]?.trim())
  if (missingFields.length > 0) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: `Missing required fields: ${missingFields.join(', ')}` }),
    }
  }

  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID
  const credentialsJson = process.env.GOOGLE_CREDENTIALS

  if (!spreadsheetId || !credentialsJson) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server configuration error' }) }
  }

  // Verify GitHub token and resolve username server-side
  let githubUsername: string
  try {
    const ghResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${body.github_token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    })

    if (!ghResponse.ok) {
      return { statusCode: 401, headers, body: JSON.stringify({ error: 'Invalid GitHub token' }) }
    }

    const ghUser = await ghResponse.json()
    githubUsername = ghUser.login
  } catch {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Failed to verify GitHub identity' }) }
  }

  try {
    const credentials = JSON.parse(credentialsJson)
    const accessToken = await getAccessToken(credentials)

    const ip = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown'
    const userAgent = event.headers['user-agent'] || 'unknown'
    const rawHeaders = JSON.stringify(event.headers)

    const row = [
      new Date().toISOString(),
      githubUsername,
      body.email,
      body.building_interest,
      body.company || '',
      body.socials || '',
      body.how_learned || '',
      body.gno_address,
      body.cosmos_address || '',
      body.country,
      body.requested_gnot_amount,
      ip,
      userAgent,
      rawHeaders,
    ]

    const range = encodeURIComponent('Sheet1!A:N')
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`

    const sheetsResponse = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values: [row] }),
    })

    if (!sheetsResponse.ok) {
      const err = await sheetsResponse.json()
      throw new Error(err.error?.message || 'Google Sheets API error')
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true }),
    }
  } catch (error) {
    console.error('Error writing to Google Sheets:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: `Failed to submit application: ${error instanceof Error ? error.message : String(error)}` }),
    }
  }
}

export { handler }
