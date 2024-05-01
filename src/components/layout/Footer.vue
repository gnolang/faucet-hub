<template>
  <footer class="px-4 md:px-14 lg:px-20 mb-12 w-full max-w-[110rem] mx-auto flex flex-col md:flex-row text-grey-100 text-100 text-center md:text-left justify-between items-center">
    <div class="mb-10 md:mb-0">Faucet Hub is a community project.<br />Check out <a href="https://github.com/gnolang/faucet-hub" class="hover:text-grey-50 transition-colors ease-in-out underline">Github Repo</a> - <Terms class="hover:text-grey-50 transition-colors ease-in-out underline">Terms & Conditions</Terms>.</div>
    <div class="flex flex-col md:flex-row items-center">
      <div class="mr-6 mb-6 md:mb-0">Learn more about Gno.land <br />and be part of the conversation:</div>
      <ul class="flex space-x-4">
        <li v-for="(social, idx) in socials" :key="idx">
          <a :href="social.link" class="hover:text-grey-50 transition-colors ease-in-out">
            <component :is="social.icon" />
          </a>
        </li>
      </ul>
    </div>
  </footer>
</template>

<script setup lang="ts">
import IconDiscord from '@/components/icons/IconDiscord.vue'
import IconGitHub from '@/components/icons/IconGitHub.vue'
import IconTwitter from '@/components/icons/IconTwitter.vue'
import IconLinkedin from '@/components/icons/IconLinkedin.vue'
import Terms from '@/components/layout/Terms.vue'

const socials = [
  {
    icon: IconDiscord,
    link: 'https://discord.com/invite/S8nKUqwkPn',
  },
  {
    icon: IconGitHub,
    link: 'https://github.com/gnolang/gno',
  },
  {
    icon: IconTwitter,
    link: 'https://twitter.com/_gnoland',
  },
  {
    icon: IconLinkedin,
    link: 'https://www.linkedin.com/company/gnoland/',
  },
]
</script>