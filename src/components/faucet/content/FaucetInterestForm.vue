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
    <div v-else class="interest-form w-full space-y-4 max-h-[55vh] overflow-y-auto pr-4 text-100">
      <div class="flex items-center gap-2">
        <span class="bg-grey-400 border border-grey-300 rounded px-3 py-1.5 text-light font-medium">@{{ store.interestFormGithubUsername }}</span>
        <span class="text-grey-100">connected via GitHub</span>
      </div>

      <Input label="Email *" placeholder="you@example.com" v-model="form.email" />

      <Input label="GNO address *" placeholder="e.g. g1juwee0ynsdvaukvxk3j5s4cl6nn24uxwlydxrl" v-model="form.gno_address" />

      <Input label="Requested GNOT amount *" placeholder="e.g. 1000" type="number" v-model="form.requested_gnot_amount" />

      <Textarea label="What are you building or interested in building on Gno.land? *" placeholder="Describe your project or interest..." v-model="form.building_interest" :rows="3" />

      <div class="flex flex-col items-start">        
        <Select label="How did you learn about Gno.land? *" :options="howLearnedOptions" @update="(option) => (form.how_learned = String(option.value))" />
      </div>

      <Input label="Company / Organization" placeholder="e.g. Acme Corp" v-model="form.company" />

      <div class="flex flex-col items-start gap-2">
        <Input label="X" placeholder="e.g. @yourhandle" v-model="form.social_x" />
        <Input label="Telegram" placeholder="e.g. @yourhandle" v-model="form.social_telegram" />
        <Input label="Other" placeholder="e.g. https://yoursite.com" v-model="form.social_other" />
      </div>

      <Input label="Atom / Cosmos address" placeholder="e.g. cosmos1..." v-model="form.cosmos_address" class="text-100"/>

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

const isAddressValid = (address: string) => {
 if (!address.startsWith('g1')) {
  return false
 } else {
  return new RegExp(/^[ac-hj-np-z02-9]{40}$/).test(address.slice(2).toLowerCase())
 }
}
const isFormValid = computed(() => {
  return (
    store.interestFormGithubUsername &&
    form.email.trim() !== '' &&
    isAddressValid(form.gno_address.trim()) &&
    form.building_interest.trim() !== '' &&
    form.how_learned !== '' &&
    form.country !== '' &&
    form.requested_gnot_amount.trim() !== ''
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
    github_username: store.interestFormGithubUsername,
    email: form.email,
    building_interest: form.building_interest,
    company: form.company,
    socials,
    how_learned: form.how_learned,
    gno_address: form.gno_address,
    cosmos_address: form.cosmos_address,
    country: form.country,
    requested_gnot_amount: form.requested_gnot_amount,
  })
}
</script>

<style scoped>
/* Custom scrollbar for form area */
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

/* Compact inputs/selects within interest form */
.interest-form :deep(input),
.interest-form :deep(textarea) {
  padding: 0.5rem 0.75rem;
}
.interest-form :deep(label) {
  margin-bottom: 0.375rem;
}
.interest-form :deep([role="combobox"]) {
  padding: 0.5rem 0.75rem 0.25rem;
}
.interest-form :deep([role="listbox"] li) {
  padding: 0.5rem 0.75rem;
}
</style>
