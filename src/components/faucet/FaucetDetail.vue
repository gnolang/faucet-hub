<template>
  <div ref="DOMbackground" class="fixed w-screen h-screen top-0 left-0 z-30 bg-darkblur backdrop-blur-sm invisible opacity-0"></div>

  <section
    ref="DOMpopup"
    class="popup fixed flex flex-col items-center rounded w-[90vw] max-w-[36rem] bg-grey-300 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] justify-center text-grey-50 before:absolute before:top-0 before:bottom-0 before:left-0 before:right-0 before:rounded before:bg-500 before:z-min after:absolute after:top-px after:left-px after:bottom-px after:right-px after:bg-grey-500 after:rounded after:z-min"
  >
    <div ref="DOMFaucetRequest" class="py-12 px-20 w-full" v-if="store.isVisible">
      <FaucetContentForm :name="store.selectedFaucet.name ?? 'Faucet'" :options="store.faucetAmount" v-show="store.contentStep === 0" class="js-faucetform opacity-100" :error="error" @requestFaucet="requestFaucet" />
      <div>
        <div ref="gnoRequestLogo" v-show="store.contentStep >= 1" class="opacity-0">
          <Vue3Lottie :animationData="GnoJSON" :loop="true" :height="200" :width="200" :autoPlay="true" />
        </div>
        <FaucetContentRequest v-show="store.contentStep === 1" class="js-faucetpending" />
        <FaucetContentSuccess v-show="store.contentStep === 2" :tx-link="txLink" class="js-faucetsuccess opacity-0" @doneFaucet="donefaucet()" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, watch, nextTick } from 'vue'
import { gsap } from 'gsap'
import { Vue3Lottie } from 'vue3-lottie'

import FaucetContentForm from './content/FaucetContentForm.vue'
import FaucetContentRequest from './content/FaucetContentRequest.vue'
import FaucetContentSuccess from './content/FaucetContentSuccess.vue'
import GnoJSON from '@/assets/lottie/logo.json'

import { useFaucetDetail } from '@/stores/faucetDetail'

const txLink = ref('')

const store = useFaucetDetail()

const DOMbackground = ref<HTMLElement | null>(null)
const DOMpopup = ref<HTMLElement | null>(null)
const DOMFaucetRequest = ref<HTMLElement | null>(null)
const gnoRequestLogo = ref<HTMLElement | null>(null)

const popupHeight = reactive({ from: 0, to: 0 })
const error = ref<string | null>(null)

const requestFaucet = async (address: string, amount: number, secret: string) => {
  popupHeight.from = DOMpopup.value?.getBoundingClientRect().height ?? 0
  gsap.set(DOMpopup.value, { height: popupHeight.from + 'px' })

  gsap.to('.js-faucetform', {
    autoAlpha: 0,
    duration: 0.5,
    onComplete: () => {
      store.status = 'pending'
      store.contentStep = 1
    },
  })
  gsap.to(gnoRequestLogo.value, { autoAlpha: 1, delay: 0.5 })

  // min default loading timer
  const minTimer = new Promise((resolve) => setTimeout(resolve, 2000))
  console.log(secret)

  const displayError = (e: string) => {
    store.status = 'error'
    error.value = e
    store.contentStep = 0
    console.error(e)
  }
  try {
    const response = await fetch(store.selectedFaucet.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: address,
        amount: amount * 1000000 + 'ugnot',
        captcha: secret,
      }),
    })

    await minTimer
    const faucetResponse = await response.json()

    store.status = !faucetResponse.result ? 'error' : 'success'

    // Check the faucet response
    if (!response.ok || store.status === 'error') {
      displayError(faucetResponse.error.message)
    } else {
      store.status = 'success'
      txLink.value = faucetResponse.result ?? '' //TODO: get tx link
    }
  } catch (e) {
    await minTimer
    displayError(e as string)
  }
}

const donefaucet = () => store.popupToggle()

const TLPending = ref<GSAPTimeline | null>(null)

onMounted(() => {
  store.DOM.bg = DOMbackground.value
  store.DOM.popup = DOMpopup.value

  TLPending.value = gsap
    .timeline({ repeat: -1, paused: true })
    .fromTo('.popup', { '--mx': '0%' }, { '--mx': '100%', duration: 0.8, ease: 'none' })
    .fromTo('.popup', { '--my': '100%' }, { '--my': '0%', duration: 0.8, ease: 'none' })
    .fromTo('.popup', { '--mx': '100%' }, { '--mx': '0%', duration: 0.8, ease: 'none' })
    .to('.popup', { '--my': '100%', duration: 0.8, ease: 'none' })
})

const toggleLoader = (state: boolean) => {
  gsap.to('.popup', {
    '--op': state ? 1 : 0,
    onComplete: () => {
      !state && TLPending.value && TLPending.value.pause()
    },
  })
  state && TLPending.value && TLPending.value.play()
}

const setPopupHeight = () => {
  popupHeight.to = DOMFaucetRequest.value?.getBoundingClientRect().height ?? 0
  gsap.to(DOMpopup.value, { height: popupHeight.to + 'px', duration: 0.4 })
}

watch(
  () => store.status,
  (value) => {
    nextTick(() => {
      switch (value) {
        case 'pending':
          toggleLoader(true)
          setPopupHeight()
          break

        case 'error':
          toggleLoader(false)
          setPopupHeight()

          gsap.to('.js-faucetform', {
            autoAlpha: 1,
            duration: 0.5,
          })
          break

        case 'success':
          toggleLoader(false)

          gsap.to('.js-faucetpending', {
            autoAlpha: 0,
            duration: 0.6,
            onComplete: () => {
              store.contentStep = 2
              popupHeight.from = popupHeight.to
              gsap.set(DOMpopup.value, { height: 'auto' })

              gsap.to('.js-faucetsuccess', {
                autoAlpha: 1,
                duration: 0.6,
              })

              //TODO: replace into own component "FaucetContentSuccess"
              gsap.to('.js-faucetsuccessdetail', {
                height: 'auto',
                duration: 0.6,
              })
            },
          })
          break

        case 'null':
          gsap.set('.js-faucetform', { autoAlpha: 1 })
          gsap.set('.js-faucetpending', { autoAlpha: 1 })
          gsap.set('.js-faucetsuccess', { autoAlpha: 0 })
          gsap.set('.js-faucetsuccessdetail', { height: 0 })
          gsap.set(DOMpopup.value, { height: 'auto', delay: 0.4 })

          error.value = null
          break
      }
    })
  },
)
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
