<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'

import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import FaucetsList from '@/components/faucet/FaucetsList.vue'
import FaucetDetail from '@/components/faucet/FaucetDetail.vue'
import FaucetCaptcha from '@/components/faucet/FaucetCaptcha.vue'

import { useCharming } from '@/composables/useCharming'
import { useFaucetDetail } from '@/stores/faucetDetail'

const store = useFaucetDetail()

const DOMTitle = ref<null | HTMLElement>(null)
const DOMSiteloader = ref<null | HTMLElement>(null)

onMounted(() => {
  if (DOMTitle.value) {
    useCharming(DOMTitle.value, {
      tagName: 'span',
      type: 'word',
      nesting: 1,
      classPrefix: 'word word-',
    })
    useCharming(DOMTitle.value, {
      tagName: 'span',
      type: 'letter',
      nesting: 1,
      classPrefix: 'letter letter-',
    })

    store.DOM.title = DOMTitle.value
  }

  window.addEventListener('load', () => {
    gsap.to(DOMSiteloader.value, { autoAlpha: 0, duration: 0.4 })
    store.titleToggle()
  })
})
</script>

<template>
  <div ref="DOMSiteloader" class="fixed top-0 left-0 right-0 bottom-0 z-max bg-dark"></div>
  <main class="js-main flex flex-col justify-between min-h-screen">
    <Header />
    <section class="px-4 md:px-14 lg:px-20 mx-auto max-w-[110rem] w-full grid grid-cols-12">
      <h1 class="col-span-12 lg:col-span-5 font-termina text-600 md:text-700 text-center md:text-left" ref="DOMTitle">Welcome to the Faucet Hub</h1>
      <FaucetsList />
    </section>

    <Footer />
  </main>
  <FaucetDetail />
  <FaucetCaptcha />
</template>
