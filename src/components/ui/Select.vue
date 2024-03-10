<template>
  <div class="group flex flex-col items-start text-200">
    <label class="mb-3" v-if="label">{{ label }}</label>
    <div
      @click="openClose()"
      class="relative cursor-pointer w-full rounded-t bg-grey-400 border border-b-0 border-grey-300 group-hover:border-grey-100 duration-300 ease-in-out p-4 pb-1 outline-none after:absolute after:top-[60%] after:right-4 after:-translate-x-1/2 after:w-0 after:h-0 after:duration-700 after:ease-in-out after:transition-transform after:border-l-[5px] after:border-l-transparent after:border-t-[6px] after:border-t-grey-50 after:border-r-[5px] after:border-r-transparent"
      :class="openState && 'after:rotate-180'"
      :aria-expanded="openState"
      aria-controls="listbox"
      aria-haspopup="listbox"
      aria-labelledby="combo"
      role="combobox"
      tabindex="0"
      :aria-activedescendant="selectedOption.content"
    >
      {{ selectedOption.content }}
    </div>
    <ul
      ref="DOMoptions"
      @click="openClose()"
      class="flex flex-col cursor-pointer h-3 pt-3 w-full bg-grey-400 rounded-b border border-t-0 border-grey-300 group-hover:border-grey-100 transition-colors duration-300 ease-in-out overflow-hidden"
      role="listbox"
      id="listbox"
      aria-labelledby="combo"
      tabindex="-1"
    >
      <li
        v-for="(option, idx) in options"
        :key="idx"
        @click="selectOption(idx)"
        role="option"
        class="p-4 hover:bg-grey-200"
        :class="idx === selectedOption.idx && 'bg-grey-200'"
        :aria-selected="idx === selectedOption.idx"
      >
        {{ option.content }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { gsap } from 'gsap'

export type SelectOption = {
  content: string
  value: string | number | boolean
}
type Props = {
  label?: string
  options: SelectOption[]
}
const props = withDefaults(defineProps<Props>(), {
  options: () => [{ content: 'default', value: '' }],
})

const emit = defineEmits(['update'])

const DOMoptions = ref<HTMLElement | null>(null)
let openState = ref(false)

const openClose = () => {
  gsap.to(DOMoptions.value, {
    height: openState.value ? '12px' : 'auto',
    onStart: () => {
      openState.value = !openState.value
    },
  })
}

// TODO: use computed instead
const selectedOption = reactive({ idx: 0, content: '', value: '' as string | number | boolean })
const selectOption = (idx = 0) => {
  selectedOption.idx = idx
  selectedOption.content = props.options[idx].content
  selectedOption.value = props.options[idx].value

  emit('update', selectedOption)
}

watch(
  () => props.options,
  () => {
    selectOption(0)
  },
)

onMounted(() => {
  selectOption(0)
})
</script>
