<template>
	<div ref="DOMbackground" class="fixed w-screen h-screen top-0 left-0 z-30 bg-darkblur backdrop-blur-sm invisible opacity-0"></div>
		<section
		ref="DOMpopup"
		class="popup fixed flex flex-col items-center rounded w-[90vw] max-w-[36rem] max-h-[90vh] justify-start bg-grey-300 top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] md:justify-center text-grey-50 before:absolute before:top-0 before:bottom-0 before:left-0 before:right-0 before:rounded before:bg-500 before:z-min after:absolute after:top-px after:left-px after:bottom-px after:right-px after:bg-grey-500 after:rounded after:z-min"
		>
		<div ref="DOMFaucetRequest" class="p-20" v-if="selectedFaucetFromUrl">
			<Recaptcha @validation="captchaValidation" :captchakey="selectedFaucetFromUrl.recaptcha" />
		</div>
	</section>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { gsap } from 'gsap'

import Recaptcha from '@/components/ui/Recaptcha.vue'

import { useFaucetDetail } from '@/stores/faucetDetail'

import { Faucet } from '@/types'

import { faucets as faucetJson } from '@/data/faucets.json'

const faucets = ref(faucetJson as Faucet[])

const store = useFaucetDetail()

const DOMbackground = ref<HTMLElement | null>(null)
const DOMpopup = ref<HTMLElement | null>(null)
const DOMFaucetRequest = ref<HTMLElement | null>(null)

const captchaValid = ref(false)
const captchaSecret = ref('')

const faucetUrl = new URLSearchParams(window.location.search).get('faucet_url') || null

const selectedFaucetFromUrl = computed(() => {
  return faucets.value.find(faucet => faucet.url === faucetUrl) || null
})

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

const captchaValidation = ({ code = 'error', secret = '' }) => {
  captchaValid.value = code === 'success'
  captchaSecret.value = secret
  window.hasOwnProperty("ReactNativeWebView") ? window.ReactNativeWebView?.postMessage(secret) : null;
}

const TLPending = ref<GSAPTimeline | null>(null)

onMounted(() => {


	if (selectedFaucetFromUrl.value) {

		store.DOM.bg = DOMbackground.value
  	store.DOM.popup = DOMpopup.value

		store.selectedFaucet = selectedFaucetFromUrl.value
		store.popupToggle()
	}

  TLPending.value = gsap
    .timeline({ repeat: -1, paused: true })
    .fromTo('.popup', { '--mx': '0%' }, { '--mx': '100%', duration: 0.8, ease: 'none' })
    .fromTo('.popup', { '--my': '100%' }, { '--my': '0%', duration: 0.8, ease: 'none' })
    .fromTo('.popup', { '--mx': '100%' }, { '--mx': '0%', duration: 0.8, ease: 'none' })
    .to('.popup', { '--my': '100%', duration: 0.8, ease: 'none' })
})

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
