<template>
  <button class="p-4 rounded border border-light ease-in-out duration-300" :class="css[variant]">
    {{ text }}
  </button>
</template>

<script setup lang="ts">
type Props = {
  text: string
  variant?: 'default' | 'outline'
}
const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})

const css = {
  default: 'bg-light text-dark hover:bg-grey-75 hover:border-grey-75',
  outline: 'bg-transparent text-light hover:border-grey-75 hover:text-grey-75',
}
</script>
