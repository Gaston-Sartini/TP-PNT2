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
    <div class="estado">
        <p>Pregunta {{ numeroPregunta }} de {{ totalPreguntas }}</p>
        <p>Aciertos: {{ aciertos }}</p>
        <p>Racha: {{ racha }}</p>
        <p>XP: {{ xp }}</p>
    </div>
</template>

<style scoped>
.estado {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 0.25rem 0.75rem;
    margin-bottom: 0.75rem;
    font-size: 0.85rem;
    font-weight: bold;
}
.estado p {
    margin: 0;
}
</style>
