<template>
  <Transition>
    <div ref="DOMbackground" v-show="model" class="fixed w-screen h-screen top-0 left-0 z-30 bg-darkblur backdrop-blur-sm" @click="closePopup()"></div>
  </Transition>
  <Transition name="fade">
    <article v-if="model" class="popup fixed w-[90vw] h-[80vh] max-w-[70rem] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-grey-500 rounded p-6 md:p-10 border border-grey-300 overflow-scroll no-scrollbar z-max origin-center">
      <button @click="closePopup()" class="absolute right-5 top-5 text-300 md:text-400 text-light hover:text-grey-100 ease-in-out duration-150">✕</button>
      <section class="popup-content">
        <slot />
      </section>
    </article>
  </Transition>
</template>

<script setup lang="ts">
const model = defineModel()

const closePopup = () => (model.value = !model.value)
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.4s;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
  filter: blur(1rem);
}

.fade-enter-active.popup,
.fade-leave-active.popup {
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
  transition: all 0.8s ease;
}

.fade-enter-from.popup,
.fade-leave-to.popup {
  transform: translate3d(-50%, -55%, 0);
  clip-path: polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%);
}

.fade-enter-active .popup-content,
.fade-leave-active .popup-content {
  transition: all 0.8s ease;
  transition-delay: 0.2s;
}

.fade-enter-from .popup-content,
.fade-leave-to .popup-content {
  opacity: 0;
  transition-delay: 0s;
}
</style>
