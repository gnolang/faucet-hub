<template>
  <div class="flex flex-col items-center justify-center text-center">
    <h2 class="text-500 mt-8">Faucet request successful</h2>
    <div class="js-faucetsuccessdetail h-0 overflow-hidden">
      <p class="font-light text-grey-100 mt-6">You can now check your wallet balance.</p>

      <Button text="Done" class="w-full mt-12" @click.prevent="() => $emit('doneFaucet')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/ui/Button.vue'

defineEmits(['doneFaucet'])
</script>
