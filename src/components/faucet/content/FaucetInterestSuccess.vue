<template>
  <div class="flex flex-col items-center justify-center text-center">
    <h2 class="text-500 mt-8">Application submitted!</h2>
    <div class="js-faucetsuccessdetail h-0 overflow-hidden">
      <p class="font-light text-grey-100 mt-6">
        Your application for Beta Gno.land funds is now under review. You will be contacted via the email you provided once your application has been approved and funds have been allocated.
      </p>

      <Button text="Done" class="w-full mt-12" @click.prevent="() => $emit('doneFaucet')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/ui/Button.vue'

defineEmits(['doneFaucet'])
</script>
