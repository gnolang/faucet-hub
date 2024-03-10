export type RequestStatus = 'pending' | 'success' | 'error' | 'null'

export type Status = 'FAIL' | 'EMPTY' | 'INVALID_ADDRESS' | 'BUSY_FAUCET' | undefined
export type Code = 'success' | 'error'

export interface Faucet {
  name: string
  availability: boolean
  network: string
  token: string
  amounts?: number[]
}
