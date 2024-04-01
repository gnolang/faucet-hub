export type RequestStatus = 'pending' | 'success' | 'error' | 'null'

export type Code = 'success' | 'error'

export interface Faucet {
  name: string // name of the testnet
  chain_id: string // name of the testnet
  amounts: number[] // faucet serve amounts (UI)
  url: string // the faucet URL
  recaptcha: string // the recaptcha site key, if any
  token?: string // token name: default $GNOT
}
