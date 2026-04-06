import type { Handler, HandlerEvent } from '@netlify/functions'
import { google } from 'googleapis'

const REQUIRED_FIELDS = ['github_token', 'email', 'gno_address', 'building_interest', 'how_learned', 'country', 'requested_gnot_amount'] as const

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
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({ version: 'v4', auth })

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

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:N',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [row],
      },
    })

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
      body: JSON.stringify({ error: 'Failed to submit application' }),
    }
  }
}

export { handler }
