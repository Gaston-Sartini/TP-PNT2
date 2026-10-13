<script setup>
import { ref, computed, onMounted } from 'vue';
import { iniciarPartida, terminarPartida, obtenerPregunta, enviarRespuesta } from '../servicios/juegoService.js';
import TarjetaAve from './TarjetaAve.vue';
import BotonOption from './BotonOption.vue';
import EstadoJuego from './EstadoJuego.vue';
import MensajeResultado from './MensajeResultado.vue';

const TOTAL_PREGUNTAS = 10;
const MAX_INTENTOS_SIN_REPETIR = 10;
const MAX_SESIONES_VIEJAS = 5;

const emit = defineEmits(['partidaTerminada']);

// Estado de la pantalla
const cargando = ref(false);
const error = ref('');

// Estado de la partida
const numeroPregunta = ref(1);
const aciertos = ref(0);
const racha = ref(0);
const xp = ref(0);
const terminada = ref(false);
const vistas = ref([]); // ids de las aves que ya salieron en esta partida

// Estado de la pregunta actual
const pregunta = ref(null); // el ave que manda el backend, con sus 4 opciones
const elegida = ref(null); // id de la opción que tocó el jugador
const resultado = ref(null); // lo que responde el backend al validar

const respondida = computed(() => resultado.value !== null);

onMounted(() => {
    empezarPartida();
});

async function empezarPartida() {
    cargando.value = true;
    error.value = '';
    numeroPregunta.value = 1;
    aciertos.value = 0;
    racha.value = 0;
    xp.value = 0;
    terminada.value = false;
    vistas.value = [];
    try {
        await cerrarSesionesViejas();
        await iniciarPartida();
        await cargarPregunta();
    } catch (err) {
        error.value = err.message;
    } finally {
        cargando.value = false;
    }
}

// Si quedó una partida sin terminar, el backend seguiría anotando ahí las respuestas.
async function cerrarSesionesViejas() {
    for (let i = 0; i < MAX_SESIONES_VIEJAS; i++) {
        try {
            await terminarPartida();
        } catch {
            // No quedaba ninguna sesión abierta (o falló: lo informa iniciarPartida).
            return;
        }
    }
}

// El backend elige el ave al azar y puede repetirla: si ya salió, se pide otra.
async function cargarPregunta() {
    let nueva = await obtenerPregunta();
    let intentos = 1;
    while (vistas.value.includes(nueva.id) && intentos < MAX_INTENTOS_SIN_REPETIR) {
        nueva = await obtenerPregunta();
        intentos++;
    }
    vistas.value.push(nueva.id);
    pregunta.value = nueva;
    elegida.value = null;
    resultado.value = null;
}

async function responder(opcion) {
    elegida.value = opcion.id; // bloquea los botones mientras responde el backend
    try {
        resultado.value = await enviarRespuesta(pregunta.value, opcion);
    } catch (err) {
        error.value = err.message;
        return;
    }
    if (resultado.value.es_correcta) {
        aciertos.value++;
        racha.value++;
    } else {
        racha.value = 0;
    }
    xp.value += resultado.value.puntos_obtenidos;
}

function estadoDe(opcion) {
    if (!respondida.value) return '';
    if (opcion.id === pregunta.value.id) return 'correcta';
    if (opcion.id === elegida.value) return 'incorrecta';
    return '';
}

async function siguientePregunta() {
    cargando.value = true;
    try {
        if (numeroPregunta.value < TOTAL_PREGUNTAS) {
            await cargarPregunta();
            numeroPregunta.value++;
        } else {
            await terminarPartida();
            terminada.value = true;
            emit('partidaTerminada', { aciertos: aciertos.value, total: TOTAL_PREGUNTAS, xp: xp.value });
        }
    } catch (err) {
        error.value = err.message;
    } finally {
        cargando.value = false;
    }
}
</script>

<template>
    <div>
        <h1 class="titulo">Aves BA</h1>
        <div v-if="cargando">Cargando...</div>
        <div v-else-if="error">
            <p class="error">{{ error }}</p>
            <button class="boton boton-principal" @click="empezarPartida">Reintentar</button>
        </div>
        <div v-else-if="terminada" class="final">
            <p>Partida terminada!</p>
            <p>Aciertos: {{ aciertos }}</p>
            <p>XP obtenida: {{ xp }}</p>
            <button class="boton boton-principal" @click="empezarPartida">Reiniciar</button>
        </div>
        <div v-else-if="pregunta">
            <EstadoJuego :numeroPregunta="numeroPregunta" :aciertos="aciertos" :totalPreguntas="TOTAL_PREGUNTAS" :racha="racha" :xp="xp" />
            <TarjetaAve :foto="pregunta.foto" :atribucion="pregunta.atribucion" />
            <BotonOption v-for="opcion in pregunta.opciones" :key="opcion.id"
                :nombre="opcion.nombre"
                :nombreCientifico="opcion.nombreCientifico"
                :estado="estadoDe(opcion)"
                :deshabilitado="elegida !== null"
                @elegir="responder(opcion)" />

            <MensajeResultado v-if="respondida" :acerto="resultado.es_correcta" :nombreCorrecto="pregunta.nombre" />
            <button v-if="respondida" class="boton boton-principal" @click="siguientePregunta">Siguiente</button>
        </div>
    </div>
</template>

<style scoped>
.titulo {
    margin: 0 0 0.75rem;
    font-size: 1.25rem;
    text-align: center;
}
.error {
    color: var(--color-error-texto);
}
.final {
    text-align: center;
}
.boton-principal {
    font-size: 1rem;
}
</style>
