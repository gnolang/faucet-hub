<template>
  <div ref="DOMbackground" class="fixed w-screen h-screen top-0 left-0 z-30 bg-darkblur backdrop-blur-sm invisible opacity-0" @click="closePopup()"></div>

  <section
    ref="DOMpopup"
    class="popup fixed flex flex-col items-center rounded w-[90vw] max-w-[36rem] max-h-[90vh] justify-start bg-grey-300 top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] md:justify-center text-grey-50 before:absolute before:top-0 before:bottom-0 before:left-0 before:right-0 before:rounded before:bg-500 before:z-min after:absolute after:top-px after:left-px after:bottom-px after:right-px after:bg-grey-500 after:rounded after:z-min"
  >
    <div ref="DOMFaucetRequest" class="py-8 md:py-12 px-8 md:px-20 w-full overflow-scroll no-scrollbar" v-show="store.isVisible">
      <FaucetContentForm :name="store.selectedFaucet.name ?? 'Faucet'" :options="store.faucetAmount" v-show="store.contentStep === 0" class="js-faucetform opacity-100" :error="store.error" />
      <div>
        <div ref="gnoRequestLogo" v-show="store.contentStep >= 1" class="opacity-0">
          <Vue3Lottie :animationData="GnoJSON" :loop="true" :height="200" :width="200" :autoPlay="true" />
        </div>
        <FaucetContentRequest v-show="store.contentStep === 1" class="js-faucetpending" />
        <FaucetContentSuccess v-show="store.contentStep === 2" class="js-faucetsuccess opacity-0" @doneFaucet="donefaucet()" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUpdated, ref } from 'vue'
import { gsap } from 'gsap'
import { Vue3Lottie } from 'vue3-lottie'

import FaucetContentForm from './content/FaucetContentForm.vue'
import FaucetContentRequest from './content/FaucetContentRequest.vue'
import FaucetContentSuccess from './content/FaucetContentSuccess.vue'
import GnoJSON from '@/assets/lottie/logo.json'

import { useFaucetDetail } from '@/stores/faucetDetail'

const store = useFaucetDetail()

const DOMbackground = ref<HTMLElement | null>(null)
const DOMpopup = ref<HTMLElement | null>(null)
const DOMFaucetRequest = ref<HTMLElement | null>(null)
const gnoRequestLogo = ref<HTMLElement | null>(null)

onMounted(() => {
  // Store DOM references for animations
  store.DOM.bg = DOMbackground.value
  store.DOM.popup = DOMpopup.value
  store.DOM.gnoRequestLogo = gnoRequestLogo.value
  store.DOM.faucetRequest = DOMFaucetRequest.value

  // Setup the pending animation timeline
  store.setupPendingAnimation()

  // Subscribe to status changes
  store.$subscribe((mutation, state) => {
    if (mutation.type === 'direct' && mutation.events?.key === 'status') {
      store.handleStatusChange(state.status)
    }
  })
})

onUpdated(() => {
  store.DOM.bg = DOMbackground.value
  store.DOM.popup = DOMpopup.value
  store.DOM.gnoRequestLogo = gnoRequestLogo.value
  store.DOM.faucetRequest = DOMFaucetRequest.value
})

const closePopup = () => store.popupToggle()
const donefaucet = () => store.popupToggle()
</script>

<style scoped>
.popup {
  --op: 0;
  --mx: 0%;
  --my: 100%;

  clip-path: polygon(0 0, 100% 0%, 100% 0, 0 0);
}
.popup::before {
  opacity: var(--op);
  background: radial-gradient(farthest-corner circle at var(--mx, 0%) var(--my, 100%), #aeffb6 0%, #121212 20%, #121212 100%);
}
</style>
