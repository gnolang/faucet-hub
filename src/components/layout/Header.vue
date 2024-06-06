<template>
  <header class="min-h-28 w-full max-w-[110rem] mx-auto px-8 md:px-14 lg:px-20 pt-8 pb-4 mb-8 md:mb-16">
    <div class="relative w-full">
      <nav class="absolute justify-between md:flex p-4 pb-8 md:p-0 z-2 w-full top-0 before:absolute before:z-30 before:top-0 before:left-0 before:bg-grey-500 before:w-full before:rounded before:h-0 before:duration-700 before:delay-50" :class="[menuIsOpen === true && 'before:!h-full before:!delay-0 before:!duration-500']">
        <div class="top-0 left-0 right-0 bottom-0 bg-darkblur backdrop-blur-sm" :class="menuIsOpen ? 'fixed' : 'hidden'" @click="toggleMenu"></div>
        <IconGnoland class="relative z-40 justify-start" />

        <button id="menubutton" class="group absolute z-40 md:hidden w-7 h-5 block right-4 top-6 focus:outline-0" :aria-expanded="menuIsOpen" aria-haspopup="true" aria-label="Toggle menu" aria-controls="menu" tabindex="0" @click="toggleMenu">
          <span class="absolute rounded h-px w-full origin-right left-0 top-0 bg-light duration-200" :class="[menuIsOpen === true && '-rotate-45 translate-y-0']"></span>
          <span class="absolute rounded h-px w-full scale-x-75 origin-right left-0 top-1/2 -translate-y-1/2 bg-light duration-200 group-hover:scale-x-100 group-focus:scale-x-100" :class="[menuIsOpen === true && 'opacity-0']"></span>
          <span class="absolute rounded h-px w-full scale-x-50 origin-right left-0 bottom-0 bg-light duration-200 group-hover:scale-x-100 group-focus:scale-x-100" :class="[menuIsOpen === true && 'rotate-45 !scale-x-100']"></span>
        </button>

        <ul class="relative z-40 md:flex mt-8 md:mt-0 justify-end items-center space-y-5 md:space-x-8 md:space-y-0" :aria-hidden="!menuIsOpen" id="menu" role="menu" aria-labelledby="menubutton">
          <li v-for="item in navItems" :key="item.title" class="opacity-0 md:opacity-100 duration-150 delay-0" :class="[menuIsOpen === true && 'opacity-100 !delay-300 !duration-300']" role="presentation">
            <a :href="item.link" class="text-link" role="menuitem">{{ item.title }}</a>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import IconGnoland from '@/components/icons/IconGnoland.vue'

const menuIsOpen = ref(false)

interface NavItem {
  title: string
  link: string
}

const navItems: NavItem[] = [
  {
    title: 'Gno.land',
    link: 'https://gno.land/',
  },
  {
    title: 'Docs',
    link: 'https://docs.gno.land/',
  },
  {
    title: 'Playground',
    link: 'https://play.gno.land/',
  },
]

const toggleMenu = () => (menuIsOpen.value = !menuIsOpen.value)
</script>
