<template>
  <vue-recaptcha theme="dark" :sitekey="captchakey ?? 'a'" @verify="handleSuccess" @error="handleError"></vue-recaptcha>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

type Props = {
  captchakey: string
}
defineProps<Props>()

const emit = defineEmits(['validation'])

const handleError = (res: string) => {
  emit('validation', { code: 'error', secret: res ?? 'error' })
}

const handleSuccess = (res: string) => {
  emit('validation', { code: 'success', secret: res })
}
</script>
