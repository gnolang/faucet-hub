<template>
  <div v-if="isDebugMode" class="fixed top-9 left-1/2 -translate-x-1/2 bg-red-900 text-red-200 px-3 py-1.5 rounded text-sm font-medium flex items-center gap-2 z-50">
    <span class="w-2 h-2 rounded-full bg-red-200 animate-pulse"></span>
    Debug Mode
  </div>
</template>

<script setup lang="ts">
import { useDebugMode } from '@/composables/useDebugMode'

const { isDebugMode } = useDebugMode()
</script> 