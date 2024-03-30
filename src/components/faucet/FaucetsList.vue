<template>
  <div ref="projectCarouselEL" class="col-span-12 my-20">
    <Carousel name="Carousel">
      <li v-for="(faucet, idx) in faucets" :key="idx" class="js-card p-4 flex-none w-full" role="group" aria-roledescription="slide">
        <div ref="cards" class="translate-x-12 opacity-0 h-full" @click.prevent="openFaucet(faucet)">
          <FaucetCard :data-ref="motions[idx].value.id" :motion="width >= 768 ? motions[idx] : undefined" :data-index="idx" :faucet="faucet" :is-loading="isLoading" />
        </div>
      </li>
    </Carousel>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useWindowSize } from '@vueuse/core'

import Carousel from '@/components/ui/Carousel.vue'
import FaucetCard from '@/components/faucet/FaucetCard.vue'

import { useMouseDelegation } from '@/composables/useMouseDelegation'
import { useFaucetDetail } from '@/stores/faucetDetail'

import { Faucet } from '@/types'

import { faucets as faucetJson } from '@/data/faucets.json'

const faucets = ref(faucetJson as Faucet[])

// slider & cards
const projectCarouselEL = ref<HTMLElement | null>(null)
const cards = ref<null | HTMLElement[]>(null)

// TODO: To custom with async data
let isLoading = false

const { width } = useWindowSize()

const { motions } = useMouseDelegation(projectCarouselEL, faucets.value, 'ref')

const store = useFaucetDetail()

const openFaucet = (faucet: Faucet) => {
  store.selectedFaucet = faucet
  store.popupToggle()
}

onMounted(() => {
  window.addEventListener('load', () => {
    if (cards.value && cards.value?.length > 0) {
      store.DOM.cards = cards.value
      store.cardDisplay()
    }
  })
})
</script>

<style scoped>
.js-card {
  clip-path: polygon(0 0, 100% 0%, 100% 100%, 0% 100%);
}
</style>
