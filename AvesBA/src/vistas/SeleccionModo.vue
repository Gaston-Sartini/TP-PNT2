<script setup>
import JuegoImagenes from '../components/JuegoImagenes.vue';
import {ref} from 'vue';
const modo = ref('');
function mostrarResultado(event) {
    console.log('Partida terminada con aciertos:', event.aciertos, 'de', event.total, 'y XP:', event.xp);
}
</script>

<template>
  <div class="contenedor">
    <nav class="barra-lateral">
      <router-link to="/modo" class="boton-nav">Jugar Individual</router-link>
      <router-link to="/grupo" class="boton-nav">Jugar en Grupo</router-link>
      <router-link to="/datos-jugador" class="boton-nav">Datos del Jugador</router-link>
      <router-link to="/ranking" class="boton-nav">Ranking</router-link>
      <router-link to="/metricas" class="boton-nav">Métricas</router-link>
    </nav>
    <div class="contenido">
      <div class="modos">
        <button type="button" class="boton-modo" @click="modo = 'imagen'" :class="{ activo: modo === 'imagen'}">Solo Imagen</button>
        <button type="button" class="boton-modo" @click="modo = 'audio'" :class="{ activo: modo === 'audio'}">Solo Audios</button>
        <button type="button" class="boton-modo" @click="modo = 'ambas'" :class="{ activo: modo === 'ambas'}">Ambas</button>
      </div>
      <div class="area-juego">
        <JuegoImagenes v-if="modo === 'imagen'" @partida-terminada="mostrarResultado"/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contenedor {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
}

.barra-lateral {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 180px;
}

.boton-nav {
  padding: 0.5rem;
  border: 1px solid #38bdf8;
  border-radius: 8px;
  text-align: center;
  text-decoration: none;
  color: inherit;
}

.boton-nav.router-link-active {
  background: #38bdf8;
  color: white;
}

.contenido {
  flex: 1;
}

.modos {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.boton-modo {
  padding: 0.5rem 1rem;
  border: 1px solid #38bdf8;
  border-radius: 8px;
  background: white;
  cursor: pointer;
}

.area-juego {
  border: 1px solid #38bdf8;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  min-height: 250px;
  padding: 1rem;
}

.activo {
  background: #38bdf8;
  color: white;
}
</style>