<template>
  <article ref="DOMcard" v-bind="$attrs" class="card-container flex h-full flex-col cursor-pointer before:block before:absolute before:top-0 before:left-0 before:h-full before:w-full before:rounded before:blur-xl before:will-change-transform">
    <div
      class="card-inner group relative h-full shadow-card will-change-transform after:block after:absolute after:rounded after:top-px after:left-px after:h-[calc(100%-2px)] after:w-[calc(100%-2px)] after:z-99 after:mix-blend-overlay after:brightness-90 after:contrast-75 after:transition-opacity after:duration-500 before:absolute before:w-[calc(100%+2px)] before:h-[calc(100%+2px)] before:-top-px before:-left-px before:rounded ease-in-out after:z-20"
    >
      <div class="card relative flex flex-col bg-grey-500 rounded px-6 py-8 p-2 h-full">
        <slot></slot>
      </div>
      <div class="card-behind absolute top-0 left-0 bg-grey-500 w-full h-full rounded"></div>
    </div>
  </article>
</template>
<script setup lang="ts">
import { ref, reactive, computed, nextTick, onMounted, onUpdated, onBeforeUnmount, watch } from 'vue'

import { useFaucetDetail } from '@/stores/faucetDetail'

type Props = {
  tracker?: { x: number; y: number; isHovered: boolean; isLoading: boolean }
}
const props = withDefaults(defineProps<Props>(), {
  tracker: () => ({ x: 0, y: 0, isHovered: false, isLoading: true }),
})

const DOMcard = ref<HTMLElement | null>(null)
const cardPos = reactive({ rect: { width: 1, height: 1, left: 1, right: 1, top: 1, bottom: 1 } })

const store = useFaucetDetail()

const motion = {
  rAF: -1,
  isrAF: false,
  cursor: {
    posX: 0,
    posY: 0,
    newPosX: 0,
    newPosY: 0,
    currentPosX: 0,
    currentPosY: 0,
    speed: 0.09,
  },
}

const pointerEventX = computed(() => {
  if (!props.tracker?.x || props.tracker?.x === 0) return 0
  return -(cardPos.rect.left - props.tracker?.x) - cardPos.rect.width / 2
})

const pointerEventY = computed(() => {
  if (!props.tracker?.y || props.tracker?.y === 0) return 0
  return -(cardPos.rect.top - props.tracker?.y) - cardPos.rect.height / 2
})
const hasLoaded = computed(() => !props.tracker.isLoading)

watch(pointerEventX, () => {
  if (props.tracker && !motion.isrAF && hasLoaded.value === true) {
    motion.isrAF = true

    motion.rAF = requestAnimationFrame(animationRAF)
  }
})
watch(hasLoaded, (n) => {
  if (n === true && alreadyMounted.value === true) {
    getCardSizes()
  }
})

const animationRAF = function () {
  motion.rAF = requestAnimationFrame(animationRAF)

  const posX = store.isOpen === true ? 0 : pointerEventX.value
  const posY = store.isOpen === true ? 0 : pointerEventY.value

  if (Math.round(motion.cursor.currentPosX) !== Math.round(posX) || Math.round(motion.cursor.currentPosY) !== Math.round(posY)) {
    motion.cursor.newPosX = motion.cursor.currentPosX + (posX - motion.cursor.currentPosX) * motion.cursor.speed
    motion.cursor.newPosY = motion.cursor.currentPosY + (posY - motion.cursor.currentPosY) * motion.cursor.speed

    if (DOMcard.value) {
      DOMcard.value.style.setProperty('--ry', (+motion.cursor.newPosX / 18).toFixed(2) + 'deg')
      DOMcard.value.style.setProperty('--rx', (-motion.cursor.newPosY / 22).toFixed(2) + 'deg')
      DOMcard.value.style.setProperty('--tx', (+motion.cursor.newPosX / 50).toFixed(2) + 'px')
      DOMcard.value.style.setProperty('--ty', (+motion.cursor.newPosY / 50).toFixed(2) + 'px')
      DOMcard.value.style.setProperty('--vd', store.isOpen === true ? 'hidden' : 'visible')
      DOMcard.value.style.setProperty('--vo', props.tracker?.isHovered ? '1' : '0')
      DOMcard.value.style.setProperty('--mx', ((1 - ((+motion.cursor.newPosX + cardPos.rect.width / 2) * 100) / cardPos.rect.width / 100) * 100).toFixed(2) + '%')
      DOMcard.value.style.setProperty('--my', ((1 - ((+motion.cursor.newPosY + cardPos.rect.height / 2) * 100) / cardPos.rect.height / 100) * 100).toFixed(2) + '%')
    }

    motion.cursor.currentPosX = motion.cursor.newPosX
    motion.cursor.currentPosY = motion.cursor.newPosY
  } else if (motion.isrAF == true) {
    motion.isrAF = false
    cancelAnimationFrame(motion.rAF)
    DOMcard.value && DOMcard.value.style.setProperty('--vd', props.tracker?.isHovered && store.isOpen === false ? 'visible' : 'hidden')
  }
}

const getCardSizes = async () => {
  await nextTick()
  if (DOMcard.value) {
    const { top, right, bottom, left, width, height } = DOMcard.value.getBoundingClientRect()
    cardPos.rect = { top: top - -window.scrollY, right, bottom, left, width, height }
  }
}

const alreadyMounted = ref<boolean>(false)
onMounted(() => {
  alreadyMounted.value = true
  window.addEventListener('resize', getCardSizes)
  if (hasLoaded.value === true) {
    getCardSizes()
  }
})

onUpdated(() => {
  if (hasLoaded.value === true && alreadyMounted.value === true) {
    getCardSizes()
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', getCardSizes)
})
</script>

<style>
.card-inner {
  transform: rotateX(var(--rx)) rotateY(var(--ry));
  transform-style: preserve-3d;
}

.card-outer {
  transform-style: preserve-3d;
}
.card,
.card-behind {
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}
.card-behind {
  transform: rotateY(180deg);
}
.card-container {
  --rx: 0deg;
  --ry: 0deg;
  --tx: 0px;
  --ty: 0px;
  --mx: 50%;
  --my: 50%;
  --vd: hidden;
  --vo: 0;

  transform-style: preserve-3d;
  perspective: 600px;
}
.card-inner::after {
  opacity: var(--vo, 0);
  visibility: var(--vd, hidden);
  pointer-events: none;
  background: radial-gradient(farthest-corner circle at var(--mx, 50%) var(--my, 50%), rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.45) 20%, rgba(0, 0, 0, 0.5) 100%);
}
.card-inner::before {
  background: radial-gradient(farthest-corner circle at var(--mx, 50%) var(--my, 50%), rgba(255, 255, 255, 0.272) 0%, rgba(255, 255, 255, 0.23) 20%, rgba(0, 0, 0, 0.5) 100%);
}

.card-container::before {
  background: rgb(27, 27, 27);
  visibility: var(--vd, hidden);
  pointer-events: none;
  transform: translate3d(calc(var(--tx, 0) * -16), calc(var(--ty, 0) * -18), -35px) scale(0.8);
}
</style>
