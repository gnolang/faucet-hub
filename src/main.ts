import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueRecaptcha } from 'vue-recaptcha'
import { faucetDetailPlugin } from '@/stores/faucetDetail'

import './style.css'
import App from './App.vue'

const pinia = createPinia()
pinia.use(faucetDetailPlugin)

const app = createApp(App)

app.use(pinia)
app.component('vue-recaptcha', VueRecaptcha)
app.mount('#app')
