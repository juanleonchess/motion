<script setup>
/**
 * Motion Library – Rive animation (gomodal-quickanalysis_v6.riv) with
 * state machine sm-main and view model vm-main data binding.
 */
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { Rive } from '@rive-app/canvas'
import rivUrl from '@/assets/animations/gomodal-quickanalysis_v6.riv?url'

const belowCanvasRefs = ref([])
const belowRiveInstances = ref([])

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
  })
})

onUnmounted(() => {
  belowRiveInstances.value.forEach((r) => r.cleanup())
  belowRiveInstances.value = []
})
</script>

<template>
  <div class="motion-page">
    <div class="motion-below">
      <div class="motion-below__container">
        <canvas
          v-for="(_, idx) in 3"
          :key="idx"
          :ref="(el) => setBelowCanvasRef(el, idx)"
          class="motion-below__canvas"
          width="133"
          height="64"
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
}

.motion-below__canvas {
  display: block;
  width: 133px;
  height: 64px;
}
</style>
