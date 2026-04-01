<template>
  <div class="flex flex-col items-start">
    <label class="mb-3">{{ label }}</label>
    <textarea
      v-model="model"
      class="w-full rounded bg-grey-400 border border-grey-300 p-4 outline-none focus:border-light hover:border-grey-100 ease-in-out duration-300 resize-none"
      :placeholder="placeholder"
      :rows="rows"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
type Props = {
  label: string
  placeholder: string
  modelValue?: string
  rows?: number
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  rows: 4,
})

const emit = defineEmits(['update:modelValue'])
const model = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  },
})
</script>

<style scoped>
::placeholder {
  @apply text-grey-200;
  opacity: 1;
}
</style>
