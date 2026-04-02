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
        <label class="mb-2">How did you learn about Gno.land? *</label>
        <Select :options="howLearnedOptions" @update="(option) => (form.how_learned = String(option.value))" />
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

const countryOptions = [
  { content: 'Afghanistan', value: 'AF' },
  { content: 'Albania', value: 'AL' },
  { content: 'Algeria', value: 'DZ' },
  { content: 'Andorra', value: 'AD' },
  { content: 'Angola', value: 'AO' },
  { content: 'Antigua and Barbuda', value: 'AG' },
  { content: 'Argentina', value: 'AR' },
  { content: 'Armenia', value: 'AM' },
  { content: 'Australia', value: 'AU' },
  { content: 'Austria', value: 'AT' },
  { content: 'Azerbaijan', value: 'AZ' },
  { content: 'Bahamas', value: 'BS' },
  { content: 'Bahrain', value: 'BH' },
  { content: 'Bangladesh', value: 'BD' },
  { content: 'Barbados', value: 'BB' },
  { content: 'Belarus', value: 'BY' },
  { content: 'Belgium', value: 'BE' },
  { content: 'Belize', value: 'BZ' },
  { content: 'Benin', value: 'BJ' },
  { content: 'Bhutan', value: 'BT' },
  { content: 'Bolivia', value: 'BO' },
  { content: 'Bosnia and Herzegovina', value: 'BA' },
  { content: 'Botswana', value: 'BW' },
  { content: 'Brazil', value: 'BR' },
  { content: 'Brunei', value: 'BN' },
  { content: 'Bulgaria', value: 'BG' },
  { content: 'Burkina Faso', value: 'BF' },
  { content: 'Burundi', value: 'BI' },
  { content: 'Cabo Verde', value: 'CV' },
  { content: 'Cambodia', value: 'KH' },
  { content: 'Cameroon', value: 'CM' },
  { content: 'Canada', value: 'CA' },
  { content: 'Central African Republic', value: 'CF' },
  { content: 'Chad', value: 'TD' },
  { content: 'Chile', value: 'CL' },
  { content: 'China', value: 'CN' },
  { content: 'Colombia', value: 'CO' },
  { content: 'Comoros', value: 'KM' },
  { content: 'Congo (DRC)', value: 'CD' },
  { content: 'Congo (Republic)', value: 'CG' },
  { content: 'Costa Rica', value: 'CR' },
  { content: "Cote d'Ivoire", value: 'CI' },
  { content: 'Croatia', value: 'HR' },
  { content: 'Cuba', value: 'CU' },
  { content: 'Cyprus', value: 'CY' },
  { content: 'Czech Republic', value: 'CZ' },
  { content: 'Denmark', value: 'DK' },
  { content: 'Djibouti', value: 'DJ' },
  { content: 'Dominica', value: 'DM' },
  { content: 'Dominican Republic', value: 'DO' },
  { content: 'Ecuador', value: 'EC' },
  { content: 'Egypt', value: 'EG' },
  { content: 'El Salvador', value: 'SV' },
  { content: 'Equatorial Guinea', value: 'GQ' },
  { content: 'Eritrea', value: 'ER' },
  { content: 'Estonia', value: 'EE' },
  { content: 'Eswatini', value: 'SZ' },
  { content: 'Ethiopia', value: 'ET' },
  { content: 'Fiji', value: 'FJ' },
  { content: 'Finland', value: 'FI' },
  { content: 'France', value: 'FR' },
  { content: 'Gabon', value: 'GA' },
  { content: 'Gambia', value: 'GM' },
  { content: 'Georgia', value: 'GE' },
  { content: 'Germany', value: 'DE' },
  { content: 'Ghana', value: 'GH' },
  { content: 'Greece', value: 'GR' },
  { content: 'Grenada', value: 'GD' },
  { content: 'Guatemala', value: 'GT' },
  { content: 'Guinea', value: 'GN' },
  { content: 'Guinea-Bissau', value: 'GW' },
  { content: 'Guyana', value: 'GY' },
  { content: 'Haiti', value: 'HT' },
  { content: 'Honduras', value: 'HN' },
  { content: 'Hong Kong', value: 'HK' },
  { content: 'Hungary', value: 'HU' },
  { content: 'Iceland', value: 'IS' },
  { content: 'India', value: 'IN' },
  { content: 'Indonesia', value: 'ID' },
  { content: 'Iran', value: 'IR' },
  { content: 'Iraq', value: 'IQ' },
  { content: 'Ireland', value: 'IE' },
  { content: 'Israel', value: 'IL' },
  { content: 'Italy', value: 'IT' },
  { content: 'Jamaica', value: 'JM' },
  { content: 'Japan', value: 'JP' },
  { content: 'Jordan', value: 'JO' },
  { content: 'Kazakhstan', value: 'KZ' },
  { content: 'Kenya', value: 'KE' },
  { content: 'Kiribati', value: 'KI' },
  { content: 'Kosovo', value: 'XK' },
  { content: 'Kuwait', value: 'KW' },
  { content: 'Kyrgyzstan', value: 'KG' },
  { content: 'Laos', value: 'LA' },
  { content: 'Latvia', value: 'LV' },
  { content: 'Lebanon', value: 'LB' },
  { content: 'Lesotho', value: 'LS' },
  { content: 'Liberia', value: 'LR' },
  { content: 'Libya', value: 'LY' },
  { content: 'Liechtenstein', value: 'LI' },
  { content: 'Lithuania', value: 'LT' },
  { content: 'Luxembourg', value: 'LU' },
  { content: 'Macau', value: 'MO' },
  { content: 'Madagascar', value: 'MG' },
  { content: 'Malawi', value: 'MW' },
  { content: 'Malaysia', value: 'MY' },
  { content: 'Maldives', value: 'MV' },
  { content: 'Mali', value: 'ML' },
  { content: 'Malta', value: 'MT' },
  { content: 'Marshall Islands', value: 'MH' },
  { content: 'Mauritania', value: 'MR' },
  { content: 'Mauritius', value: 'MU' },
  { content: 'Mexico', value: 'MX' },
  { content: 'Micronesia', value: 'FM' },
  { content: 'Moldova', value: 'MD' },
  { content: 'Monaco', value: 'MC' },
  { content: 'Mongolia', value: 'MN' },
  { content: 'Montenegro', value: 'ME' },
  { content: 'Morocco', value: 'MA' },
  { content: 'Mozambique', value: 'MZ' },
  { content: 'Myanmar', value: 'MM' },
  { content: 'Namibia', value: 'NA' },
  { content: 'Nauru', value: 'NR' },
  { content: 'Nepal', value: 'NP' },
  { content: 'Netherlands', value: 'NL' },
  { content: 'New Zealand', value: 'NZ' },
  { content: 'Nicaragua', value: 'NI' },
  { content: 'Niger', value: 'NE' },
  { content: 'Nigeria', value: 'NG' },
  { content: 'North Korea', value: 'KP' },
  { content: 'North Macedonia', value: 'MK' },
  { content: 'Norway', value: 'NO' },
  { content: 'Oman', value: 'OM' },
  { content: 'Pakistan', value: 'PK' },
  { content: 'Palau', value: 'PW' },
  { content: 'Palestine', value: 'PS' },
  { content: 'Panama', value: 'PA' },
  { content: 'Papua New Guinea', value: 'PG' },
  { content: 'Paraguay', value: 'PY' },
  { content: 'Peru', value: 'PE' },
  { content: 'Philippines', value: 'PH' },
  { content: 'Poland', value: 'PL' },
  { content: 'Portugal', value: 'PT' },
  { content: 'Qatar', value: 'QA' },
  { content: 'Romania', value: 'RO' },
  { content: 'Russia', value: 'RU' },
  { content: 'Rwanda', value: 'RW' },
  { content: 'Saint Kitts and Nevis', value: 'KN' },
  { content: 'Saint Lucia', value: 'LC' },
  { content: 'Saint Vincent and the Grenadines', value: 'VC' },
  { content: 'Samoa', value: 'WS' },
  { content: 'San Marino', value: 'SM' },
  { content: 'Sao Tome and Principe', value: 'ST' },
  { content: 'Saudi Arabia', value: 'SA' },
  { content: 'Senegal', value: 'SN' },
  { content: 'Serbia', value: 'RS' },
  { content: 'Seychelles', value: 'SC' },
  { content: 'Sierra Leone', value: 'SL' },
  { content: 'Singapore', value: 'SG' },
  { content: 'Slovakia', value: 'SK' },
  { content: 'Slovenia', value: 'SI' },
  { content: 'Solomon Islands', value: 'SB' },
  { content: 'Somalia', value: 'SO' },
  { content: 'South Africa', value: 'ZA' },
  { content: 'South Korea', value: 'KR' },
  { content: 'South Sudan', value: 'SS' },
  { content: 'Spain', value: 'ES' },
  { content: 'Sri Lanka', value: 'LK' },
  { content: 'Sudan', value: 'SD' },
  { content: 'Suriname', value: 'SR' },
  { content: 'Sweden', value: 'SE' },
  { content: 'Switzerland', value: 'CH' },
  { content: 'Syria', value: 'SY' },
  { content: 'Taiwan', value: 'TW' },
  { content: 'Tajikistan', value: 'TJ' },
  { content: 'Tanzania', value: 'TZ' },
  { content: 'Thailand', value: 'TH' },
  { content: 'Timor-Leste', value: 'TL' },
  { content: 'Togo', value: 'TG' },
  { content: 'Tonga', value: 'TO' },
  { content: 'Trinidad and Tobago', value: 'TT' },
  { content: 'Tunisia', value: 'TN' },
  { content: 'Turkey', value: 'TR' },
  { content: 'Turkmenistan', value: 'TM' },
  { content: 'Tuvalu', value: 'TV' },
  { content: 'Uganda', value: 'UG' },
  { content: 'Ukraine', value: 'UA' },
  { content: 'United Arab Emirates', value: 'AE' },
  { content: 'United Kingdom', value: 'GB' },
  { content: 'United States', value: 'US' },
  { content: 'Uruguay', value: 'UY' },
  { content: 'Uzbekistan', value: 'UZ' },
  { content: 'Vanuatu', value: 'VU' },
  { content: 'Vatican City', value: 'VA' },
  { content: 'Venezuela', value: 'VE' },
  { content: 'Vietnam', value: 'VN' },
  { content: 'Yemen', value: 'YE' },
  { content: 'Zambia', value: 'ZM' },
  { content: 'Zimbabwe', value: 'ZW' },
]

const isFormValid = computed(() => {
  return (
    store.interestFormGithubUsername &&
    form.email.trim() !== '' &&
    form.gno_address.trim() !== '' &&
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
