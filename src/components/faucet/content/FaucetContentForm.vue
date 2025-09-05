<template>
  <div>
    <h2 class="text-500 md:text-600 mb-8 md:mb-12">{{ name }}</h2>
    <button @click="() => closePopup()" class="absolute right-4 top-4"><IconClose class="block w-6 h-6" /></button>

    <div class="w-full space-y-7 md:space-y-12">
      <Input :label="'Enter your wallet address'" :placeholder="'e.g. g1juwee0ynsdvaukvxk3j5s4cl6nn24uxwlydxrl'" v-model="store.prefilledAddress" required />
      <Select v-if="store.selectedFaucet.amounts && store.selectedFaucet.amounts.length > 1" :label="'Select faucet amount'" :options="options" @update="(option) => SelectAmount(option)" />
      <Recaptcha v-if="!store.selectedFaucet.github_oauth_client_id" :key="store.status" @validation="captchaValidation" :captchakey="store.selectedFaucet.recaptcha" />
      <div>
        <div class="flex flex-col gap-3">
          <div v-if="store.availableRewards > 0" class="relative flex">
            <div class="flex-1 absolute right-2 top-1/2 rounded text-50 font-medium flex items-center bg-green-900 text-green-200 px-4 py-2 -translate-y-1/2 ">{{ convertFromUgnot(store.availableRewards.toString()) }}GNOT</div>
            <Button text="Claim Reward" class="w-full" type="button" @click="handleClaimRewards" />
          </div>
          
          <Button :text="dripButtonText" class="w-full" type="submit" :disabled="!isFormValid" @click="handleDripFaucet" />
        </div>
        <div v-if="error" class="text-center text-red-200 mt-6">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'
import Button from '@/components/ui/Button.vue'
import Recaptcha from '@/components/ui/Recaptcha.vue'
import IconClose from '@/components/icons/IconClose.vue'

import { useFaucetDetail } from '@/stores/faucetDetail'
import { convertFromUgnot } from '@/utils/amount'

import { SelectOption } from '@/components/ui/Select.vue'
import { Faucet } from '@/types'

type Props = {
  name: Faucet['name']
  options: SelectOption[]
  error?: string | null
}
defineProps<Props>()
const store = useFaucetDetail()

const amount = ref<SelectOption | null>(null)
const captchaValid = ref(false)
const captchaSecret = ref('')

// Reset amount when faucet changes
watch(
  () => store.selectedFaucet.name,
  (newName, oldName) => {
    if (newName !== oldName) {
      amount.value = null
    }
  }
)

const captchaValidation = ({ code = 'error', secret = '' }) => {
  captchaValid.value = code === 'success'
  captchaSecret.value = secret
}

const isAddressValid = computed(() => new RegExp(/^[a-z0-9]{40}$/).test(store.prefilledAddress || ''))
const isFormValid = computed(() => {
  if (store.selectedFaucet.github_oauth_client_id) {
    return isAddressValid.value
  }
  return isAddressValid.value && captchaValid.value
})

const dripButtonText = computed(() => {
  if (!store.selectedFaucet.github_oauth_client_id) {
    return 'Request drip'
  }
  
  if (store.availableRewards > 0) {
    return 'Request Drip'
  } else {
    return 'Connect GitHub & Get Rewards'
  }
})

const SelectAmount = (option: SelectOption) => {
  amount.value = option
}

const closePopup = () => store.popupToggle()

const handleClaimRewards = async () => {
  if (!isFormValid.value) return

  await store.claimRewards()
}

const handleDripFaucet = async () => {
  if (!isFormValid.value) return

  const requestData = {
    address: store.prefilledAddress || '',
    amount: Number(amount.value?.value || store.selectedFaucet.amounts[0] || 0),
  }

  if (store.selectedFaucet.github_oauth_client_id) {
    // case: drip with GH (connected drip)
    if (store.availableRewards > 0) {
      // case: drip after GH is connected (btn only available if rewards are available otherwise btn is not visible)
      await store.requestDripWithGithubConnected()
    } else {
      // case: drip before GH is connected (first time request)
      await store.requestDripWithGithub(requestData.address, requestData.amount)
    }
  } else {
    // case: drip without GH (normal drip)
    await store.requestWithCaptcha(requestData.address, requestData.amount, captchaSecret.value)
  }
}
</script>
