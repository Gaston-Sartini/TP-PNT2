import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Estilos: el ORDEN importa. Cada archivo puede pisar al anterior.
import 'bulma/css/versions/bulma-no-dark-mode.css' // 1) Bulma: componentes listos (button, box, tag, navbar...). Sin modo oscuro automático.
import './estilos/tema.css'                        // 2) Nuestra paleta, y se la pasamos a Bulma
import './estilos/base.css'                        // 3) Estilos generales y clases propias "av-"
import './estilos/animaciones.css'                 // 4) Transiciones de Vue y efectos

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
