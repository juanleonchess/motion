# Rive Configuration: Quick Analysis Animations (Chess)

**Key:** `teams.design.public.animations.rive chess`  
**Source:** `gomodal-quickanalysis_v6.riv`

## Overview

Quick analysis move-type animations (Best, Great, Brilliant, etc.) displayed in metric cards. Uses Rive Canvas runtime with view model data binding.

## Runtime Setup

- **Runtime:** `@rive-app/canvas`
- **State machine:** `sm-main`
- **View model:** `vm-main` (autoBind: true)
- **Canvas:** 133×64px per instance

## View Model Properties

| Property | Type | Description | Example values |
|----------|------|-------------|----------------|
| `move-string` | string | Display label for move type | "Mejor", "Great", "Brillante" |
| `move-counter` | **number** | Move count (use `vmi.number()`, not `string`) | 8, 9, 12 |
| `position-delay-enum` | enum | Timing/classification for reveal animation | See below |
| `move-type-enum` | enum | Move type for state machine | "Best", "Great", "Brilliant" |
| `restart` | trigger | Re-evaluate state machine after binding | Call `.trigger()` after setting values |

## position-delay-enum Values

| Value | Effect |
|-------|--------|
| `firstMoveClassification` | First move timing |
| `secondMoveClassification` | Second move timing |
| `thirdMoveClassification` | Third move timing |

## Implementation Notes

1. **move-counter is number:** Use `vmi.number('move-counter')` and set numeric values. `vmi.string('move-counter')` returns null.
2. **Fire restart after binding:** Call `vmi.trigger('restart').trigger()` after setting all view model values so the state machine re-evaluates with the new data.
3. **Binding order:** Set string, number, enum values, then fire restart trigger.

## Usage in Vue (MotionMetricCards.vue)

```javascript
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
  const restartTrigger = vmi.trigger('restart')
  if (moveString) moveString.value = b.moveString
  if (moveCounter) moveCounter.value = b.moveCounter
  if (positionDelayEnum) positionDelayEnum.value = b.positionDelayEnum
  if (moveTypeEnum) moveTypeEnum.value = b.moveTypeEnum
  if (restartTrigger) restartTrigger.trigger()
}
```
