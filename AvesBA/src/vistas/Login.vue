<script setup></script>

<template>
  <div>
    <h1>Login</h1>
    <input type="text" placeholder="Usuario" />
    <input type="password" placeholder="Contraseña" />
    <button type="button">Login</button>
    <router-link to="/registro">
      <button type="button">Registrar</button>
    </router-link>
    <p><small>Roles: user, admin</small></p>
  </div>
</template>