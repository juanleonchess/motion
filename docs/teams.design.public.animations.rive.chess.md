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
| `move-type-enum` | enum | Move type for state machine | See below |

## position-delay-enum Values

| Value | Delay |
|-------|-------|
| `firstMoveClassification` | 0ms |
| `secondMoveClassification` | 200ms |
| `thirdMoveClassification` | 400ms |

## move-type-enum Values (all possible configurations)

| Value |
|-------|
| `All` |
| `Brilliant` |
| `Great` |
| `Best` |
| `Excellent` |
| `Good` |
| `Book` |
| `Inaccuracy` |
| `Mistake` |
| `Miss` |
| `Blunder` |

## Implementation Notes

1. **move-counter is number:** Use `vmi.number('move-counter')` and set numeric values. `vmi.string('move-counter')` returns null.
2. **Binding order:** Set string, number, and enum values.

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
  if (moveString) moveString.value = b.moveString
  if (moveCounter) moveCounter.value = b.moveCounter
  if (positionDelayEnum) positionDelayEnum.value = b.positionDelayEnum
  if (moveTypeEnum) moveTypeEnum.value = b.moveTypeEnum
}
```
