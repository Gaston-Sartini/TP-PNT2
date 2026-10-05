<script setup>
const props = defineProps({
    acerto: Boolean,
    nombreCorrecto: String,
});

</script>

<template>
    <div>
        <p v-if="acerto" class="mensaje-correcto">¡Correcto! La respuesta es {{ nombreCorrecto }}.</p>
        <p v-else class="mensaje-incorrecto">Incorrecto. La respuesta correcta es {{ nombreCorrecto }}.</p>
    </div>
</template>

<style scoped>
.mensaje-correcto {
    background-color: #d1fae5;
    color: #065f46;
}

.mensaje-incorrecto {
    background-color: #fee2e2;
    color: #7f1d1d;
}
</style>

