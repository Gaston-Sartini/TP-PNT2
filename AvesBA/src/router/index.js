import { createRouter, createWebHistory } from 'vue-router'
import Login from '../vistas/Login.vue'
import Registro from '../vistas/Registro.vue'
import SeleccionModo from '../vistas/SeleccionModo.vue'
import JugarGrupo from '../vistas/JugarGrupo.vue'
import DatosJugador from '../vistas/DatosJugador.vue'
import Ranking from '../vistas/Ranking.vue'
import Metricas from '../vistas/Metricas.vue'

const routes = [
  { path: '/', component: Login },
  { path: '/registro', component: Registro },
  { path: '/modo', component: SeleccionModo },
  { path: '/grupo', component: JugarGrupo },
  { path: '/datos-jugador', component: DatosJugador },
  { path: '/ranking', component: Ranking },
  { path: '/metricas', component: Metricas },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router