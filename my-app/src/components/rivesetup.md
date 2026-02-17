# Rive Setup – MotionMetricCards.vue

How the Rive animation file is loaded, configured, and bound inside `MotionMetricCards.vue`.

---

## Rive File

| Item | Value |
|------|-------|
| **File** | `gameplay_v6gameoverscreen_quickanalysis.riv` |
| **Location** | `src/assets/animations/` |
| **Runtime** | `@rive-app/canvas` (Canvas renderer) |
| **Import** | Vite `?url` suffix for asset URL resolution |

```js
import rivUrl from '@/assets/animations/gameplay_v6gameoverscreen_quickanalysis.riv?url'
```

---

## Canvas Setup

Three `<canvas>` elements are rendered in a horizontal row via `v-for`. Each canvas hosts its own independent Rive instance.

```html
<canvas
  v-for="(_, idx) in 3"
  :key="idx"
  :ref="(el) => setBelowCanvasRef(el, idx)"
  class="motion-below__canvas"
  width="133"
  height="64"
/>
```

Canvas refs are collected into a reactive array (`belowCanvasRefs`) so each instance can target the correct DOM element by index.

---

## Rive Instance Initialization

The `.riv` file is fetched once as an `ArrayBuffer`, then shared across all three Rive instances. Each instance is created inside `onMounted` → `nextTick` to ensure canvas elements are in the DOM.

```js
const r = new Rive({
  buffer,              // shared ArrayBuffer from the single .riv fetch
  canvas: belowCanvas, // individual <canvas> element
  autoplay: false,     // IMPORTANT: must be false (see Startup Order below)
  stateMachines: 'sm-main',
  autoBind: true,      // auto-binds the default view model instance
  onLoad: () => {
    r.resizeDrawingSurfaceToCanvas()
    applyViewModelBindings(r, j)
    r.play('sm-main')
  },
})
```

### Key Configuration

| Property | Value | Why |
|----------|-------|-----|
| `autoplay` | `false` | Prevents `sm-main` from starting before view model bindings are applied. Without this, `position-delay-enum` is ignored because the reveal-animation layer reads it only at entry time. |
| `stateMachines` | `'sm-main'` | The single state machine in the `.riv` file that drives all animation layers. |
| `autoBind` | `true` | Automatically binds the default view model instance (`vm-main`) so `r.viewModelInstance` is available in `onLoad`. |

---

## Startup Order (Critical)

The order inside `onLoad` matters. Bindings **must** be applied before the state machine starts:

1. `r.resizeDrawingSurfaceToCanvas()` — match canvas drawing surface to CSS size
2. `applyViewModelBindings(r, j)` — set all view model property values
3. `r.play('sm-main')` — start the state machine **after** bindings are in place

If `autoplay: true` were used instead, `sm-main` would start immediately on load, and the `reveal animation` layer would evaluate `position-delay-enum` before it has been set — causing all cards to animate with default timing instead of their intended staggered delays.

---

## View Model (`vm-main`)

The Rive file contains a single view model `vm-main` with these properties:

| Property | Type | Accessor | Description |
|----------|------|----------|-------------|
| `move-string` | string | `vmi.string('move-string')` | Display label for the move type |
| `move-counter` | number | `vmi.number('move-counter')` | Move count (must use `.number()`, not `.string()`) |
| `position-delay-enum` | enum | `vmi.enum('position-delay-enum')` | Controls reveal animation stagger timing |
| `move-type-enum` | enum | `vmi.enum('move-type-enum')` | Selects move-type animation (Best, Great, Brilliant, etc.) |

---

## Bindings Per Card

Each card (left to right) receives different values from the `BINDINGS` array:

| Index | Card | `move-string` | `move-counter` | `position-delay-enum` | `move-type-enum` |
|-------|------|---------------|----------------|-----------------------|------------------|
| 0 | Left | `"Mejor"` | `12` | `firstMoveClassification` | `Best` |
| 1 | Middle | `"Great"` | `8` | `secondMoveClassification` | `Great` |
| 2 | Right | `"Brillante"` | `9` | `thirdMoveClassification` | `Brilliant` |

### `position-delay-enum` Values

| Value | Effect |
|-------|--------|
| `firstMoveClassification` | 0ms delay (reveals immediately) |
| `secondMoveClassification` | 200ms delay |
| `thirdMoveClassification` | 400ms delay |

### `move-type-enum` Values (All Possible)

`All`, `Brilliant`, `Great`, `Best`, `Excellent`, `Good`, `Book`, `Inaccuracy`, `Mistake`, `Miss`, `Blunder`

---

## State Machine (`sm-main`)

The state machine has four layers:

| Layer | Purpose |
|-------|---------|
| `move_type` | Selects the move-type animation (driven by `move-type-enum` via Any State transitions) |
| `reveal animation` | Controls staggered reveal timing (driven by `position-delay-enum` at Entry State) |
| `sparkles` | Sparkle effects for Brilliant/Great moves |
| `responsivenes` | Height-based responsive layout switching |

---

## Cleanup

All Rive instances are cleaned up in `onUnmounted` to release WASM resources:

```js
onUnmounted(() => {
  belowRiveInstances.value.forEach((r) => r.cleanup())
  belowRiveInstances.value = []
})
```
