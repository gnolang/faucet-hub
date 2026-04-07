<template>
  <div class="flex flex-col items-start text-200">
    <label class="mb-3">{{ label }}</label>
    <input
      :type="type"
      v-model="model"
      class="w-full rounded bg-grey-400 border p-4 outline-none focus:border-light hover:border-grey-100 ease-in-out duration-300"
      :class="invalid ? 'border-red-200 focus:border-red-200 hover:border-red-200' : 'border-grey-300'"
      :placeholder="placeholder"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
type Props = {
  label: string
  placeholder: string
  modelValue?: string
  type?: string
  invalid?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  invalid: false,
})

const emit = defineEmits(['update:modelValue', 'focus'])
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
