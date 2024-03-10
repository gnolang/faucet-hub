import { Ref, onMounted, onUnmounted, ref, isRef, unref, computed } from 'vue'

export type MotionTracker = Ref<{
  x: number
  y: number
  isHovered: boolean
  id: number
}>
type Active = {
  el: MotionTracker | undefined
}

/**
 * @name useMouseDelegation
 * @desc Create an Event delegation for mousemouve event
 * @param {Ref<HTMLElement | null>} container Container element that hosts the delegation
 * @param {Array} list List of element to listen
 * @param {string} datasetRef ID data-* name inserted in elements list (eg: "ref" for data-ref="id")
 * @returns {Ref<MotionTracker[]>} Motion: Array of motion objects for each element from the list — {x, y, isHover, id: Must be used inside data-* attribute }
 */
export const useMouseDelegation = (container: Ref<HTMLElement | null>, list: any, datasetRef: string) => {
  const active: Active = { el: undefined }
  const motions = computed<MotionTracker[]>(() =>
    (isRef(list) ? list.value : list).map((_: any, i: number) => ref({ x: 0, y: 0, ishover: false, id: i })),
  )

  onMounted(() => {
    const inContainer = unref(container)
    if (inContainer) {
      inContainer.addEventListener('mousemove', mouseMoveEvent)
      inContainer.addEventListener('mouseleave', mouseLeaveEvent)
    }
  })
  onUnmounted(() => {
    const inContainer = unref(container)
    if (inContainer) {
      inContainer.removeEventListener('mousemove', mouseMoveEvent)
      inContainer.removeEventListener('mouseleave', mouseLeaveEvent)
    }
  })

  const mouseMoveEvent = (e: any) => {
    e.preventDefault()

    const cardEl = e.target.closest('[data-ref]')
    if (!cardEl) {
      if (active.el) {
        active.el.value.x = 0
        active.el.value.y = 0
        active.el.value.isHovered = false
      }
      active.el = undefined
      return
    } else if (active.el?.value && cardEl?.dataset[datasetRef] !== active.el?.value.id) {
      active.el.value.x = 0
      active.el.value.y = 0
      active.el.value.isHovered = false
    }
    active.el = motions.value.find((motion: MotionTracker) => motion.value.id.toString() === cardEl.dataset[datasetRef])

    if (active.el?.value) {
      active.el.value.x = e.pageX
      active.el.value.y = e.pageY
      active.el.value.isHovered = true
    }
  }

  const mouseLeaveEvent = () => {
    motions.value.forEach((motion: MotionTracker) => {
      const inMotion = unref(motion)

      inMotion.x = 0
      inMotion.y = 0
      inMotion.isHovered = false
    })
  }

  return { motions }
}
