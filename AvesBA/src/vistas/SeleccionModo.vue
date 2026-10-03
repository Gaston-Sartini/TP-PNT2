<script setup></script>

<template>
  <div style="display: flex; gap: 1rem;">
    <nav>
      <ul>
        <li><router-link to="/modo">Jugar Individual</router-link></li>
        <li><router-link to="/grupo">Jugar en Grupo</router-link></li>
        <li><router-link to="/datos-jugador">Datos del Jugador</router-link></li>
        <li><router-link to="/ranking">Ranking</router-link></li>
        <li><router-link to="/metricas">Métricas</router-link></li>
      </ul>
    </nav>
    <div>
      <button type="button">Solo Imagen</button>
      <button type="button">Solo Audios</button>
      <button type="button">Ambas</button>
      <div style="border: 1px solid #ccc; width: 300px; height: 200px; margin-top: 1rem;"></div>
    </div>
  </div>
</template>