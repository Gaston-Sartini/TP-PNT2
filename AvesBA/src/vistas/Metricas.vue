<script setup>
import VueApexCharts from 'vue3-apexcharts';
import { obtenerMisMetricas, obtenerRanking } from '../servicios/metricasService.js';
import { ref, onMounted } from 'vue';

onMounted (async () => {
  
});

const metricas = ref(null);
const ranking = ref([]);
const cargando = ref(true);
const error = ref('');
</script>

<template>
  <div class="box">
    <!-- box, title, notification: Bulma -->
    <h1 class="title is-3">Métricas</h1>
    <VueApexCharts type="donut" height="280"
      :series="[7, 3]"
      :options="{ labels: ['Aciertos', 'Fallos'] }" />
    <p class="notification is-info is-light">🛠️ Esta sección está en construcción.</p>
  </div>
</template>
