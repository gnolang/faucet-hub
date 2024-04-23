<template>
  <vue-recaptcha theme="dark" :size="screenWidth < 768 ? 'compact' : 'normal'" :sitekey="captchakey" @verify="handleSuccess" @error="handleError"></vue-recaptcha>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useWindowSize } from '@vueuse/core'

type Props = {
  captchakey: string
}
defineProps<Props>()

const emit = defineEmits(['validation'])

const { width: screenWidth } = useWindowSize()

const handleError = (res: string) => {
  emit('validation', { code: 'error', secret: res ?? 'error' })
}

const handleSuccess = (res: string) => {
  emit('validation', { code: 'success', secret: res })
}
</script>
