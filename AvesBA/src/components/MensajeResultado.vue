<script setup>
const props = defineProps({
    acerto: Boolean,
    nombreCorrecto: String,
});
</script>

<template>
    <!-- notification + is-success/is-danger + is-light: aviso de Bulma en verde o rojo suave -->
    <div class="notification av-mensaje" :class="acerto ? 'is-success is-light' : 'is-danger is-light'">
        <span class="av-icono">{{ acerto ? '🎉' : '🌿' }}</span>
        <p v-if="acerto"><strong>¡Correcto!</strong> Es {{ nombreCorrecto }}.</p>
        <p v-else><strong>No era esa.</strong> La respuesta correcta es {{ nombreCorrecto }}.</p>
    </div>
</template>

<style scoped>
/* De dónde sale cada estilo:
   - notification, is-success, is-danger, is-light: Bulma (colores de estilos/tema.css).
   - Lo de abajo es solo de este componente: el ícono a la izquierda del texto. */

.av-mensaje {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
}
.av-icono {
    font-size: 1.75rem;
}
</style>
