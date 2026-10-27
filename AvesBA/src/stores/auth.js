import { defineStore } from 'pinia'
import { obtenerPerfil, logout } from '../servicios/authService.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    jugador: null,
    cargando: true,
    error: ''
  }),
  getters: {
    estaLogueado: (state) => state.jugador !== null,
    nombreCompleto: (state) => state.jugador ? `${state.jugador.nombre} ${state.jugador.apellido}` : ''
  },
  actions: {
    async cargarPerfil() {
      this.cargando = true
      this.error = ''
      try {
        this.jugador = await obtenerPerfil()
      } catch (err) {
        this.error = err.message
      } finally {
        this.cargando = false
      }
    },
    async cerrarSesion() {
      await logout()
      this.jugador = null
    }
  }
})