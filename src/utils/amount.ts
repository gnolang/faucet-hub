export const convertToUgnot = (amount: number): string => {
  return `${amount * 1000000}ugnot`
}

export const convertFromUgnot = (ugnot: string): number => {
  return parseInt(ugnot.replace('ugnot', ''), 10) / 1000000
} 