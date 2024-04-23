<template>
  <div>
    <h2 class="text-500 md:text-600 mb-8 md:mb-12">{{ name }}</h2>
    <form class="w-full space-y-7 md:space-y-12" @submit.prevent="requestFaucet">
      <Input :label="'Enter your wallet address'" :placeholder="'e.g. g1juwee0ynsdvaukvxk3j5s4cl6nn24uxwlydxrl'" v-model="bindAddress" required />
      <Select v-if="store.selectedFaucet.amounts" :label="'Select faucet amount'" :options="options" @update="(option) => SelectAmount(option)" />
      <Recaptcha @validation="captchaValidation" :captchakey="store.selectedFaucet.recaptcha" />
      <div>
        <div class="flex flex-col md:flex-row gap-4">
          <Button text="Cancel" variant="outline" @click.prevent="() => closePopup()" class="w-full" />
          <Button text="Request drip" class="w-full" type="submit" :disabled="captchaValid === false || bindAddress === ''" />
        </div>
        <div v-if="error" class="text-center text-red-200 mt-6">{{ error }}</div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'
import Button from '@/components/ui/Button.vue'
import Recaptcha from '@/components/ui/Recaptcha.vue'

import { useFaucetDetail } from '@/stores/faucetDetail'

import { SelectOption } from '@/components/ui/Select.vue'
import { Faucet } from '@/types'

type Props = {
  name: Faucet['name']
  options: SelectOption[]
  error?: string | null
}
defineProps<Props>()
const store = useFaucetDetail()

const bindAddress = ref('')
const amount = ref<SelectOption | null>(null)
const captchaValid = ref(false)
const captchaSecret = ref('')

const captchaValidation = ({ code = 'error', secret = '' }) => {
  captchaValid.value = code === 'success'
  captchaSecret.value = secret
}

const SelectAmount = (option: SelectOption) => {
  amount.value = option
}
const closePopup = () => store.popupToggle()

const emit = defineEmits(['requestFaucet'])

const requestFaucet = () => {
  if (captchaValid.value === false || bindAddress.value === '') return
  emit('requestFaucet', bindAddress.value, store.selectedFaucet.amounts && amount.value?.value, captchaSecret.value)
}
</script>
