import { createRouter, createWebHistory } from 'vue-router'
import Login from '../vistas/Login.vue'
import Registro from '../vistas/Registro.vue'
import SeleccionModo from '../vistas/SeleccionModo.vue'
import JugarGrupo from '../vistas/JugarGrupo.vue'
import DatosJugador from '../vistas/DatosJugador.vue'
import Ranking from '../vistas/Ranking.vue'
import Metricas from '../vistas/Metricas.vue'
// import PerfilEjemplo from '../vistas/PerfilEjemplo.vue'

// meta: { conMenu: true } -> la pantalla se muestra dentro de LayoutPrincipal
// (barra superior + menú lateral). Ver App.vue.
const routes = [
  { path: '/', component: Login },
  { path: '/registro', component: Registro },
  { path: '/modo', component: SeleccionModo, meta: { conMenu: true } },
  { path: '/grupo', component: JugarGrupo, meta: { conMenu: true } },
  { path: '/datos-jugador', component: DatosJugador, meta: { conMenu: true } },
  { path: '/ranking', component: Ranking, meta: { conMenu: true } },
  { path: '/metricas', component: Metricas, meta: { conMenu: true } },
  //{ path: '/perfil', component: PerfilEjemplo },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router