<script setup>
const props = defineProps({
    nombre: String,
    nombreCientifico: String,
    estado: String,
    deshabilitado: Boolean,
});
const elegir =  defineEmits(['elegir']);
</script>

<template>
    <button class="boton opcion" :class="estado" :disabled="deshabilitado" @click="elegir('elegir')">
        {{ nombre }} <em class="cientifico">({{ nombreCientifico }})</em>
    </button>
</template>

<style scoped>
.opcion {
    display: block;
    margin-bottom: 0.5rem;
    padding: 0.6rem 0.75rem;
    text-align: left;
    font-size: 1rem;
}
.opcion:hover:not(:disabled) {
    background: var(--color-primario-suave);
}
.opcion:disabled {
    cursor: default;
}
.cientifico {
    font-size: 0.8rem;
    color: var(--color-texto-suave);
}
.opcion.correcta {
    background: var(--color-exito);
    border-color: var(--color-exito);
    color: white;
}
.opcion.incorrecta {
    background: var(--color-error);
    border-color: var(--color-error);
    color: white;
}
.correcta .cientifico,
.incorrecta .cientifico {
    color: white;
}
</style>
