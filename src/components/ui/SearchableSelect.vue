<template>
  <div class="relative w-full" ref="container">
    <input
      type="text"
      v-model="search"
      class="w-full rounded bg-grey-400 border border-grey-300 p-4 outline-none focus:border-light hover:border-grey-100 ease-in-out duration-300"
      :placeholder="selected ? selected.content : placeholder"
      :class="selected && !isOpen ? 'text-light' : ''"
      @focus="open"
      @input="open"
      @click="open"
    />
    <div v-if="selected && !isOpen" class="absolute inset-0 flex items-center px-4 pointer-events-none">
      <span class="text-light">{{ selected.content }}</span>
    </div>
    <ul
      v-show="isOpen"
      class="absolute z-50 w-full mt-1 max-h-48 overflow-y-auto rounded bg-grey-400 border border-grey-300 scrollbar-thin"
    >
      <li
        v-for="(option, idx) in filtered"
        :key="idx"
        @mousedown.prevent="select(option)"
        class="p-3 cursor-pointer hover:bg-grey-200"
        :class="selected?.value === option.value && 'bg-grey-200'"
      >
        {{ option.content }}
      </li>
      <li v-if="filtered.length === 0" class="p-3 text-grey-200">No results</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

export type SearchableSelectOption = {
  content: string
  value: string
}

type Props = {
  options: SearchableSelectOption[]
  placeholder?: string
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search...',
  modelValue: '',
})

const emit = defineEmits(['update:modelValue'])

const search = ref('')
const isOpen = ref(false)
const container = ref<HTMLElement | null>(null)

const selected = computed(() =>
  props.modelValue ? props.options.find((o) => o.value === props.modelValue) || null : null
)

const filtered = computed(() => {
  if (!search.value) return props.options
  const q = search.value.toLowerCase()
  return props.options.filter((o) => o.content.toLowerCase().includes(q))
})

const open = () => {
  isOpen.value = true
}

const select = (option: SearchableSelectOption) => {
  emit('update:modelValue', option.value)
  search.value = ''
  isOpen.value = false
}

const onClickOutside = (e: MouseEvent) => {
  if (container.value && !container.value.contains(e.target as Node)) {
    isOpen.value = false
    search.value = ''
  }
}

onMounted(() => document.addEventListener('mousedown', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('mousedown', onClickOutside))
</script>

<style scoped>
::placeholder {
  @apply text-grey-200;
  opacity: 1;
}
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}
</style>
