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
  amount?: string  // Changed to string to accept ugnot directly
  captchaSecret?: string
  githubCode?: string
}

export function useFaucetApi() {
  const MIN_LOADING_TIME = 2000 // 2 seconds minimum loading time for UI

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

    if (contentType?.includes('text/')) {
      // Handle text response (HTTP error)
      const text = await response.text()
      console.log('Received text error:', text)
      throw new Error(text)
    }

    if (!contentType?.includes('application/json')) {
      throw new Error('Unexpected response content type')
    }

    // Handle JSON-RPC response
    const jsonResponse = await response.json() as JSONRPCResponse

    if (jsonResponse.error) {
      console.log('JSON-RPC error:', jsonResponse.error)
      throw new Error(jsonResponse.error.message || 'Unknown JSON-RPC error')
    }

    if (!jsonResponse.result) {
      throw new Error('Invalid JSON-RPC response: missing result')
    }

    return jsonResponse.result
  }

  const requestFaucet = async (faucet: Faucet, options: FaucetRequestOptions): Promise<string> => {
    const minTimer = new Promise((resolve) => setTimeout(resolve, MIN_LOADING_TIME))

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

      const result = await handleResponse(response)
      await minTimer // Ensure minimum loading time for UI
      return result
    } catch (e) {
      await minTimer // Ensure minimum loading time for UI
      throw e
    }
  }

  return {
    requestFaucet,
  }
} 