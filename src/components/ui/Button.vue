<template>
  <button class="p-4 rounded border border-light ease-in-out duration-300" :class="[css[variant], disabled && ['!bg-grey-100 !border-grey-100 hover:bg-grey-100 hover:!border-grey-100 hover:cursor-not-allowed']]">{{ text }}</button>
</template>

<script setup lang="ts">
type Props = {
  text: string
  variant?: 'default' | 'outline'
  disabled?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  disabled: false,
})

const css = {
  default: 'bg-light text-dark hover:bg-grey-75 hover:border-grey-75',
  outline: 'bg-transparent text-light hover:border-grey-75 hover:text-grey-75',
}
</script>
