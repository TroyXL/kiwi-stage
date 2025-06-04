import ArcoVue from '@arco-design/web-vue'
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'

import '@arco-design/web-vue/dist/arco.css'
import './style.css'

createApp(App).use(ArcoVue).use(router).mount('#app')
