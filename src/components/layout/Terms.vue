<template>
  <button class="cursor-pointer" v-bind="$attrs" @click="toggleTerms()"><slot /></button>
  <Popup v-model="isTermsOpened">
    <div class="content">
      <TermsContent /></div
  ></Popup>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Popup from '@/components/ui/Popup.vue'
import TermsContent from '@/content/terms.md'

const isTermsOpened = ref(false)
const toggleTerms = () => (isTermsOpened.value = !isTermsOpened.value)
</script>
