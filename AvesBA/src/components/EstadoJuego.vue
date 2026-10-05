<script setup>   
const props = defineProps({
    numeroPregunta: Number,
    aciertos: Number,
    totalPreguntas: Number,
});
</script>

<template>
    <div>
        <p>Pregunta {{ numeroPregunta }} de {{ totalPreguntas }}</p>
        <p>Aciertos: {{ aciertos }}</p>
    </div>
</template>

<style scoped>

</style>