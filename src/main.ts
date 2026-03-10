import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { faucetDetailPlugin } from '@/stores/faucetDetail'

import './style.css'
import App from './App.vue'

const pinia = createPinia()
pinia.use(faucetDetailPlugin)

const app = createApp(App)

app.use(pinia)
app.mount('#app')
