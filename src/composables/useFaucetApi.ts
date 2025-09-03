import { Faucet } from '@/types'

// ===== JSON-RPC CALL TYPES =====

interface FaucetRequestOptions {
  address: string
  amount?: string
  captchaSecret?: string
  githubCode?: string
}

interface ClaimRequestOptions {
  address: string
  githubCode?: string
}

// ===== RETURN TYPES =====
interface JSONRPCResponse {
  jsonrpc: '2.0'
  id: number
  result: string | number
  error?: {
    code: number
    message: string
  }
}

export function useFaucetApi() {
  // Create JSON-RPC request for drip method
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

  // Create JSON-RPC request for checkClaim and claim Rewards methods
  const createClaimJSONRPCRequest = (method: 'checkClaim' | 'claim', options: ClaimRequestOptions) => {
    const { address } = options
    const request = {
      jsonrpc: '2.0',
      id: 1,
      method,
      params: [address],
    }
    return request
  }

  const handleResponse = async <T extends JSONRPCResponse>(response: Response): Promise<string | number> => {
    const contentType = response.headers.get('content-type')

    // Handle non-JSON responses
    if (!contentType?.includes('application/json')) {
      const text = await response.text()
      throw new Error(text || 'Unexpected response content type')
    }

    // Handle JSON-RPC response
    const jsonResponse = await response.json() as T
    switch (true) {
      // Validate JSON-RPC 2.0 format
      case jsonResponse.jsonrpc !== '2.0' || typeof jsonResponse.id !== 'number':
        throw new Error('Invalid JSON-RPC 2.0 response format')

      // Handle JSON-RPC error
      case !!jsonResponse.error:
        throw new Error(jsonResponse.error.message || 'Unknown JSON-RPC error')

      // Handle missing or invalid result
      case jsonResponse.result === undefined || jsonResponse.result === null || (typeof jsonResponse.result !== 'string' && typeof jsonResponse.result !== 'number'):
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
        credentials: 'include',
        body: JSON.stringify(createJSONRPCRequest(options)),
      })

      return String(await handleResponse(response))
    } catch (e) {
      // Ensure API errors are properly formatted
      if (e instanceof Error) {
        throw e
      }
      throw new Error('Unknown API error')
    }
  }

  // TODO: merge with requestFaucet
  const checkClaim = async (faucet: Faucet, options: ClaimRequestOptions): Promise<number> => {
    try {
      const url = options.githubCode 
        ? `${faucet.url}?code=${options.githubCode}`
        : faucet.url

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(createClaimJSONRPCRequest('checkClaim', options)),
      })

      // check
      return parseFloat(String(await handleResponse(response)))
    } catch (e) {
      if (e instanceof Error) {
        throw e
      }
      throw new Error('Unknown API error')
    }
  }

    // TODO: merge with requestFaucet
  const claim = async (faucet: Faucet, options: ClaimRequestOptions): Promise<number> => {
    try {
      const url = faucet.url

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(createClaimJSONRPCRequest('claim', options)),
      })

      return parseFloat(String(await handleResponse(response)))
    } catch (e) {
      if (e instanceof Error) {
        throw e
      }
      throw new Error('Unknown API error')
    }
  }

  return {
    requestFaucet,
    checkClaim,
    claim,
  }
} 