<template>
  <vue-recaptcha theme="dark" :size="screenWidth < 768 ? 'compact' : 'normal'" :sitekey="captchakey" @verify="handleSuccess" @error="handleError" v-if="captchakey && store.isVisible"></vue-recaptcha>
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { useFaucetDetail } from '@/stores/faucetDetail'
type Props = {
  captchakey: string | undefined
}
defineProps<Props>()

const emit = defineEmits(['validation'])
const store = useFaucetDetail()

const { width: screenWidth } = useWindowSize()

const handleError = (res: string) => {
  emit('validation', { code: 'error', secret: res ?? 'error' })
}

const handleSuccess = (res: string) => {
  emit('validation', { code: 'success', secret: res })
}
</script>
