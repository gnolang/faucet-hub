import { Faucet } from '@/types'

interface JSONRPCResponse {
  jsonrpc: '2.0'
  id: number
  result?: string
  error?: {
    code: number
    message: string
  }
}

interface FaucetRequestOptions {
  address: string
  amount?: string
  captchaSecret?: string
  githubCode?: string
}

export function useFaucetApi() {
  const createJSONRPCRequest = (options: FaucetRequestOptions) => {
    const { address, amount, captchaSecret } = options
    const request = {
      jsonrpc: '2.0',
      id: 1,
      method: 'drip',
      params: [
        address,
        amount,
      ],
      meta: captchaSecret ? { captcha: captchaSecret } : undefined,
    }
    return request
  }

  const handleResponse = async (response: Response): Promise<string> => {
    const contentType = response.headers.get('content-type')

    // Handle non-JSON responses
    if (!contentType?.includes('application/json')) {
      const text = await response.text()
      throw new Error(text || 'Unexpected response content type')
    }

    // Handle JSON-RPC response
    const jsonResponse = await response.json() as JSONRPCResponse
    switch (true) {
      // Validate JSON-RPC 2.0 format
      case jsonResponse.jsonrpc !== '2.0' || typeof jsonResponse.id !== 'number':
        throw new Error('Invalid JSON-RPC 2.0 response format')

      // Handle JSON-RPC error
      case !!jsonResponse.error:
        throw new Error(jsonResponse.error.message || 'Unknown JSON-RPC error')

      // Handle missing or invalid result
      case !jsonResponse.result || typeof jsonResponse.result !== 'string':
        throw new Error('Invalid JSON-RPC response: missing or invalid result')

      // Return valid result
      default:
        return jsonResponse.result
    }
  }

  const requestFaucet = async (faucet: Faucet, options: FaucetRequestOptions): Promise<string> => {
    try {
      const url = options.githubCode 
        ? `${faucet.url}?code=${options.githubCode}`
        : faucet.url

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createJSONRPCRequest(options)),
      })

      return handleResponse(response)
    } catch (e) {
      // Ensure API errors are properly formatted
      if (e instanceof Error) {
        throw e
      }
      throw new Error('Unknown API error')
    }
  }

  return {
    requestFaucet,
  }
} 