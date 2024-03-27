export type RequestStatus = 'pending' | 'success' | 'error' | 'null'

export type Status = 'FAIL' | 'EMPTY' | 'INVALID_ADDRESS' | 'BUSY_FAUCET' | undefined
export type Code = 'success' | 'error'

export interface Faucet {
  name: string;       // name of the testnet
  chain_id: string;       // name of the testnet
  amounts: number[];  // faucet serve amounts (UI)
  url: string;        // the faucet URL
  recaptcha: string;  // the recaptcha site key, if any
}