<template>
  <div class="flex flex-col items-center justify-center text-center">
    <h2 class="text-500 mt-8">Faucet request successful</h2>
    <div class="js-faucetsuccessdetail h-0 overflow-hidden">
      <p class="font-light text-grey-100 mt-6">
        You can now check your faucet balance.<br /><a
          class="text-light underline hover:text-grey-100 transition-colors ease-in-out"
          :href="txLink"
          v-if="txLink"
          >Transaction on GnoScan</a
        >.
      </p>

      <Button text="Done" class="w-full mt-12" @click.prevent="() => $emit('doneFaucet')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/ui/Button.vue'

interface Props {
  txLink?: string
}

defineProps<Props>()
</script>
