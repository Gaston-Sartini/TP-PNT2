<script setup>
import JuegoImagenes from '../components/JuegoImagenes.vue';
import { ref } from 'vue';

// El menú lateral y "Cerrar sesión" pasaron a components/LayoutPrincipal.vue,
// que envuelve a todas las pantallas internas.
const modo = ref('');
// En celular los modos se esconden mientras se juega; el botón "Modo" de la barra los muestra
const verModos = ref(false);

// Los tres modos del juego. Se usan para dibujar los botones (grandes o en fila).
const modos = [
  { id: 'imagen', icono: '📷', nombre: 'Solo imagen', descripcion: 'Adiviná el ave por su foto' },
  { id: 'audio', icono: '🔊', nombre: 'Solo audio', descripcion: 'Adiviná el ave por su canto' },
  { id: 'ambas', icono: '🎲', nombre: 'Ambas', descripcion: 'Fotos y cantos mezclados' },
];

function mostrarResultado(event) {
    console.log('Partida terminada con aciertos:', event.aciertos, 'de', event.total, 'y XP:', event.xp);
}
</script>

<template>
  <div>
    <!-- Dos situaciones, con la transición "aparecer" (estilos/animaciones.css) entre una y otra -->
    <Transition name="aparecer" mode="out-in">

      <!-- 1) Todavía no eligió: cartel de bienvenida y los modos grandes, en columna -->
      <div v-if="!modo" key="elegir">
        <!-- av-fondo-paisaje: estilos/base.css -->
        <div class="av-cartel av-fondo-paisaje mb-5">
          <h1 class="title is-3 av-cartel-titulo">¿Cómo querés jugar?</h1>
          <p class="av-cartel-texto">Elegí un modo y adiviná qué ave aparece en cada foto.</p>
        </div>

        <div class="av-modos-grandes">
          <button v-for="m in modos" :key="m.id" type="button" class="button av-modo-grande av-elevable" @click="modo = m.id">
            <span class="av-modo-icono">{{ m.icono }}</span>
            <span class="av-modo-textos">
              <strong>{{ m.nombre }}</strong>
              <small>{{ m.descripcion }}</small>
            </span>
            <span v-if="m.id !== 'imagen'" class="tag is-warning is-light ml-auto">Pronto</span>
          </button>
        </div>
      </div>

      <!-- 2) Ya eligió: el juego, y los modos achicados en el costado.
           <Teleport> dibuja un pedazo de este componente en otro lugar de la página:
           en los "lugares" vacíos que deja LayoutPrincipal (barra y columna del menú).
           defer: espera a que el layout esté armado antes de buscar ese lugar. -->
      <div v-else key="jugando">
        <!-- Botón "Modo" en la barra, solo en celular (is-hidden-tablet) -->
        <Teleport defer to="#av-lugar-boton-modos">
          <button type="button" class="button av-elevable is-hidden-tablet mr-1 av-boton-modos"
            :class="verModos ? 'is-primary' : 'is-light'" @click="verModos = !verModos">
            🎮 Modo
          </button>
        </Teleport>

        <!-- Los modos: en PC, en columna debajo del menú; en celular, una fila arriba
             del juego que solo aparece al tocar "Modo" (is-hidden-mobile).
             box, menu-label, buttons, button, is-*: Bulma. El modo elegido va en is-primary. -->
        <Teleport defer to="#av-lugar-modos">
          <div class="box av-modos-chicos" :class="{ 'is-hidden-mobile': !verModos }">
            <p class="menu-label is-hidden-mobile">Modo de juego</p>
            <div class="buttons">
              <button v-for="m in modos" :key="m.id" type="button" class="button av-elevable av-modo-chico"
                :class="modo === m.id ? 'is-primary' : 'is-light'" @click="modo = m.id; verModos = false">
                {{ m.icono }} {{ m.nombre }}
              </button>
            </div>
          </div>
        </Teleport>

        <div v-if="modo === 'imagen'" class="box av-area-juego">
          <JuegoImagenes @partida-terminada="mostrarResultado" />
        </div>
        <div v-else class="notification is-info is-light av-area-juego has-text-centered">
          🛠️ Este modo todavía está en construcción. ¡Muy pronto!
        </div>
      </div>

    </Transition>
  </div>
</template>

<style scoped>
/* De dónde sale cada estilo:
   - button, buttons, box, notification, tag, is-*: clases de Bulma del template.
   - Foto del cartel: av-fondo-paisaje (estilos/base.css). av-elevable: estilos/base.css.
   - Transición "aparecer": estilos/animaciones.css.
   - Los estilos scoped también alcanzan a lo que se manda a otro lugar con <Teleport>.
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

/* Los modos grandes: una columna angosta y centrada */
.av-modos-grandes {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 560px;
  margin: 0 auto;
}

/* Cada modo es un botón alto, con el ícono a la izquierda y dos renglones de texto.
   Los botones de Bulma centran todo en una línea: acá lo acomodamos distinto. */
.av-modo-grande {
  height: auto;
  justify-content: flex-start;
  gap: 1rem;
  padding: 1.1rem 1.5rem;
  white-space: normal;
  text-align: left;
  background: white;
  border: 2px solid #ddd8c4;
  box-shadow: var(--sombra-suave);
}
.av-modo-grande:hover {
  border-color: var(--color-musgo);
}
.av-modo-icono {
  font-size: 2.25rem;
}
.av-modo-textos {
  display: flex;
  flex-direction: column;
}
.av-modo-textos strong {
  font-family: var(--fuente-titulos);
  font-size: 1.35rem;
  color: var(--color-bosque);
}
.av-modo-textos small {
  color: var(--color-texto-suave);
  font-size: 0.95rem;
}

/* Los modos achicados (van al costado con <Teleport>): en columna, como el menú */
.av-modos-chicos .buttons {
  flex-direction: column;
  align-items: stretch;
}
.av-modo-chico {
  justify-content: flex-start;
}

/* En celular: una fila centrada arriba del juego, con letra más chica para que
   entre en un renglón. El botón "Modo" de la barra, del tamaño de "Cerrar sesión". */
@media (max-width: 768px) {
  .av-modos-chicos {
    padding: 0.5rem;
    margin-bottom: 0.75rem;
  }
  .av-modos-chicos .buttons {
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
  }
  .av-modo-chico {
    font-size: 0.85rem;
    padding-left: 0.7em;
    padding-right: 0.7em;
  }
  .av-boton-modos {
    font-size: 0.85rem;
    padding-left: 0.7em;
    padding-right: 0.7em;
  }
}

/* El área de juego: angosta en celular y tablet; en pantallas grandes más
   ancha, porque el juego se arma en dos columnas (foto | opciones). */
.av-area-juego {
  max-width: 560px;
  margin: 0 auto;
}
@media (min-width: 1024px) {
  .av-area-juego {
    max-width: 1080px;
  }
}
</style>
