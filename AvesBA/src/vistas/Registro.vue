<script setup></script>

<template>
  <section class="hero is-fullheight av-fondo-paisaje">
    <!-- Misma estructura visual que el Login: foto de fondo + tarjeta de vidrio.
         Los campos todavía no están conectados al backend. -->
    <div class="hero-body">
      <div class="av-columna">
        <div class="box av-vidrio av-tarjeta">
          <router-link to="/" class="av-volver">← Volver</router-link>
          <h1 class="title is-4 has-text-centered">Crear cuenta</h1>

          <div class="field">
            <label class="label" for="registro-usuario">Nombre de usuario</label>
            <div class="control"><input id="registro-usuario" type="text" class="input" /></div>
          </div>
          <div class="field">
            <label class="label" for="registro-password">Contraseña</label>
            <div class="control"><input id="registro-password" type="password" class="input" /></div>
          </div>
          <div class="field">
            <label class="label" for="registro-nacimiento">Fecha de nacimiento</label>
            <div class="control"><input id="registro-nacimiento" type="date" class="input" /></div>
          </div>
          <div class="field">
            <label class="label" for="registro-email">Email</label>
            <div class="control"><input id="registro-email" type="email" class="input" /></div>
          </div>

          <button type="button" class="button is-primary is-fullwidth is-medium av-elevable">Registrar jugador</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* De dónde sale cada estilo: igual que en Login.vue
   (Bulma en el template, av-fondo-paisaje y av-vidrio en estilos/base.css). */

/* Columna angosta y centrada para la tarjeta */
.av-columna {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
}
.av-tarjeta {
  border-top: 6px solid var(--color-musgo);
}
.av-volver {
  display: inline-block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}
</style>
