<template>
  <div>
    <h2 class="text-600 mb-12">{{ name }}</h2>
    <form class="w-full space-y-12" @submit.prevent="requestFaucet">
      <Input :label="'Enter your wallet address'" :placeholder="'e.g. g1juwee0ynsdvaukvxk3j5s4cl6nn24uxwlydxrl'" v-model="bindAddress" />
      <Select v-if="store.selectedFaucet.Amounts" :label="'Select faucet amount'" :options="options" @update="(option) => SelectAmount(option)" />
      <Recaptcha @validation="captchaValidation" />
      <div>
        <div class="flex gap-4">
          <Button text="Cancel" variant="outline" @click.prevent="() => closePopup()" class="w-full" />
          <Button text="Request Faucet" class="w-full" type="submit" />
        </div>
        <div v-if="error" class="text-center text-red-200 mt-6">{{ errorDetail[error] }}</div>
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
import { Status, Faucet } from '@/types'

type Props = {
  name: Faucet['Name']
  options: SelectOption[]
  error?: Status | null
}
const props = defineProps<Props>()
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

const errorDetail = {
  FAIL: 'Request failed',
  EMPTY: 'Not sufficient tokens available on this network. Try lowering the requested amount or try again later.',
  INVALID_ADDRESS: 'Invalid wallet address',
  BUSY_FAUCET: 'Too many requests',
}

const requestFaucet = () => {
  if (captchaValid.value === false) return
  emit('requestFaucet', bindAddress.value, store.selectedFaucet.Amounts && amount.value?.value, captchaSecret.value)
}
</script>
