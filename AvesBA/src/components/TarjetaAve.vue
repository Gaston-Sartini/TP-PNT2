<script setup>   
const props = defineProps({
    foto: String,
    atribucion: String,
});
</script>

<template>
    <img :src="foto" class="imagen-ave" />
    <p>{{ atribucion }}</p>
</template>

<style scoped>
.imagen-ave {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
</style>