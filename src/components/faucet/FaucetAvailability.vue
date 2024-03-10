<script setup lang="ts">
interface Props {
  available: boolean
}

const props = defineProps<Props>()
</script>

<template>
  <div
    class="relative flex items-center justify-center rounded-full w-fit px-4 py-3 text-100 before:h-1.5 before:w-1.5 before:rounded-circle before:block before:mr-2"
    :class="props.available ? 'bg-green-900 before:bg-green-200' : 'bg-red-900 before:bg-red-200'"
  >
    <span :class="props.available ? 'text-green-200' : 'text-red-200'">{{
      props.available ? 'Enough faucet' : 'Empty. Try Later'
    }}</span>
  </div>
</template>
