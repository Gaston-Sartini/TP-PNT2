<script setup>
import { onUnmounted } from 'vue'
import { useAuthStore } from './stores/auth.js'
import { API_BASE_URL } from './servicios/httpClient.js'

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
  <nav>
    <router-link to="/">Login</router-link> |
    <router-link to="/registro">Registro</router-link> |
    <router-link to="/modo">Selección de modo</router-link>
  </nav>
  <router-view />
</template>
