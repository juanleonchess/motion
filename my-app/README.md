# my-app

Vue 3 + Vite app showcasing Rive animations for motion metric cards.

## Motion Metric Cards

The `MotionMetricCards` component renders three Rive animations (`gomodal-quickanalysis_v6.riv`) with:

- **Fit.Layout** – Uses Rive's layout engine so the artboard fills its container and scales responsively without deforming elements.
- **Responsive containers** – Each canvas flexes with the page (width 300–416px, height 54–64px). The Rive `responsivenes` state machine layer switches between `default_height` (≥55px) and `compact_height` (≤54px) based on rendered height.
- **Resize handling** – `ResizeObserver` on the container and canvases, plus a device-pixel-ratio listener, call `resizeDrawingSurfaceToCanvas()` so layouts update on window resize and DPR changes.
- **View model bindings** – `vm-main` drives move strings, counters, and move-type enums per card.

See [Rive Layout docs](https://rive.app/docs/runtimes/layout) for fit modes and responsive layouts.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
