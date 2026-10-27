<script setup>
import { onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth.js'
import { API_BASE_URL } from './servicios/httpClient.js'
import LayoutPrincipal from './components/LayoutPrincipal.vue'

const route = useRoute()
const authStore = useAuthStore()

const handleWindowClose = () => {
  if (!authStore.horaIngreso) return
  const tiempoConectado = Date.now() - authStore.horaIngreso
  const url = `${API_BASE_URL}/api/user-connection-log`
  const data = JSON.stringify({
    userId: authStore.jugador?.id ?? null,
    tiempoConectado
  })
  navigator.sendBeacon(url, data)
}

window.addEventListener('beforeunload', handleWindowClose)

onUnmounted(() => {
  handleWindowClose()
  window.removeEventListener('beforeunload', handleWindowClose)
})
</script>

<template>
  <!-- Pantallas internas (las que tienen meta.conMenu en el router): van dentro del layout.
       <Transition name="pagina"> anima el cambio de pantalla (ver estilos/animaciones.css). -->
  <LayoutPrincipal v-if="route.meta.conMenu">
    <router-view v-slot="{ Component }">
      <Transition name="pagina" mode="out-in">
        <component :is="Component" />
      </Transition>
    </router-view>
  </LayoutPrincipal>

  <!-- Login y Registro: pantalla completa, sin menú -->
  <router-view v-else v-slot="{ Component }">
    <Transition name="pagina" mode="out-in">
      <component :is="Component" />
    </Transition>
  </router-view>
</template>
