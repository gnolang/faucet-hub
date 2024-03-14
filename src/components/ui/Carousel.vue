<template>
  <section :aria-label="name" aria-roledescription="carousel" class="min-h-[27.5rem] md:min-h-0">
    <div
      class="relative md:-left-20 md:py-0 md:my-0 w-full md:snap-x flex md:w-[calc(100%_+_theme(spacing.20))] before:hidden md:before:block before:absolute before:w-20 before:h-full before:bg-gradient-to-r before:from-dark before:z-30 after:hidden md:after:block after:absolute after:w-20 after:h-full after:bg-gradient-to-l after:from-dark after:right-0 after:z-30"
    >
      <ul id="carousel-items" aria-live="polite" class="flex flex-col md:flex-row scroller scroller-wrap snap-x snap-mandatory w-full scroll-px-20 md:px-20 md:py-10 px-0 overflow-x-auto">
        <slot />
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

interface Props {
  name?: string
}
const props = withDefaults(defineProps<Props>(), {
  name: 'Gallery',
})
</script>
<style>
.scroller {
  scrollbar-width: none;
}
.scroller::-webkit-scrollbar {
  display: none;
}

.scroller-wrap > * {
  @apply snap-start w-full md:w-[calc(50%_-_theme(spacing.4))] lg:w-[calc(33.33%_-_theme(spacing.4))]  2xl:w-[calc(25%_-_theme(spacing.4))];
}
</style>
