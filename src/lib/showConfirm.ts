import { Modal } from '@arco-design/web-vue'

export function showConfirm(title: string, content: string = '') {
  return new Promise<boolean>(resolve => {
    Modal.confirm({
      title,
      content,
      onOk() {
        resolve(true)
      },
      onCancel() {
        resolve(false)
      },
    })
  })
}
