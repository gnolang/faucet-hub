<template>
  <div>
    <h2 class="text-500 md:text-600 mb-8 md:mb-12">{{ name }}</h2>
    <form class="w-full space-y-7 md:space-y-12" @submit.prevent="handleSubmit">
      <Input :label="'Enter your wallet address'" :placeholder="'e.g. g1juwee0ynsdvaukvxk3j5s4cl6nn24uxwlydxrl'" v-model="bindAddress" required />
      <Select v-if="store.selectedFaucet.amounts && store.selectedFaucet.amounts.length > 1" :label="'Select faucet amount'" :options="options" @update="(option) => SelectAmount(option)" />
      <Recaptcha v-if="!store.selectedFaucet.github_oauth_client_id" :key="store.status" @validation="captchaValidation" :captchakey="store.selectedFaucet.recaptcha" />
      <div>
        <div class="flex flex-col md:flex-row gap-4">
          <Button text="Cancel" variant="outline" @click.prevent="() => closePopup()" class="md:w-1/3" />
          <Button :text="buttonText" class="w-full" type="submit" :disabled="!isFormValid" />
        </div>
        <div v-if="error" class="text-center text-red-200 mt-6">{{ error }}</div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

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

const isAddressValid = computed(() => new RegExp(/^[a-z0-9]{40}$/).test(bindAddress.value))
const isFormValid = computed(() => {
  if (store.selectedFaucet.github_oauth_client_id) {
    return isAddressValid.value
  }
  return isAddressValid.value && captchaValid.value
})

const buttonText = computed(() => (store.selectedFaucet.github_oauth_client_id ? 'Connect GitHub & Get Drip' : 'Request drip'))

const SelectAmount = (option: SelectOption) => {
  amount.value = option
}

const closePopup = () => store.popupToggle()

const handleSubmit = async () => {
  if (!isFormValid.value) return

  const requestData = {
    address: bindAddress.value,
    amount: Number(amount.value?.value || store.selectedFaucet.amounts[0] || 0),
  }

  if (store.selectedFaucet.github_oauth_client_id) {
    await store.requestWithGithub(requestData.address, requestData.amount)
  } else {
    await store.requestWithCaptcha(requestData.address, requestData.amount, captchaSecret.value)
  }
}
</script>
