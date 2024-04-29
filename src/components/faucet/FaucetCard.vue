<template>
  <Card :tracker="tracker">
    <div class="flex flex-col justify-between h-full min-h-64">
      <FaucetAvailability :available="true" class="self-end" />
      <!-- <div class="group-hover:-translate-y-0 translate-y-[calc(theme(spacing.12)_+_theme(spacing.7))] mt-28 ease-in-out duration-500"> -->
      <div class="mt-12">
        <span class="mb-2 text-grey-100 text-50 uppercase">{{ faucet.chain_id }}</span>
        <h2 class="text-500 text-grey-50">{{ faucet.name }}</h2>
        <h3 class="text-grey-100 text-100 mt-3 h-12 group-hover:max-h-12 md:max-h-0 ease-in-out duration-700 line-clamp-4 md:line-clamp-3 will-change-[max-height]">
          {{ faucet.description }}
        </h3>
      </div>
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
