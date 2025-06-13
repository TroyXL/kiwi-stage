import mitt from 'mitt'
import { onMounted, onUnmounted } from 'vue'

export type EmitterEvents = {
  refreshObjectList: void
}

const emitter = mitt<EmitterEvents>()
export default emitter

export function useEmitter(
  key: keyof EmitterEvents,
  handler: (event: EmitterEvents[keyof EmitterEvents]) => void
) {
  onMounted(() => {
    emitter.on(key, handler)
  })
  onUnmounted(() => {
    emitter.off(key, handler)
  })
}
