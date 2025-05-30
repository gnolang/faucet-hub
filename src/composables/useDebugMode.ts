import { ref } from 'vue'

const DEBUG_STORAGE_KEY = 'debug_mode'
const isDebugMode = ref(localStorage.getItem(DEBUG_STORAGE_KEY) === 'true')

// @ts-ignore - Add debug command to window
window.setDebug = (value) => {
  isDebugMode.value = value
  localStorage.setItem(DEBUG_STORAGE_KEY, value.toString())
  window.location.reload()
}

export const useDebugMode = () => ({
  isDebugMode
}) 