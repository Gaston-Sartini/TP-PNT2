<script setup>
import VueApexCharts from 'vue3-apexcharts';
import { obtenerMetricasGlobales, obtenerRanking } from '../servicios/metricasService.js';
import { color, fuente } from '../estilos/graficos.js';
import { onMounted, ref, computed } from 'vue';

const globales = ref(null);
const jugadores = ref([]);
const cargando = ref(true);
const error = ref('');

onMounted (async () => {
  try {
    const [datosGlobales, ranking] = await Promise.all([
      obtenerMetricasGlobales(),
      obtenerRanking(100),
    ]);
    globales.value = datosGlobales;
    jugadores.value = ranking;
  } catch (err) {
    error.value = err.message;
  } finally {
    cargando.value = false;
  }
});

const promedioPuntos = computed(() => {
  if (jugadores.value.length === 0) return 0;
  const suma = jugadores.value.reduce((acumulado, j) => acumulado + j.puntos_totales, 0);
  return Math.round(suma / jugadores.value.length);
});

const top10 = computed(() => jugadores.value.slice(0, 10));

const nombresTop10 = computed(() => top10.value.map(j => `${j.nombre} ${j.apellido.charAt(0)}.`));

const serieTop10 = computed(() => [
  { name: 'Puntos', data: top10.value.map(j => j.puntos_totales)  },
]);

const serieAciertosFallos = computed(() => [
  { name: 'Aciertos', data: top10.value.map(j => j.aciertos)  },
  { name: 'Fallos', data: top10.value.map(j => j.fallos) },
]);

const RANGOS = ['0-20%', '20-40%', '40-60%', '60-80%', '80-100%'];

const serieDistribucion = computed(() => {
  const precisiones = jugadores.value
  .filter(j => j.aciertos + j.fallos > 0)
  .map(j => (j.aciertos / (j.aciertos + j.fallos)) * 100);

  const cantidades = [0, 20, 40, 60, 80].map(desde => 
    precisiones.filter(p => p >= desde && (desde === 80 ? p <= 100 : p < desde + 20)).length
  );

  return [{ name: 'Jugadores', data: cantidades }];
});

// ---------- 3) Cómo se ve cada gráfico ----------
// color() y fuente() leen la paleta de src/estilos/tema.css (ver src/estilos/graficos.js).

// Top 10: el 1.º en dorado, el 2.º en salvia, el 3.º en madera y el resto en musgo
const opcionesTop10 = computed(() => ({
  chart: { fontFamily: fuente(), toolbar: { show: false } },
  plotOptions: { bar: { horizontal: true, borderRadius: 6, distributed: true } },
  colors: top10.value.map((_, posicion) => [color('dorado'), color('salvia'), color('madera')][posicion] ?? color('musgo')),
  xaxis: { categories: nombresTop10.value },
  legend: { show: false },
  tooltip: { y: { formatter: valor => `${valor} puntos` } },
}));

// Aciertos y fallos apilados: una barra por jugador, partida en verde y rojo
const opcionesAciertosFallos = computed(() => ({
  chart: { fontFamily: fuente(), toolbar: { show: false }, stacked: true },
  plotOptions: { bar: { horizontal: true, borderRadius: 4 } },
  colors: [color('hoja'), color('terracota')],
  xaxis: { categories: nombresTop10.value },
  legend: { position: 'top' },
}));

// Distribución: columnas por rango de precisión
const opcionesDistribucion = {
  chart: { fontFamily: fuente(), toolbar: { show: false } },
  plotOptions: { bar: { borderRadius: 6, columnWidth: '55%' } },
  colors: [color('agua')],
  xaxis: { categories: RANGOS, title: { text: 'Precisión' } },
  yaxis: { title: { text: 'Jugadores' }, labels: { formatter: valor => Math.round(valor) } },
  tooltip: { y: { formatter: valor => `${valor} jugadores` } },
};
</script>

<template>
  <div class="av-panel">
    <!-- title, tag, progress, notification, box, columns, column, heading: Bulma -->
    <div class="av-encabezado mb-4">
      <h1 class="title is-3 mb-0">Panel de administración</h1>
      <span class="tag is-warning is-medium">🛡️ Solo admin y moderadores</span>
    </div>

    <progress v-if="cargando" class="progress is-small is-primary" max="100"></progress>

    <p v-else-if="error" class="notification is-danger is-light">{{ error }}</p>

    <p v-else-if="jugadores.length === 0" class="notification is-info is-light">
      🐣 Todavía no hay partidas jugadas para mostrar.
    </p>

    <template v-else>
      <!-- Tarjetas con los números generales (av-kpi: abajo, en el style) -->
      <div class="columns is-multiline">
        <div class="column is-6-tablet is-3-desktop">
          <div class="box av-kpi">
            <p class="heading">Jugadores activos</p>
            <p class="title is-3">👥 {{ globales.total_jugadores_activos }}</p>
          </div>
        </div>
        <div class="column is-6-tablet is-3-desktop">
          <div class="box av-kpi">
            <p class="heading">Respuestas totales</p>
            <p class="title is-3">🐦 {{ globales.total_intentos_sistema }}</p>
          </div>
        </div>
        <div class="column is-6-tablet is-3-desktop">
          <div class="box av-kpi">
            <p class="heading">Acierto global</p>
            <p class="title is-3">🎯 {{ Math.round(globales.porcentaje_acierto_global) }}%</p>
          </div>
        </div>
        <div class="column is-6-tablet is-3-desktop">
          <div class="box av-kpi">
            <p class="heading">Promedio de puntos</p>
            <p class="title is-3">⭐ {{ promedioPuntos }}</p>
          </div>
        </div>
      </div>

      <!-- Fila 2: los mejores, por puntos y por aciertos -->
      <div class="columns">
        <div class="column is-6">
          <div class="box av-grafico">
            <h2 class="title is-5">🏆 Top 10 por puntos</h2>
            <VueApexCharts type="bar" height="340" :series="serieTop10" :options="opcionesTop10" />
          </div>
        </div>
        <div class="column is-6">
          <div class="box av-grafico">
            <h2 class="title is-5">✔ Aciertos y fallos del top 10</h2>
            <VueApexCharts type="bar" height="340" :series="serieAciertosFallos" :options="opcionesAciertosFallos" />
          </div>
        </div>
      </div>

      <!-- Fila 3: cómo le va a todos, y las aves extremas -->
      <div class="columns">
        <div class="column is-8">
          <div class="box av-grafico">
            <h2 class="title is-5">📊 ¿Cuántos jugadores hay en cada nivel de precisión?</h2>
            <VueApexCharts type="bar" height="300" :series="serieDistribucion" :options="opcionesDistribucion" />
          </div>
        </div>
        <div class="column is-4">
          <div v-if="globales.ave_mas_acertada" class="box av-ave av-ave-facil">
            <p class="heading">😎 La más reconocida</p>
            <p class="title is-5 mb-1">{{ globales.ave_mas_acertada.nombre }}</p>
            <p class="av-porcentaje">{{ Math.round(globales.ave_mas_acertada.porcentaje_acierto) }}% de aciertos</p>
            <p class="av-texto-suave">{{ globales.ave_mas_acertada.total_intentos }} intentos</p>
          </div>
          <div v-if="globales.ave_menos_acertada" class="box av-ave av-ave-dificil">
            <p class="heading">🤔 La más difícil</p>
            <p class="title is-5 mb-1">{{ globales.ave_menos_acertada.nombre }}</p>
            <p class="av-porcentaje">{{ Math.round(globales.ave_menos_acertada.porcentaje_acierto) }}% de aciertos</p>
            <p class="av-texto-suave">{{ globales.ave_menos_acertada.total_intentos }} intentos</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* De dónde sale cada estilo:
   - title, tag, box, columns, column, progress, notification, heading: Bulma.
   - av-texto-suave: estilos/base.css. Colores: estilos/tema.css.
   - Los colores de los gráficos: src/estilos/graficos.js (que lee tema.css).
   - Lo de abajo es solo de esta pantalla. */

/* Título a la izquierda y etiqueta a la derecha (abajo en celular) */
.av-encabezado {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

/* Tarjetas de números: centradas, con una línea dorada arriba
   (dorada para distinguirlas de las del jugador, que son verdes) */
.av-kpi {
  height: 100%;
  text-align: center;
  border-top: 5px solid var(--color-dorado);
}
.av-kpi .heading {
  color: var(--color-texto-suave);
}

/* Las cajas de gráficos ocupan toda la altura de su fila */
.av-grafico {
  height: 100%;
}

/* Tarjetas de las aves: borde de color a la izquierda */
.av-ave {
  border-left: 6px solid var(--color-musgo);
}
.av-ave-facil {
  border-left-color: var(--color-hoja);
}
.av-ave-dificil {
  border-left-color: var(--color-terracota);
}
.av-porcentaje {
  font-weight: 700;
  font-size: 1.1rem;
}
</style>
