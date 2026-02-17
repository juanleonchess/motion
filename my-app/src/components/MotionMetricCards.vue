<script setup>
/**
 * Motion Library – Rive animation (gameplay_v6gameoverscreen_quickanalysis.riv) with
 * state machine sm-main and view model vm-main data binding.
 */
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { Rive, Layout, Fit } from '@rive-app/canvas'
import rivUrl from '@/assets/animations/gameplay_v6gameoverscreen_quickanalysis.riv?url'

const belowCanvasRefs = ref([])
const belowRiveInstances = ref([])
const containerRef = ref(null)
let resizeObserver = null
let dprMediaQuery = null

function setBelowCanvasRef(el, index) {
  if (el) {
    belowCanvasRefs.value[index] = el
  }
}

const BINDINGS = [
  { moveString: 'Mejor', moveCounter: 12, positionDelayEnum: 'firstMoveClassification', moveTypeEnum: 'Best' },
  { moveString: 'Great', moveCounter: 8, positionDelayEnum: 'secondMoveClassification', moveTypeEnum: 'Great' },
  { moveString: 'Brillante', moveCounter: 9, positionDelayEnum: 'thirdMoveClassification', moveTypeEnum: 'Brilliant' },
]

function applyViewModelBindings(riveInstance, index) {
  const vmi = riveInstance.viewModelInstance
  if (!vmi) return
  const b = BINDINGS[index] ?? BINDINGS[0]
  const moveString = vmi.string('move-string')
  const moveCounter = vmi.number('move-counter')
  const positionDelayEnum = vmi.enum('position-delay-enum')
  const moveTypeEnum = vmi.enum('move-type-enum')
  if (moveString) moveString.value = b.moveString
  if (moveCounter) moveCounter.value = b.moveCounter
  if (positionDelayEnum) positionDelayEnum.value = b.positionDelayEnum
  if (moveTypeEnum) moveTypeEnum.value = b.moveTypeEnum
}

function resizeAllRiveSurfaces() {
  belowRiveInstances.value.forEach((r) => r.resizeDrawingSurfaceToCanvas())
}

onMounted(() => {
  nextTick(async () => {
    let buffer
    try {
      const res = await fetch(rivUrl)
      if (!res.ok) throw new Error(`fetch ${res.status} ${res.statusText}`)
      buffer = await res.arrayBuffer()
    } catch (e) {
      console.error('[Rive] Failed to load .riv:', e)
      return
    }
    const belowCanvases = belowCanvasRefs.value
    for (let j = 0; j < 3; j++) {
      const belowCanvas = belowCanvases[j]
      if (!belowCanvas || !buffer) continue
      const r = new Rive({
        buffer,
        canvas: belowCanvas,
        layout: new Layout({ fit: Fit.Layout }),
        autoplay: false,
        stateMachines: 'sm-main',
        autoBind: true,
        onLoad: () => {
          r.resizeDrawingSurfaceToCanvas()
          applyViewModelBindings(r, j)
          r.play('sm-main')
        },
        onLoadError: (err) => {
          console.error('Rive below load error:', err)
        },
      })
      belowRiveInstances.value.push(r)
    }
    await nextTick()
    const container = containerRef.value
    if (container) {
      resizeObserver = new ResizeObserver(resizeAllRiveSurfaces)
      resizeObserver.observe(container)
      belowCanvasRefs.value.forEach((canvas) => {
        if (canvas) resizeObserver.observe(canvas)
      })
      dprMediaQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
      dprMediaQuery.addEventListener('change', resizeAllRiveSurfaces)
    }
  })
})

onUnmounted(() => {
  if (containerRef.value && resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  if (dprMediaQuery) {
    dprMediaQuery.removeEventListener('change', resizeAllRiveSurfaces)
    dprMediaQuery = null
  }
  belowRiveInstances.value.forEach((r) => r.cleanup())
  belowRiveInstances.value = []
})
</script>

<template>
  <div class="motion-page">
    <div class="motion-below">
      <div ref="containerRef" class="motion-below__container">
        <canvas
          v-for="(_, idx) in 3"
          :key="idx"
          :ref="(el) => setBelowCanvasRef(el, idx)"
          class="motion-below__canvas"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.motion-page {
  background-color: var(--color-gray-800);
  min-height: 100vh;
  padding: var(--space-24);
}

.motion-below {
  width: 100%;
}

.motion-below__container {
  display: flex;
  flex-direction: row;
  gap: 8px;
  width: 100%;
  max-width: 1264px; /* 3 * 416 + 2 * 8 gap */
  height: 64px;
}

.motion-below__canvas {
  display: block;
  flex: 1 1 0;
  min-width: 0; /* allow flex shrinking */
  max-width: 416px;
  width: 100%;
  height: 100%;
  min-height: 54px;
  max-height: 64px;
}
</style>
