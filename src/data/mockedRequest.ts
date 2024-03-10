import { type Status, type Code } from '@/types'

const randomize = (max: number, min = 0) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min)
}

interface Res {
  code: Code
  status: Status
  txLink?: string
}

const req = async (st: Code | undefined = undefined, er: Status | undefined = undefined, time = 3000) => {
  return await new Promise<Res>((resolve) => {
    const codes: Code[] = ['success', 'error']
    const errors: Status[] = ['FAIL', 'EMPTY', 'INVALID_ADDRESS', 'BUSY_FAUCET']

    const code = st || codes[randomize(codes.length)]
    const status = code === 'success' ? undefined : er ? er : errors[randomize(errors.length)]
    const txLink = 'https://google.fr'

    setTimeout(() => resolve({ code, status, txLink }), time)
  })
}

export { req }
