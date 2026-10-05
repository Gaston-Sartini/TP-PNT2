<script setup>   
const props = defineProps({
    numeroPregunta: Number,
    aciertos: Number,
    totalPreguntas: Number,
    racha: Number,
    xp: Number
});
</script>

<template>
    <div>
        <p>Pregunta {{ numeroPregunta }} de {{ totalPreguntas }}</p>
        <p>Aciertos: {{ aciertos }}</p>
        <p>Racha: {{ racha }}</p>
        <p>XP: {{ xp }}</p>
    </div>
</template>

<style scoped>

</style>