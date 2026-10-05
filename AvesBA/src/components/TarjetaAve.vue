<script setup>
const props = defineProps({
    foto: String,
    atribucion: String,
});
</script>

<template>
    <img :src="foto" alt="Foto del ave a identificar" class="imagen-ave" />
    <p class="texto-suave atribucion">{{ atribucion }}</p>
</template>

<style scoped>
.imagen-ave {
  display: block;
  width: 100%;
  aspect-ratio: 3 / 2;
  object-fit: contain;
  background: var(--color-primario-suave);
  border-radius: var(--radio);
}
.atribucion {
  margin: 0.25rem 0 0.75rem;
}
</style>
