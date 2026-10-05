<script setup>
const props = defineProps({
    acerto: Boolean,
    nombreCorrecto: String,
});

</script>

<template>
    <div>
        <p v-if="acerto" class="mensaje mensaje-correcto">¡Correcto! La respuesta es {{ nombreCorrecto }}.</p>
        <p v-else class="mensaje mensaje-incorrecto">Incorrecto. La respuesta correcta es {{ nombreCorrecto }}.</p>
    </div>
</template>

<style scoped>
.mensaje {
    margin: 0.75rem 0;
    padding: 0.6rem 0.75rem;
    border-radius: var(--radio);
    font-weight: bold;
}

.mensaje-correcto {
    background-color: var(--color-exito-fondo);
    color: var(--color-exito-texto);
}

.mensaje-incorrecto {
    background-color: var(--color-error-fondo);
    color: var(--color-error-texto);
}
</style>
