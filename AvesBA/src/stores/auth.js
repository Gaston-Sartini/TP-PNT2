import { defineStore } from 'pinia'
import { login as loginService, obtenerPerfil, logout } from '../servicios/authService.js'

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
    async cerrarSesion() {
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