import type { Handler, HandlerEvent } from '@netlify/functions'
import { google } from 'googleapis'

const REQUIRED_FIELDS = ['github_username', 'email', 'gno_address', 'building_interest', 'how_learned', 'country'] as const

const handler: Handler = async (event: HandlerEvent) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' }
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
      body.github_username,
      body.email,
      body.building_interest,
      body.company || '',
      body.socials || '',
      body.how_learned || '',
      body.gno_address,
      body.cosmos_address || '',
      body.country,
      ip,
      userAgent,
      rawHeaders,
    ]

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:M',
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
