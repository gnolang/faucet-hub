import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueRecaptcha } from 'vue-recaptcha'

import './style.css'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.component('vue-recaptcha', VueRecaptcha)
app.mount('#app')
