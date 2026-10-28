import { createRouter, createWebHistory } from 'vue-router'
import Login from '../vistas/Login.vue'
import Registro from '../vistas/Registro.vue'
import SeleccionModo from '../vistas/SeleccionModo.vue'
import JugarGrupo from '../vistas/JugarGrupo.vue'
import DatosJugador from '../vistas/DatosJugador.vue'
import Ranking from '../vistas/Ranking.vue'
import Metricas from '../vistas/Metricas.vue'
import MetricasAdmin from '../vistas/MetricasAdmin.vue'
import { useAuthStore } from '../stores/auth.js'
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
  { path: '/admin/metricas', component: MetricasAdmin, meta: { conMenu: true, soloAdmin: true } },
  //{ path: '/perfil', component: PerfilEjemplo },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  if (!to.meta.soloAdmin) return true;

  const authStore = useAuthStore();
  if (!authStore.jugador) await authStore.cargarPerfil();

  if (!authStore.esAdmin) return '/metricas';
  return true;
})

export default router