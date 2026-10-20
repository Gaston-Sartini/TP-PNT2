<script setup>
import { ref, onMounted } from 'vue';
import { obtenerPerfil } from '../servicios/authService.js';

const jugador = ref(null);
const cargando = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    jugador.value = await obtenerPerfil();
  } catch (err) {
    error.value = err.message;
  } finally {
    cargando.value = false;
  }
});
</script>

<template>
  <div>
    <h1>Datos del Jugador</h1>
    <p v-if="cargando">Cargando...</p>
    <p v-else-if="error" class="error">{{ error }}</p>
    <div v-else>
      <p><strong>Nombre:</strong> {{ jugador.nombre }} {{ jugador.apellido }}</p>
      <p><strong>Email:</strong> {{ jugador.email }}</p>
      <p><strong>Rol:</strong> {{ jugador.role }}</p>
    </div>
  </div>
</template>