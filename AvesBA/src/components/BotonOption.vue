<script setup>
import { computed } from 'vue';

const props = defineProps({
    nombre: String,
    nombreCientifico: String,
    estado: String,
    deshabilitado: Boolean,
});
const elegir =  defineEmits(['elegir']);

// Traduce el estado que manda el juego a clases visuales:
// - color de Bulma: is-success (verde hoja) o is-danger (terracota)
// - animación: latido si es la correcta, sacudida si es la incorrecta
const clasesEstado = computed(() => {
    if (props.estado === 'correcta') return ['is-success', 'av-anim-latido'];
    if (props.estado === 'incorrecta') return ['is-danger', 'av-anim-sacudida'];
    return [];
});
</script>

<template>
    <!-- button / is-fullwidth: Bulma. av-elevable: estilos/base.css. av-opcion: abajo. -->
    <button class="button is-fullwidth av-opcion av-elevable" :class="clasesEstado" :disabled="deshabilitado" @click="elegir('elegir')">
        <span class="av-nombre">{{ nombre }}</span>
        <em class="av-cientifico">{{ nombreCientifico }}</em>
    </button>
</template>

<style scoped>
/* De dónde sale cada estilo:
   - button, is-fullwidth, is-success, is-danger: Bulma (con los colores de estilos/tema.css).
   - av-elevable: estilos/base.css.  - av-anim-latido / av-anim-sacudida: estilos/animaciones.css.
   - Lo de abajo es solo de este componente. */

/* Los botones de Bulma centran el texto en una línea; acá lo queremos
   alineado a la izquierda, en dos renglones (nombre y nombre científico). */
.av-opcion {
    height: auto;
    flex-direction: column;
    align-items: flex-start;
    white-space: normal;
    text-align: left;
    padding: 0.65rem 1rem;
    margin-bottom: 0.6rem;
    border: 2px solid #ddd8c4;
}
.av-opcion:hover:not(:disabled) {
    border-color: var(--color-salvia);
}

.av-nombre {
    font-weight: 700;
}
.av-cientifico {
    font-size: 0.8rem;
    color: var(--color-texto-suave);
}

/* Bulma pone transparentes los botones deshabilitados. Después de responder
   están todos deshabilitados: la correcta y la elegida se ven enteras,
   y las demás quedan apagadas. */
.av-opcion[disabled] {
    opacity: 0.55;
}
.av-opcion.is-success[disabled],
.av-opcion.is-danger[disabled] {
    opacity: 1;
}
.av-opcion.is-success .av-cientifico,
.av-opcion.is-danger .av-cientifico {
    color: white;
}
</style>
