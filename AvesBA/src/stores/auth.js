import { defineStore } from 'pinia'
import { login as loginService, obtenerPerfil, logout } from '../servicios/authService.js'
import { API_BASE_URL } from '../servicios/httpClient.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    jugador: null,
    cargando: true,
    error: '',
    horaIngreso: null
  }),
  getters: {
    estaLogueado: (state) => state.jugador !== null,
    nombreCompleto: (state) => state.jugador ? `${state.jugador.nombre} ${state.jugador.apellido}` : '',
    esAdmin: (state) => ['admin', 'moderador'].includes(state.jugador?.role)
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
    registrarTiempoConectado() {
      // Reutilizable: la llama tanto App.vue (cierre de pestaña/beforeunload)
      // como cerrarSesion() (logout explícito desde el menú), pedido del profesor el 27/10.
      if (!this.horaIngreso) return
      const tiempoConectado = Date.now() - this.horaIngreso
      const url = `${API_BASE_URL}/api/user-connection-log`
      const data = JSON.stringify({
        userId: this.jugador?.id ?? null,
        tiempoConectado
      })
      navigator.sendBeacon(url, data)
      this.horaIngreso = null
    },
    async cerrarSesion() {
      this.registrarTiempoConectado()
      await logout()
      this.jugador = null
    },
    async login(email, password) {
      await loginService(email, password)
      this.horaIngreso = Date.now()
      await this.cargarPerfil() 
    }
  }
})