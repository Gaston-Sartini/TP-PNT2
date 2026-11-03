<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRankingStore } from '../stores/ranking.js'
import { useAuthStore } from '../stores/auth.js'

const rankingStore = useRankingStore()
const authStore = useAuthStore()
const { filas, totalJugadores, limite, cargando, error } = storeToRefs(rankingStore)
const medallas = ['🥇', '🥈', '🥉']

onMounted(() => rankingStore.cargarRanking())
</script>

<template>
  <section class="box av-ranking" :aria-busy="cargando">
    <div class="av-encabezado mb-4">
      <div>
        <h1 class="title is-3 mb-2">🏆 Ranking</h1>
        <p class="av-texto-suave">Conocé a los jugadores con más puntos y seguí sumando con cada ave.</p>
      </div>
      <router-link to="/modo" class="button is-primary av-elevable">🐦 Jugar</router-link>
    </div>
    <div class="av-controles mb-4">
      <div class="field mb-0">
        <label for="ranking-limite" class="label">Jugadores a mostrar</label>
        <div class="select">
          <select id="ranking-limite" v-model.number="limite" :disabled="cargando" @change="rankingStore.cargarRanking()">
            <option v-for="cantidad in [10, 25, 50, 100]" :key="cantidad" :value="cantidad">Top {{ cantidad }}</option>
          </select>
        </div>
      </div>
      <button class="button is-light av-elevable" :class="{ 'is-loading': cargando }" :disabled="cargando" @click="rankingStore.cargarRanking()">Actualizar ranking</button>
    </div>
    <div v-if="cargando" role="status" class="py-5 has-text-centered">
      <p class="mb-3">🐦 Buscando a los mejores observadores...</p>
      <progress class="progress is-small is-primary" max="100"></progress>
    </div>
    <div v-else-if="error" class="notification is-danger is-light" role="alert">
      <p class="mb-3">{{ error }}</p>
      <button class="button is-danger is-light" @click="rankingStore.cargarRanking()">Reintentar</button>
    </div>
    <div v-else-if="filas.length === 0" class="notification is-info is-light">🐣 Todavía no hay jugadores en el ranking. ¡Jugá una partida para empezar!</div>
    <template v-else>
      <p class="av-texto-suave mb-3" aria-live="polite">Mostrando {{ filas.length }} jugadores · Total informado: {{ totalJugadores }}</p>
      <div class="table-container">
        <table class="table is-fullwidth is-hoverable">
          <caption class="has-text-left av-texto-suave mb-3">Clasificación por puntos acumulados</caption>
          <thead>
            <tr>
              <th scope="col">Puesto</th><th scope="col">Jugador</th>
              <th scope="col" class="has-text-right">Puntos</th><th scope="col" class="has-text-right">Aciertos</th>
              <th scope="col" class="has-text-right">Fallos</th><th scope="col" class="has-text-right">Precisión</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="jugador in filas" :key="jugador.user_id" :class="{ 'av-mi-fila': jugador.user_id === authStore.jugador?.id }">
              <td class="av-puesto"><span v-if="jugador.posicion <= 3" aria-hidden="true">{{ medallas[jugador.posicion - 1] }}</span> {{ jugador.posicion }}</td>
              <th scope="row">{{ jugador.nombre }} {{ jugador.apellido }} <span v-if="jugador.user_id === authStore.jugador?.id" class="tag is-primary is-light ml-2">Vos</span></th>
              <td class="has-text-right av-puntos">{{ jugador.puntos_totales }}</td>
              <td class="has-text-right">{{ jugador.aciertos }}</td><td class="has-text-right">{{ jugador.fallos }}</td>
              <td class="has-text-right">{{ jugador.precision === null ? 'Sin respuestas' : `${jugador.precision}%` }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="av-texto-suave is-size-7">Precisión = aciertos / (aciertos + fallos) × 100. Tu fila se destaca si estás entre los jugadores mostrados.</p>
    </template>
  </section>
</template>

<style scoped>
.av-ranking { border-top: 5px solid var(--color-dorado); }
.av-encabezado, .av-controles {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
.av-controles { justify-content: flex-start; align-items: flex-end; }
.table th, .table td { vertical-align: middle; }
.av-puesto { white-space: nowrap; font-weight: 700; }
.av-puntos { color: var(--color-madera); font-weight: 800; }
.table tbody tr.av-mi-fila {
  background-color: var(--color-crema);
  box-shadow: inset 4px 0 var(--color-musgo);
}
@media (max-width: 768px) {
  .table { min-width: 620px; }
}
</style>