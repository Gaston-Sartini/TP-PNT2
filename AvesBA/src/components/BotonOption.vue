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
    <button :class="estado" :disabled="deshabilitado" @click="elegir('elegir')">
        {{ nombre }} <em>({{ nombreCientifico }})</em>
    </button>
</template>

<style scoped>
.correcta {
    background-color: green;
    color:white;
}
.incorrecta {
    background-color: red;
    color:white;
}
</style>