export const isBech32Valid = (address: string, prefix: string) => {
  if (!address.startsWith(prefix + '1')) return false
  return /^[ac-hj-np-z02-9]{23,38}$/.test(address.slice(prefix.length + 1).toLowerCase())
}

export const isGnoAddressValid = (address: string) => isBech32Valid(address, 'g')

export const isCosmosAddressValid = (address: string) => {
  if (!address) return true
  return isBech32Valid(address, 'cosmos') || isBech32Valid(address, 'atone')
}

export const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
