<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';

const router = useRouter();
const authStore = useAuthStore();
const email = ref('');
const password = ref('');
const error = ref('');
const cargando = ref(false);

async function ingresar() {
  if (!email.value || !password.value) {
    error.value = 'Completá el email y la contraseña.';
    return;
  }
  cargando.value = true;
  error.value = '';
  try {
    await authStore.login(email.value, password.value);
    router.push('/modo');
  } catch (err) {
    error.value = err.message;
  } finally {
    cargando.value = false;
  }
}
</script>

<template>
  <section class="hero is-fullheight av-fondo-paisaje">
    <!-- Página de inicio: la imagen del paisaje de fondo (clase av-fondo-paisaje,
         en estilos/base.css) y la tarjeta de ingreso encima.
         hero / hero-body / is-fullheight: clases de Bulma para ocupar toda la pantalla. -->
    <div class="hero-body">
      <div class="av-columna">
        <!-- Presentación del juego, sobre la foto -->
        <div class="has-text-centered mb-5 av-presentacion">
          <h1 class="title is-1 av-titulo-portada">Aves BA</h1>
          <p class="subtitle is-5 av-subtitulo-portada">
            Aprendé a reconocer las aves de Buenos Aires
          </p>
        </div>

        <!-- Tarjeta de ingreso. box: Bulma; av-vidrio: estilos/base.css -->
        <div class="box av-vidrio av-tarjeta">
          <h2 class="title is-4 has-text-centered">Ingresar</h2>

          <!-- field / label / control / input: formulario de Bulma -->
          <div class="field">
            <label class="label" for="login-email">Email</label>
            <div class="control">
              <input id="login-email" v-model="email" type="email" class="input" placeholder="tu@email.com" autocomplete="email" @keyup.enter="ingresar" />
            </div>
          </div>
          <div class="field">
            <label class="label" for="login-password">Contraseña</label>
            <div class="control">
              <input id="login-password" v-model="password" type="password" class="input" placeholder="••••••••" autocomplete="current-password" @keyup.enter="ingresar" />
            </div>
          </div>

          <!-- <Transition name="aparecer">: ver estilos/animaciones.css -->
          <Transition name="aparecer">
            <p v-if="error" class="notification is-danger is-light py-2 px-3">{{ error }}</p>
          </Transition>

          <!-- is-loading (Bulma) muestra un spinner dentro del botón mientras espera al backend -->
          <button type="button" class="button is-primary is-fullwidth is-medium av-elevable"
            :class="{ 'is-loading': cargando }" :disabled="cargando" @click="ingresar">
            Ingresar
          </button>
          <router-link to="/registro" class="button is-text is-fullwidth mt-2">
            ¿No tenés cuenta? Registrate
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* De dónde sale cada estilo:
   - Pantalla completa, formulario y botones: clases de Bulma del template.
   - Foto de fondo y efecto vidrio: av-fondo-paisaje y av-vidrio (estilos/base.css).
   - Colores y fuentes: estilos/tema.css.
   - Lo de abajo es solo de esta pantalla. */

/* Columna angosta y centrada para la tarjeta */
.av-columna {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
}

/* Título grande sobre la foto: crema con sombra para que se lea */
.av-titulo-portada {
  color: var(--color-crema);
  text-shadow: 0 3px 12px rgba(0, 0, 0, 0.45);
}
.av-subtitulo-portada {
  color: var(--color-crema);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
}

.av-tarjeta {
  border-top: 6px solid var(--color-musgo);
}
</style>
