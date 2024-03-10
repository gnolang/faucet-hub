<template>
  <section :aria-label="name" aria-roledescription="carousel" class="min-h-[27.5rem] md:min-h-0">
    <div
      class="absolute md:relative -left-20 py-36 -my-36 md:py-0 md:my-0 w-full snap-x flex md:w-screen before:absolute before:w-20 before:h-full before:bg-gradient-to-r before:from-dark before:z-30 after:absolute after:w-20 after:h-full after:bg-gradient-to-l after:from-dark after:right-0 after:z-30"
    >
      <ul
        id="carousel-items"
        aria-live="polite"
        class="flex scroller scroller-wrap snap-x snap-mandatory scroll-px-20 md:px-20 py-10 px-0 overflow-x-auto"
      >
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
  @apply snap-start md:w-[calc(25%_-_theme(spacing.4))];
}
</style>
