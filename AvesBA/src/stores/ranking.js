import { defineStore } from 'pinia'
import { obtenerRankingCompleto } from '../servicios/metricasService.js'

export const useRankingStore = defineStore('ranking', {
  state: () => ({
    jugadores: [],
    totalJugadores: 0,
    limite: 10,
    cargando: false,
    error: '',
  }),
  getters: {
    filas: (state) => state.jugadores.map((jugador, indice) => {
      const intentos = jugador.aciertos + jugador.fallos
      return {
        ...jugador,
        posicion: indice + 1,
        precision: intentos > 0 ? Math.round(jugador.aciertos / intentos * 100) : null,
      }
    }),
  },
  actions: {
    async cargarRanking() {
      if (this.cargando) return
      this.cargando = true
      this.error = ''
      try {
        const respuesta = await obtenerRankingCompleto(this.limite)
        this.jugadores = respuesta.ranking
        this.totalJugadores = respuesta.total_jugadores
      } catch (err) {
        this.error = err.status === 401
          ? 'Ingresá a tu cuenta para consultar el ranking.'
          : err.message || 'No se pudo cargar el ranking. Intentá nuevamente.'
      } finally {
        this.cargando = false
      }
    },
  },
})