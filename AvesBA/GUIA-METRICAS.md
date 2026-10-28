# 🐦 Misión: "Mis métricas"

Guía paso a paso para armar la pantalla `src/vistas/Metricas.vue`. Son 5 niveles; al final de cada uno hay un **checkpoint** para comprobar que vas bien antes de seguir.

## 🎯 Qué vamos a construir

La pantalla donde cada jugador ve cómo le va:

- **4 tarjetas con números:** ⭐ puntos, 🏆 posición en el ranking, 🎯 precisión y 🐦 respuestas dadas.
- **Una dona** con aciertos (verde) y fallos (rojo).
- **Un medidor circular** con el porcentaje de acierto.
- **Barras "Vos contra el top 5":** los 5 mejores en verde y vos en dorado. Si no estás en el top, aparecés igual al final, para que veas cuánto te falta.
- **Si todavía no jugaste:** un pollito 🐣 y un botón para jugar tu primera partida.

Los gráficos son de **ApexCharts** (ya instalado). Los datos vienen del backend a través de `src/servicios/metricasService.js` (ya hecho).

## 🧰 Antes de empezar

En la carpeta `TP-PNT2`, traé lo último y creá tu rama:

```bash
git switch main
```

```bash
git pull
```

```bash
git switch -c yako-metricas
```

En la carpeta `TP-PNT2\AvesBA`, instalá las librerías nuevas (ApexCharts):

```bash
npm install
```

Para probar necesitás el backend corriendo y estar logueado. Sirve cualquier usuario de ejemplo, por ejemplo `jugador050@example.com` (la contraseña está en `BackendPnt2/app/shared/infrastructure/database/seed_users.py`, en `PASSWORD_SEED`).

Vas a escribir el archivo **de arriba hacia abajo**: primero el `<script setup>`, después el `<template>` y por último el `<style>`. Podés borrar lo que tiene ahora `Metricas.vue` y empezar de cero.

---

## 🥚 Nivel 1: traer los datos

**Qué hacemos:** pedirle al backend tus métricas y el top 5. Es el mismo patrón de la clase 6: estado de carga, error y datos.

```vue
<script setup>
import { ref, computed, onMounted } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { obtenerMisMetricas, obtenerRanking } from '../servicios/metricasService.js';

// ---------- 1) Los datos que vienen del backend ----------
const metricas = ref(null);
const ranking = ref([]);
const cargando = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    metricas.value = await obtenerMisMetricas();
    ranking.value = await obtenerRanking(5);
  } catch (err) {
    error.value = err.message;
  } finally {
    cargando.value = false;
  }
});
```

**Por qué así:**
- **`metricas` arranca en `null`** porque al principio no sabemos nada; se llena cuando responde el backend.
- **`cargando` arranca en `true`** porque lo primero que pasa al abrir la pantalla es esperar.
- **El `async` va en la función de `onMounted`** porque adentro usamos `await`. Sin `await`, `obtenerMisMetricas()` devuelve una *promesa* (un "te lo debo") y no los datos.
- **`obtenerRanking(5)`** pide solo los 5 primeros.
- **El `finally`** se ejecuta siempre, haya salido bien o mal: así nunca queda "cargando" para siempre.

✅ **Checkpoint 1:** todavía no cierres el `<script setup>`; seguí con el nivel 2.

---

## 🐣 Nivel 2: preparar los datos para cada gráfico

**Qué hacemos:** los gráficos no entienden el objeto del backend tal cual; cada uno quiere los números con una forma particular. Eso lo arman los `computed`, que tienen una ventaja: **se recalculan solos** cuando cambian los datos.

Seguí escribiendo, debajo de lo anterior:

```js
// ---------- 2) Los datos preparados para cada gráfico ----------
const fallos = computed(() => {
  if (!metricas.value) return 0;
  return metricas.value.total_intentos - metricas.value.total_aciertos;
});

const sinPartidas = computed(() => metricas.value?.total_intentos === 0);

// Dona: un número por porción
const serieDona = computed(() => [metricas.value?.total_aciertos ?? 0, fallos.value]);

// Medidor: un array con un solo porcentaje
const seriePrecision = computed(() => [metricas.value?.porcentaje_acierto ?? 0]);

// Barras: el top 5, y yo al final si no estoy entre ellos
const jugadoresComparados = computed(() => {
  if (!metricas.value) return [];
  const estoyEnElTop = ranking.value.some(j => j.user_id === metricas.value.user_id);
  if (estoyEnElTop) return ranking.value;
  return [
    ...ranking.value,
    { user_id: metricas.value.user_id, nombre: metricas.value.nombre, puntos_totales: metricas.value.puntuacion_total },
  ];
});

const serieComparacion = computed(() => [
  { name: 'Puntos', data: jugadoresComparados.value.map(j => j.puntos_totales) },
]);
```

**Qué es cada uno:**

| `computed` | Qué devuelve | Para qué |
|---|---|---|
| `fallos` | Respuestas incorrectas | El backend no lo manda: lo calculamos restando |
| `sinPartidas` | `true` si no jugaste nunca | Mostrar el pollito en vez de gráficos vacíos |
| `serieDona` | `[aciertos, fallos]` | La dona quiere un número por porción |
| `seriePrecision` | `[porcentaje]` | El medidor quiere un array, aunque sea de un solo valor |
| `jugadoresComparados` | El top 5, más vos si no estás | La lista de quiénes aparecen en las barras |
| `serieComparacion` | Los puntos de cada uno | Las barras quieren `[{ name, data: [...] }]` |

**Los trucos que aparecen** (casi todos son de la clase 2):
- **`?.`** (encadenamiento opcional): si `metricas.value` todavía es `null`, en vez de romper devuelve `undefined`.
- **`??`**: "si lo de la izquierda no existe, usá lo de la derecha". Así la dona arranca en 0 y no en `undefined`.
- **`some`**: devuelve `true` si **al menos uno** cumple la condición. Lo usamos para preguntar "¿estoy en el top?".
- **`...ranking.value`** (spread): copia el array y le agrega tu objeto al final, sin modificar el original.
- **`map`**: transforma la lista de jugadores en una lista de puntos.

🤔 **Ojo con los nombres:** en tus métricas los puntos se llaman `puntuacion_total`, pero en el ranking se llaman `puntos_totales`. Por eso, al agregarte a la lista, tu objeto usa `puntos_totales`: así todos los jugadores tienen la misma forma y el `map` funciona para todos.

✅ **Checkpoint 2:** cerrá el script con `</script>` y poné un template provisorio:

```vue
<template>
  <div>
    <pre>{{ serieDona }} {{ seriePrecision }} {{ jugadoresComparados }}</pre>
  </div>
</template>
```

Abrí "Métricas" en el menú: tenés que ver tus números y la lista de jugadores. Si ves `[0, 0]`, esperá un segundo: es lo que se muestra mientras carga.

---

## 🎨 Nivel 3: darle estilo a los gráficos

**Qué hacemos:** configurar cómo se ve cada gráfico. En ApexCharts, cada gráfico recibe dos cosas:
- **`series`**: los números (ya los tenés del nivel 2);
- **`options`**: la apariencia (colores, etiquetas, leyenda).

Volvé al `<script setup>` y agregá esto **antes** del `</script>` (sacá el template provisorio cuando llegues al nivel 4):

```js
// ---------- 3) Cómo se ve cada gráfico ----------
// Los colores se leen de src/estilos/tema.css, así hay una sola paleta para toda la app.
const color = nombre => getComputedStyle(document.documentElement).getPropertyValue(`--color-${nombre}`).trim();
const fuente = getComputedStyle(document.documentElement).getPropertyValue('--fuente-texto').trim();

const opcionesDona = {
  chart: { fontFamily: fuente },
  labels: ['Aciertos', 'Fallos'],
  colors: [color('hoja'), color('terracota')],
  legend: { position: 'bottom' },
  plotOptions: {
    pie: { donut: { size: '62%', labels: { show: true, total: { show: true, label: 'Respuestas' } } } },
  },
};

const opcionesPrecision = {
  chart: { fontFamily: fuente },
  labels: ['Precisión'],
  colors: [color('musgo')],
  plotOptions: {
    radialBar: {
      hollow: { size: '62%' },
      track: { background: color('crema') },
      dataLabels: {
        name: { offsetY: 22, color: color('texto-suave') },
        value: { offsetY: -12, fontSize: '30px', fontWeight: 700, formatter: valor => `${Math.round(valor)}%` },
      },
    },
  },
};

// Las barras dependen de quiénes aparecen, por eso estas opciones son un computed
const opcionesComparacion = computed(() => ({
  chart: { fontFamily: fuente, toolbar: { show: false } },
  plotOptions: { bar: { horizontal: true, borderRadius: 6, distributed: true } },
  // Mi barra en dorado, las demás en musgo
  colors: jugadoresComparados.value.map(j => (j.user_id === metricas.value?.user_id ? color('dorado') : color('musgo'))),
  xaxis: { categories: jugadoresComparados.value.map(j => j.nombre) },
  legend: { show: false },
  tooltip: { y: { formatter: valor => `${valor} puntos` } },
}));
```

**La función `color` es la estrella de este nivel:** ApexCharts necesita los colores escritos en JavaScript, pero nuestra paleta vive en `src/estilos/tema.css`. En vez de copiar los códigos (y que el día que cambie un color haya que cambiarlo en dos lados), `color('musgo')` va a buscar el valor de `--color-musgo` a la página. **Una sola paleta para toda la app.**

**Detalles:**
- **`labels` va en plural.** Si escribís `label`, ApexCharts lo ignora y la leyenda dice "series-1". 🙃
- **`formatter`** es una función que recibe el número y devuelve cómo mostrarlo: `24.0` → `"24%"`.
- **`distributed: true`** le permite a cada barra tener su propio color. Sin eso, todas usarían el primero.
- **¿Por qué `opcionesComparacion` es `computed` y las otras no?** Porque sus nombres y colores dependen de quiénes están en el ranking, y eso llega del backend. Las de la dona y el medidor nunca cambian.

---

## 🦅 Nivel 4: armar la pantalla

**Qué hacemos:** el template. Usa clases de **Bulma** (`box`, `columns`, `title`, etc.) y los 3 gráficos.

Reemplazá el template provisorio por este:

```vue
<template>
  <div class="av-metricas">
    <!-- title, progress, notification, box, columns, column, heading, button: Bulma -->
    <h1 class="title is-3">Mis métricas</h1>

    <progress v-if="cargando" class="progress is-small is-primary" max="100"></progress>

    <p v-else-if="error" class="notification is-danger is-light">{{ error }}</p>

    <div v-else-if="sinPartidas" class="box has-text-centered">
      <p class="is-size-1">🐣</p>
      <p class="title is-5">Todavía no jugaste ninguna partida</p>
      <router-link to="/modo" class="button is-primary av-elevable">Jugar mi primera partida</router-link>
    </div>

    <template v-else>
      <!-- Tarjetas con números (av-kpi: abajo, en el style) -->
      <div class="columns is-multiline">
        <div class="column is-6-tablet is-3-desktop">
          <div class="box av-kpi">
            <p class="heading">Puntos</p>
            <p class="title is-3">⭐ {{ metricas.puntuacion_total }}</p>
          </div>
        </div>
        <div class="column is-6-tablet is-3-desktop">
          <div class="box av-kpi">
            <p class="heading">Posición en el ranking</p>
            <p class="title is-3">🏆 #{{ metricas.posicion_ranking }}</p>
          </div>
        </div>
        <div class="column is-6-tablet is-3-desktop">
          <div class="box av-kpi">
            <p class="heading">Precisión</p>
            <p class="title is-3">🎯 {{ Math.round(metricas.porcentaje_acierto) }}%</p>
          </div>
        </div>
        <div class="column is-6-tablet is-3-desktop">
          <div class="box av-kpi">
            <p class="heading">Respuestas</p>
            <p class="title is-3">🐦 {{ metricas.total_intentos }}</p>
          </div>
        </div>
      </div>

      <!-- Dona y medidor, lado a lado (en celular se apilan) -->
      <div class="columns">
        <div class="column is-6">
          <div class="box">
            <h2 class="title is-5">Aciertos y fallos</h2>
            <VueApexCharts type="donut" height="280" :series="serieDona" :options="opcionesDona" />
          </div>
        </div>
        <div class="column is-6">
          <div class="box">
            <h2 class="title is-5">Precisión</h2>
            <VueApexCharts type="radialBar" height="280" :series="seriePrecision" :options="opcionesPrecision" />
          </div>
        </div>
      </div>

      <div class="box">
        <h2 class="title is-5">Vos contra el top 5</h2>
        <VueApexCharts type="bar" height="300" :series="serieComparacion" :options="opcionesComparacion" />
      </div>
    </template>
  </div>
</template>
```

**Cómo leerlo:**
- **La cadena `v-if` / `v-else-if` / `v-else`** muestra **una sola** de las cuatro situaciones: cargando, error, sin partidas o el tablero. Es el mismo patrón que el juego.
- **`<template v-else>`** agrupa varios elementos bajo una condición sin agregar un `<div>` de más.
- **`columns` y `column is-3-desktop`** son la grilla de Bulma: en compu entran 4 tarjetas por fila (3 + 3 + 3 + 3 = 12 columnas); en tablet 2; en celular se apilan solas.
- **`type="donut"`, `"radialBar"` y `"bar"`** eligen el tipo de gráfico. Si querés jugar, cambiá `donut` por `pie` y mirá qué pasa. 😉

⚠️ **Regla de oro:** el template tiene que tener **un solo elemento raíz** (acá, `<div class="av-metricas">`). Ni siquiera un comentario puede quedar afuera de ese div: si no, la navegación se traba al salir de esta pantalla. Está explicado en `ESTILOS.md`.

✅ **Checkpoint 4:** con un usuario que ya jugó, tenés que ver las 4 tarjetas, la dona, el medidor y las barras.

---

## 🏆 Nivel 5: toques finales

**Qué hacemos:** los estilos propios de esta pantalla. Pegá al final del archivo:

```vue
<style scoped>
/* De dónde sale cada estilo:
   - title, box, columns, progress, notification, heading, button: Bulma.
   - av-elevable: estilos/base.css. Colores: estilos/tema.css.
   - Los colores de los gráficos se leen de tema.css desde el script (función color).
   - Lo de abajo es solo de esta pantalla. */

/* Tarjetas de números: centradas, con una línea verde arriba */
.av-kpi {
  height: 100%;
  text-align: center;
  border-top: 5px solid var(--color-musgo);
}
.av-kpi .heading {
  color: var(--color-texto-suave);
}
</style>
```

**Por qué:**
- **`height: 100%`** hace que las 4 tarjetas tengan la misma altura aunque una tenga más texto.
- **`var(--color-musgo)`** es el verde de la paleta (`tema.css`).
- **`scoped`** hace que estas clases solo afecten a esta pantalla.

---

## 🧪 Prueba final

| Probá con... | Tenés que ver |
|---|---|
| Un usuario que ya jugó (por ejemplo `jugador050`) | 4 tarjetas, dona verde y roja, medidor, barras con tu barra en **dorado** |
| Un usuario recién creado | El pollito 🐣 y el botón "Jugar mi primera partida" |
| Achicando la ventana | Las tarjetas y gráficos se acomodan uno debajo del otro |

Cuando funcione, subilo:

```bash
git add -A
```

```bash
git commit -m "feat: pantalla Mis métricas con tarjetas y gráficos"
```

```bash
git push -u origin yako-metricas
```

y abrí el Pull Request. 🎉

---

## 🆘 Si algo falla

| Síntoma | Causa probable |
|---|---|
| La pantalla queda en blanco y en la consola (`F12`) dice "ref is not defined" o "computed is not defined" | Falta importarlo: `import { ref, computed, onMounted } from 'vue';` |
| En la consola se ve `Promise {<pending>}` | Falta un `await` |
| La leyenda dice "series-1" | Escribiste `label` en vez de `labels` |
| Entrás a Métricas y después no podés ir a otra pantalla | Hay más de un elemento raíz en el template (ver nivel 4) |
| Todas las barras son del mismo color | Falta `distributed: true` |
| "Token de autenticación faltante" | No estás logueado, o pasaron los 15 minutos de la sesión: volvé a entrar |
