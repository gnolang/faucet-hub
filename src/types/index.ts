export type RequestStatus = 'pending' | 'success' | 'error' | 'null'

export interface Faucet {
  name: string // name of the testnet
  chain_id: string // name of the testnet
  amounts: number[] // faucet serve amounts (UI) - multiple figures create a select
  url: string // the faucet URL
  description: string // faucet description - max 100chars
  recaptcha?: string // the reCaptcha v2 site key, if any (legacy)
  hcaptcha?: string // the hCaptcha site key, if any
  token?: string // token name: default $GNOT
  github_oauth_client_id?: string // github oauth client id
  debug?: boolean // whether this is a debug faucet (advanced users only)
  form_type?: 'drip' | 'interest' // form type: 'drip' (default) or 'interest' for manual-review applications
}

export interface InterestFormData {
  github_username: string
  email: string
  building_interest: string
  company: string
  socials: string
  how_learned: string
  gno_address: string
  cosmos_address: string
  country: string
}
