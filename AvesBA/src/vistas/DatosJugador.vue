<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();

onMounted(() => {
  authStore.cargarPerfil();
});
</script>

<!-- Componente para mostrar los datos del jugador. -->
<template>
  <div class="box av-ficha">
    <h1 class="title is-3">Datos del jugador</h1>

    <progress v-if="authStore.cargando" class="progress is-small is-primary" max="100"></progress>
    <p v-else-if="authStore.error" class="notification is-danger is-light">{{ authStore.error }}</p>

    <!-- media / media-left / media-content: Bulma, para poner el avatar al lado de los datos -->
    <div v-else class="media">
      <div class="media-left">
        <p class="av-avatar">{{ authStore.jugador.nombre?.charAt(0) }}</p>
      </div>
      <div class="media-content">
        <p class="title is-4 mb-2">{{ authStore.nombreCompleto }}</p>
        <p class="mb-3 av-email">{{ authStore.jugador.email }}</p>
        <span class="tag is-primary is-light is-medium">Rol: {{ authStore.jugador.role }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* De dónde sale cada estilo:
   - box, title, media, tag, progress, notification: Bulma.
   - Colores: estilos/tema.css. Lo de abajo es solo de esta pantalla. */

.av-ficha {
  max-width: 560px;
}

/* Emails largos: que corten de línea en vez de desbordar */
.av-email {
  overflow-wrap: anywhere;
}

/* Círculo con la inicial del jugador */
.av-avatar {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-musgo);
  color: white;
  font-family: var(--fuente-titulos);
  font-size: 2rem;
  border: 3px solid var(--color-dorado);
}
</style>
