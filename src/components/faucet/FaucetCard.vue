<template>
  <Card :tracker="tracker">
    <FaucetAvailability :available="true" class="self-end" />
    <div class="mt-28">
      <span class="mb-2 text-grey-100 text-50 uppercase">{{ faucet.chain_id }}</span>
      <h2 class="text-500 text-grey-50">{{ faucet.name }}</h2>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import Card from '@/components/ui/Card.vue'
import FaucetAvailability from './FaucetAvailability.vue'

import { type MotionTracker } from '@/composables/useMouseDelegation'

import { Faucet } from '@/types'

interface Props {
  faucet: Faucet
  motion?: MotionTracker
  isLoading: boolean
}

const props = defineProps<Props>()

//TODO: request to get availibility (or from props - parent req)
const availability = ref(true)

const tracker = computed(() => {
  return {
    x: props.motion?.value?.x ?? 0,
    y: props.motion?.value?.y ?? 0,
    isHovered: props.motion?.value?.isHovered ?? false,
    isLoading: false,
  }
})
</script>
