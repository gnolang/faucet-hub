<template>
  <section :aria-label="name" aria-roledescription="carousel" class="min-h-[27.5rem] md:min-h-0">
    <div
      class="relative md:-left-20 md:py-0 md:my-0 w-full md:snap-x flex md:w-[calc(100%_+_theme(spacing.20))] before:hidden md:before:block before:absolute before:w-20 before:h-full before:bg-gradient-to-r before:from-dark before:z-30 after:hidden md:after:block after:absolute after:w-20 after:h-full after:bg-gradient-to-l after:from-dark after:right-0 after:z-30"
    >
      <button
        @click="scroll('left')"
        :disabled="!canScrollLeft"
        class="absolute left-8 lg:left-0 top-1/2 -translate-y-1/2 z-40 p-2 rounded-full hover:opacity-60"
        :class="{ 'hidden': !canScrollLeft }"
        aria-label="Previous slide"
      >
        <svg xmlns="hidden md:block http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>
      <ul 
        id="carousel-items" 
        ref="carouselRef"
        aria-live="polite" 
        class="flex flex-col md:flex-row scroller scroller-wrap snap-x snap-mandatory w-full scroll-px-20 md:px-20 md:py-10 px-0 overflow-x-auto"
        @scroll="handleScroll"
      >
        <slot />
      </ul>
      <button
        @click="scroll('right')"
        :disabled="!canScrollRight"
        class="hidden md:block absolute -right-14 lg:-right-20 top-1/2 -translate-y-1/2 z-40 p-2 rounded-full hover:opacity-60"
        :class="{ 'hidden': !canScrollRight }"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

interface Props {
  name?: string
}
const props = withDefaults(defineProps<Props>(), {
  name: 'Gallery',
})

const carouselRef = ref<HTMLElement | null>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)

const handleScroll = () => {
  if (!carouselRef.value) return
  
  const { scrollLeft, scrollWidth, clientWidth } = carouselRef.value
  canScrollLeft.value = scrollLeft > 0
  canScrollRight.value = scrollLeft < scrollWidth - clientWidth
}

const scroll = (direction: 'left' | 'right') => {
  if (!carouselRef.value) return
  const itemWidth = carouselRef.value.scrollWidth / carouselRef.value.children.length
  carouselRef.value.scrollBy({
    left: direction === 'left' ? -itemWidth : itemWidth,
    behavior: 'smooth'
  })
}

onMounted(() => {
  handleScroll()
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
