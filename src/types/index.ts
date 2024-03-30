export type RequestStatus = 'pending' | 'success' | 'error' | 'null'

export type Status = 'FAIL' | 'EMPTY' | 'INVALID_ADDRESS' | 'BUSY_FAUCET' | undefined
export type Code = 'success' | 'error'

export interface Faucet {
  Name: string // name of the testnet
  Amounts?: number[] // faucet serve amounts (UI)
  URL: string // the faucet URL
  ReCaptcha: string // the recaptcha site key, if any
  Network?: string // name of the network if any
  Token?: string // token name - $GNOT by default
}

export interface Request {
  To: string // recipient address
  Amount: string // <AMOUNT>ugnot
  Captcha: string
}

export interface Response {
  Result: string //json: "result
  Error: string //json: error,omitempty
}
