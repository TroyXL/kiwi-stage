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
import { i18n } from './lib/i18n'
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

;(function colorSchemeAdaptor() {
  // 监听系统深色模式变化
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  // 更新深色模式类
  function updateDarkMode(e: MediaQueryListEvent | MediaQueryList) {
    if (e.matches) {
      document.body.classList.add('dark')
      document.body.setAttribute('arco-theme', 'dark')
    } else {
      document.body.classList.remove('dark')
      document.body.removeAttribute('arco-theme')
    }
  }

  // 初始化深色模式
  updateDarkMode(darkModeMediaQuery)
  // 添加深色模式变化监听器
  darkModeMediaQuery.addEventListener('change', updateDarkMode)
})()

createApp(App)
  .use(router)
  .use(createPinia())
  .use(ArcoVue)
  .use(ArcoVueIcon)
  .use(useGlobalInjects)
  .use(i18n)
  .mount('#app')
