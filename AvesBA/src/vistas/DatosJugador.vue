<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();

onMounted(() => {
  authStore.cargarPerfil();
});
</script>

// Componente para mostrar los datos del jugador.
<template>
  <div>
    <h1>Datos del Jugador</h1>
    <p v-if="authStore.cargando">Cargando...</p>
    <p v-else-if="authStore.error" class="error">{{ authStore.error }}</p>
    <div v-else>
      <p><strong>Nombre:</strong> {{ authStore.nombreCompleto }}</p>
      <p><strong>Email:</strong> {{ authStore.jugador.email }}</p>
      <p><strong>Rol:</strong> {{ authStore.jugador.role }}</p>
    </div>
  </div>
</template>