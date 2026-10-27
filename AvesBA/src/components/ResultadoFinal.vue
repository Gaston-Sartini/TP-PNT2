<script setup>
// Pantalla de fin de partida. Solo muestra: recibe los números por props
// y avisa con un evento cuando el jugador quiere volver a jugar.
import { computed } from 'vue';

const props = defineProps({
    aciertos: Number,
    total: Number,
    xp: Number,
});
const emit = defineEmits(['reiniciar']);

const precision = computed(() => Math.round((props.aciertos / props.total) * 100));

// Medalla y mensaje según cuántas acertó
const premio = computed(() => {
    if (props.aciertos >= 9) return { icono: '🏆', titulo: '¡Nivel experto!' };
    if (props.aciertos >= 7) return { icono: '🥇', titulo: '¡Muy buen ojo!' };
    if (props.aciertos >= 5) return { icono: '🥈', titulo: '¡Buen vuelo!' };
    if (props.aciertos >= 3) return { icono: '🥉', titulo: 'Vas aprendiendo' };
    return { icono: '🐣', titulo: '¡A seguir practicando!' };
});

// De 0 a 3 estrellas según el porcentaje de aciertos
const estrellas = computed(() => Math.round((props.aciertos / props.total) * 3));
</script>

<template>
    <div class="has-text-centered">
        <!-- av-anim-rebote: estilos/animaciones.css -->
        <p class="av-trofeo av-anim-rebote">{{ premio.icono }}</p>
        <h2 class="title is-3 mb-2">{{ premio.titulo }}</h2>

        <p class="av-estrellas mb-4" :aria-label="`${estrellas} de 3 estrellas`">
            <span v-for="n in 3" :key="n" :class="n <= estrellas ? 'av-estrella-llena' : 'av-estrella-vacia'">★</span>
        </p>

        <!-- level / level-item / heading: Bulma, para poner los números en fila -->
        <nav class="level is-mobile box av-numeros">
            <div class="level-item">
                <div>
                    <p class="heading">Aciertos</p>
                    <p class="title is-4">{{ aciertos }}/{{ total }}</p>
                </div>
            </div>
            <div class="level-item">
                <div>
                    <p class="heading">XP</p>
                    <p class="title is-4 av-xp">⭐ {{ xp }}</p>
                </div>
            </div>
            <div class="level-item">
                <div>
                    <p class="heading">Precisión</p>
                    <p class="title is-4">{{ precision }}%</p>
                </div>
            </div>
        </nav>

        <button type="button" class="button is-primary is-medium is-fullwidth av-elevable" @click="emit('reiniciar')">
            🔁 Jugar de nuevo
        </button>
    </div>
</template>

<style scoped>
/* De dónde sale cada estilo:
   - level, box, title, heading, button: Bulma.
   - Animación del trofeo: av-anim-rebote (estilos/animaciones.css).
   - Colores: estilos/tema.css. Lo de abajo es solo de esta pantalla. */

.av-trofeo {
    font-size: 4.5rem;
    line-height: 1.1;
    margin-bottom: 0.5rem;
}

.av-estrellas {
    font-size: 2rem;
    letter-spacing: 0.2rem;
}
.av-estrella-llena {
    color: var(--color-dorado);
}
.av-estrella-vacia {
    color: #d8d3bd;
}

.av-numeros {
    background-color: var(--color-crema);
    box-shadow: none;
}
.av-xp {
    color: var(--color-madera);
}
</style>
