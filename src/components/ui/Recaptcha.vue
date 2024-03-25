<template>
  <vue-recaptcha theme="dark" :sitekey="siteKey" @verify="handleSuccess" @error="handleError"></vue-recaptcha>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const siteKey = ref(import.meta.env.VITE_reCAPTCHA_SITE_KEY ?? '')

const emit = defineEmits(['validation'])

const handleError = (res: string) => {
  emit('validation', { code: 'error', secret: res })
}

const handleSuccess = (res: string) => {
  emit('validation', { code: 'success', secret: res })
}
</script>
