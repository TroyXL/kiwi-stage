import ArcoVue, {
  Drawer,
  Message,
  Modal,
  Notification,
} from '@arco-design/web-vue'
import '@arco-design/web-vue/dist/arco.css'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import { setupKiwiErrorHandler } from './kiwi'
import { router } from './router'
import './styles/global.css'
import './styles/override.css'
import './styles/style.css'

const useGlobalInjects = {
  install: (app: ReturnType<typeof createApp>) => {
    ;[Message, Notification, Drawer, Modal].forEach(component => {
      component._context = app._context
    })

    app.config.errorHandler = error => {
      console.error(error)
      Notification.error({
        title: 'Oops...',
        content: (error as any).details || (error as any).message,
      })
    }
    setupKiwiErrorHandler(app.config.errorHandler as KiwiErrorHandler)
  },
}

createApp(App)
  .use(router)
  .use(createPinia())
  .use(ArcoVue)
  .use(ArcoVueIcon)
  .use(useGlobalInjects)
  .mount('#app')
