<template>
  <header class="flex w-full items-center justify-between max-w-[110rem] mx-auto px-4 md:px-14 lg:px-20 pt-8 pb-4 mb-8 md:mb-16 relative">
    <IconGnoland class="cursor-pointer" />
    <HamburgerMenu :navItems="navItems"/>
    <div class="md:flex justify-end items-center gap-5 hidden">
      <a class="cursor-pointer link-with-animation" v-for="item, i in navItems" :key="i" href="item.link" target="_blank">{{item.title}}</a>
      <a class="cursor-pointer px-2 py-1 bg-grey-100 rounded-sm hover:scale-105 transition-transform duration-300">Connect Wallet</a>
    </div>
  </header>
</template>

<script setup lang="ts">
import IconGnoland from '@/components/icons/IconGnoland.vue'
import { NavItem } from '@/types';
import HamburgerMenu from '../ui/HamburgerMenu.vue';
  const navItems: NavItem[] = [
    {
      title: 'Home',
      link: 'https://gno.land/'
    },
    {
      title: 'Docs',
      link: 'https://docs.gno.land/'
    },
    {
      title: 'Playground',
      link: 'https://play.gno.land/'
    }
  ]
</script>
