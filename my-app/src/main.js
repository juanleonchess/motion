// Design System CSS imports (ORDER MATTERS)
import '@chesscom/design-system/dist/variables.css'
import '@chesscom/design-system/dist/cc-utils.css'
import '@chesscom/design-system/dist/style.css'

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

// Design system inject() expects this key (provideDesignSystem not exported from package)
app.provide('design-system-key', {
  features: [],
  routes: {
    webMemberView: (username) => `/member/${username}`,
    webAbout: '/about',
    webMembership: (params) => `/membership/${params.tier || 'gold'}`,
    webMemberTitledPlayers: '/titled-players',
  },
  trans: {
    Close: 'Close',
    Avatar: 'Avatar',
    'Avatar of %username%': (username) => `Avatar of ${username}`,
    Back: 'Back',
    'Back to Top': 'Back to Top',
    'Loading...': 'Loading...',
  },
})

app.mount('#app')
