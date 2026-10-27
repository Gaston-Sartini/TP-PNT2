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
    <div class="mb-4">
        <div class="av-fila mb-2">
            <span class="has-text-weight-bold">Pregunta {{ numeroPregunta }} de {{ totalPreguntas }}</span>

            <!-- tags / tag / is-*: etiquetas de Bulma.
                 Cada número va dentro de <Transition name="pop"> con :key igual al valor:
                 cuando el número cambia, Vue lo "re-crea" y se ve el salto (estilos/animaciones.css). -->
            <div class="tags mb-0">
                <span class="tag is-success is-light is-medium" title="Aciertos">
                    ✔&nbsp;<Transition name="pop"><b :key="aciertos">{{ aciertos }}</b></Transition>
                </span>
                <!-- Con 3 o más seguidas, la etiqueta de la racha brilla (av-anim-brillo) -->
                <span class="tag is-warning is-medium" :class="{ 'av-anim-brillo': racha >= 3 }" title="Racha">
                    🔥&nbsp;<Transition name="pop"><b :key="racha">{{ racha }}</b></Transition>
                </span>
                <span class="tag is-warning is-light is-medium" title="Puntos de experiencia">
                    ⭐&nbsp;<Transition name="pop"><b :key="xp">{{ xp }}</b></Transition>&nbsp;XP
                </span>
            </div>
        </div>

        <!-- Barra de avance de la partida: progress de Bulma (is-primary = verde musgo) -->
        <progress class="progress is-primary is-small mb-0" :value="numeroPregunta" :max="totalPreguntas">
            {{ numeroPregunta }} de {{ totalPreguntas }}
        </progress>
    </div>
</template>

<style scoped>
/* De dónde sale cada estilo:
   - tag, tags, progress, is-*: Bulma.  - pop y av-anim-brillo: estilos/animaciones.css.
   - Lo de abajo es solo de este componente. */

/* Texto a la izquierda y etiquetas a la derecha; en pantallas chicas se acomodan abajo */
.av-fila {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
}

/* Para que el "pop" pueda agrandar el número, tiene que ser un bloque en línea */
.tag b {
    display: inline-block;
}
</style>
