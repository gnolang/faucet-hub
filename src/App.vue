<script setup lang="ts">
import { ref, onMounted } from 'vue'

import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import FaucetsList from '@/components/faucet/FaucetsList.vue'
import FaucetDetail from '@/components/faucet/FaucetDetail.vue'

import { useCharming } from './composables/useCharming'
import { useFaucetDetail } from '@/stores/faucetDetail'

const store = useFaucetDetail()

const DOMTitle = ref<null | HTMLElement>(null)

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
    store.titleToggle()
  }
})
</script>

<template>
  <main class="js-main flex flex-col justify-between min-h-screen">
    <Header />
    <section class="px-20 w-full grid grid-cols-12">
      <h1 class="col-span-5 font-termina text-700" ref="DOMTitle">Welcome to Faucet Hub</h1>
      <FaucetsList />
    </section>

    <Footer />
  </main>
  <FaucetDetail />
</template>
