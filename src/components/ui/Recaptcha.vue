<template>
  <vue-hcaptcha
    v-if="hcaptchakey && store.isVisible"
    theme="dark"
    :size="screenWidth < 768 ? 'compact' : 'normal'"
    :sitekey="hcaptchakey"
    :recaptchaCompat="false"
    @verify="handleSuccess"
    @error="handleError"
  />
  <vue-recaptcha
    v-else-if="recaptchakey && store.isVisible"
    theme="dark"
    :size="screenWidth < 768 ? 'compact' : 'normal'"
    :sitekey="recaptchakey"
    @verify="handleSuccess"
    @error="handleError"
  />
</template>

<script setup lang="ts">
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha'
import { VueRecaptcha } from 'vue-recaptcha'
import { useWindowSize } from '@vueuse/core'
import { useFaucetDetail } from '@/stores/faucetDetail'

type Props = {
  recaptchakey: string | undefined
  hcaptchakey: string | undefined
}
defineProps<Props>()

const emit = defineEmits(['validation'])
const store = useFaucetDetail()

const { width: screenWidth } = useWindowSize()

const handleError = (err: string) => {
  emit('validation', { code: 'error', secret: err ?? 'error' })
}

const handleSuccess = (token: string) => {
  emit('validation', { code: 'success', secret: token })
}
</script>
