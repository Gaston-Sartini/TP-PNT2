<script setup>
const props = defineProps({
    foto: String,
    atribucion: String,
});
</script>

<template>
    <!-- image: contenedor de imagen de Bulma. av-marco: marco de madera, abajo. -->
    <figure class="image av-marco mb-2">
        <img :src="foto" alt="Foto del ave a identificar" class="av-imagen-ave" />
    </figure>
    <!-- av-texto-suave: estilos/base.css -->
    <p class="av-texto-suave mb-3">📷 {{ atribucion }}</p>
</template>

<style scoped>
/* De dónde sale cada estilo:
   - image: Bulma.  - av-texto-suave: estilos/base.css.
   - Colores (madera, cielo): estilos/tema.css. Lo de abajo es solo de este componente. */

/* Marco como el cartel de madera de la imagen de portada */
.av-marco {
    border: 5px solid var(--color-madera);
    border-radius: var(--radio);
    overflow: hidden;
    box-shadow: var(--sombra-suave);
}

/* La foto se ve entera (contain) en un recuadro 3:2, con fondo celeste cielo */
.av-imagen-ave {
    display: block;
    width: 100%;
    aspect-ratio: 3 / 2;
    object-fit: contain;
    background: var(--color-cielo);
}
</style>
