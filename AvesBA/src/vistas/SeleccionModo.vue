<script setup>
import JuegoImagenes from '../components/JuegoImagenes.vue';
import { ref } from 'vue';

// El menú lateral y "Cerrar sesión" pasaron a components/LayoutPrincipal.vue,
// que envuelve a todas las pantallas internas.
const modo = ref('');

function mostrarResultado(event) {
    console.log('Partida terminada con aciertos:', event.aciertos, 'de', event.total, 'y XP:', event.xp);
}
</script>

<template>
  <div>
    <!-- Cartel de bienvenida con la foto del paisaje (av-fondo-paisaje: estilos/base.css) -->
    <div class="av-cartel av-fondo-paisaje mb-5">
      <h1 class="title is-3 av-cartel-titulo">¿Cómo querés jugar?</h1>
      <p class="av-cartel-texto">Elegí un modo y adiviná qué ave aparece en cada foto.</p>
    </div>

    <!-- Selector de modo. buttons / button / is-*: Bulma.
         El modo elegido se pinta con is-primary; los demás con is-light. -->
    <div class="buttons is-centered mb-5">
      <button type="button" class="button is-medium av-elevable"
        :class="modo === 'imagen' ? 'is-primary' : 'is-light'" @click="modo = 'imagen'">
        📷 Solo imagen
      </button>
      <button type="button" class="button is-medium av-elevable"
        :class="modo === 'audio' ? 'is-primary' : 'is-light'" @click="modo = 'audio'">
        🔊 Solo audio
      </button>
      <button type="button" class="button is-medium av-elevable"
        :class="modo === 'ambas' ? 'is-primary' : 'is-light'" @click="modo = 'ambas'">
        🎲 Ambas
      </button>
    </div>

    <!-- Área de juego: tarjeta blanca centrada (box: Bulma) -->
    <Transition name="aparecer" mode="out-in">
      <div v-if="modo === 'imagen'" key="imagen" class="box av-area-juego">
        <JuegoImagenes @partida-terminada="mostrarResultado" />
      </div>
      <div v-else-if="modo" key="pronto" class="notification is-info is-light av-area-juego has-text-centered">
        🛠️ Este modo todavía está en construcción. ¡Muy pronto!
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* De dónde sale cada estilo:
   - Botones, box, notification: clases de Bulma del template.
   - Foto del cartel: av-fondo-paisaje (estilos/base.css).
   - Transición "aparecer": estilos/animaciones.css.
   - Lo de abajo es solo de esta pantalla. */

.av-cartel {
  border-radius: var(--radio);
  padding: 2rem 1.5rem;
  text-align: center;
  box-shadow: var(--sombra-suave);
}
.av-cartel-titulo {
  color: var(--color-crema);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}
.av-cartel-texto {
  color: var(--color-crema);
  font-weight: 600;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

/* El juego se ve como una tarjeta angosta y centrada */
.av-area-juego {
  max-width: 560px;
  margin: 0 auto;
}
</style>
