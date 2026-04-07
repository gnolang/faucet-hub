<template>
  <div>
    <h2 class="text-500 md:text-600 mb-8 md:mb-12">{{ name }}</h2>
    <button @click="() => closePopup()" class="absolute right-4 top-4"><IconClose class="block w-6 h-6" /></button>

    <!-- Phase 1: Connect GitHub -->
    <div v-if="!store.interestFormGithubUsername" class="w-full space-y-7 md:space-y-12">
      <p class="text-grey-100 text-200">Connect your GitHub account to request a larger amount of Gno.land Beta tokens</p>
      <Button text="Connect GitHub" class="w-full" type="button" @click="handleConnectGithub" />
    </div>

    <!-- Phase 2: Full form -->
    <div v-else class="interest-form">
      <div class="w-full space-y-7 md:space-y-12 text-200">
        <div class="flex items-center gap-2">
          <span class="bg-grey-400 border border-grey-300 rounded px-3 py-1.5 text-light font-medium">@{{ store.interestFormGithubUsername }}</span>
          <span class="text-grey-100">connected via GitHub</span>
        </div>

        <Input label="Email *" placeholder="you@example.com" type="email" v-model="form.email" :invalid="showEmailError" />

        <Input label="GNO address *" placeholder="e.g. g1juwee0ynsdvaukvxk3j5s4cl6nn24uxwlydxrl" v-model="form.gno_address" :invalid="showGnoAddressError" />

        <Input label="Requested GNOT amount *" placeholder="e.g. 1000" type="number" v-model="form.requested_gnot_amount" />

        <Textarea label="What are you building or interested in building on Gno.land? *" placeholder="Describe your project or interest..." v-model="form.building_interest" :rows="3" />

        <div class="flex flex-col items-start">
          <Select label="How did you learn about Gno.land? *" :options="howLearnedOptions" @update="(option) => (form.how_learned = String(option.value))" />
        </div>

        <Input label="Company / Organization" placeholder="e.g. Acme Corp" v-model="form.company" />

        <!-- Socials -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="X" placeholder="@yourhandle" v-model="form.social_x" />
          <Input label="Telegram" placeholder="@yourhandle" v-model="form.social_telegram" />
          <Input label="Other" placeholder="https://yoursite.com" v-model="form.social_other" />
        </div>
      

        <Input label="Cosmos / Atone address" placeholder="e.g. cosmos1... or atone1..." v-model="form.cosmos_address"/>

        <div class="flex flex-col items-start">
          <label class="mb-2">Country *</label>
          <SearchableSelect :options="countryOptions" placeholder="Type to search..." v-model="form.country" />
        </div>

        <div>
          <Button text="Submit Application" class="w-full" type="submit" :disabled="!isFormValid" @click="handleSubmit" />
          <div v-if="error" class="text-center text-red-200 mt-6">{{ error }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'

import Input from '@/components/ui/Input.vue'
import Textarea from '@/components/ui/Textarea.vue'
import Select from '@/components/ui/Select.vue'
import SearchableSelect from '@/components/ui/SearchableSelect.vue'
import Button from '@/components/ui/Button.vue'
import IconClose from '@/components/icons/IconClose.vue'
import countryOptions from '@/data/countries.json'
import { useFaucetDetail } from '@/stores/faucetDetail'
import { isGnoAddressValid, isCosmosAddressValid, isEmailValid as checkEmail } from '@/utils/validation'
import type { Faucet } from '@/types'

type Props = {
  name: Faucet['name']
  error?: string | null
}
defineProps<Props>()

const store = useFaucetDetail()

const form = reactive({
  email: '',
  building_interest: '',
  company: '',
  social_x: '',
  social_telegram: '',
  social_other: '',
  how_learned: '',
  gno_address: '',
  cosmos_address: '',
  country: '',
  requested_gnot_amount: '',
})

const howLearnedOptions = [
  { content: 'Select...', value: '' },
  { content: 'Twitter / X', value: 'twitter' },
  { content: 'GitHub', value: 'github' },
  { content: 'Discord', value: 'discord' },
  { content: 'Blog / Article', value: 'blog' },
  { content: 'Conference / Event', value: 'conference' },
  { content: 'Friend / Colleague', value: 'referral' },
  { content: 'Other', value: 'other' },
]

const isEmailValid = computed(() => checkEmail(form.email))
const showEmailError = computed(() => form.email.trim() !== '' && !isEmailValid.value)
const showGnoAddressError = computed(() => form.gno_address.trim() !== '' && !isGnoAddressValid(form.gno_address.trim()))

const isFormValid = computed(() => {
  return (
    store.interestFormGithubUsername &&
    isEmailValid.value &&
    isGnoAddressValid(form.gno_address.trim()) &&
    isCosmosAddressValid(form.cosmos_address.trim()) &&
    form.building_interest.trim() !== '' &&
    form.how_learned !== '' &&
    form.country !== '' &&
    String(form.requested_gnot_amount).trim() !== ''
  )
})

const closePopup = () => store.popupToggle()

const handleConnectGithub = () => {
  store.startInterestFormOAuth()
}

const handleSubmit = async () => {
  if (!isFormValid.value) return

  const socials = [
    form.social_x ? `X: ${form.social_x}` : '',
    form.social_telegram ? `Telegram: ${form.social_telegram}` : '',
    form.social_other ? `Other: ${form.social_other}` : '',
  ].filter(Boolean).join('; ')

  await store.submitInterestForm({
    github_token: store.interestFormGithubToken,
    email: form.email,
    building_interest: form.building_interest,
    company: form.company,
    socials,
    how_learned: form.how_learned,
    gno_address: form.gno_address,
    cosmos_address: form.cosmos_address,
    country: form.country,
    requested_gnot_amount: String(form.requested_gnot_amount),
  })
}
</script>
