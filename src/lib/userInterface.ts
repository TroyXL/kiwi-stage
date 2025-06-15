import { Modal } from '@arco-design/web-vue'
import text, { type TextKey } from './text'

export function showConfirm(title: TextKey, content?: TextKey) {
  return new Promise<boolean>(resolve => {
    Modal.confirm({
      title: text[title],
      content: content ? text[content] : '',
      onOk() {
        resolve(true)
      },
      onCancel() {
        resolve(false)
      },
    })
  })
}
