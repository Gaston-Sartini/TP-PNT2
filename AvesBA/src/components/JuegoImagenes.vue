<script setup>
import { ref, computed, onMounted } from 'vue';
import { iniciarPartida, terminarPartida, obtenerPreguntas, enviarRespuesta, obtenerSesionActiva } from '../servicios/juegoService.js';
import TarjetaAve from './TarjetaAve.vue';
import BotonOption from './BotonOption.vue';
import EstadoJuego from './EstadoJuego.vue';
import MensajeResultado from './MensajeResultado.vue';
import { calcularPuntos } from '@/juego/puntaje.js';

const TOTAL_PREGUNTAS = 10;
const preguntas = ref([]);
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

// Estado de la pregunta actual
const pregunta = computed(() => preguntas.value[numeroPregunta.value - 1] ?? null);
const elegida = ref(null); // id de la opción que tocó el jugador
const acerto = computed(() => elegida.value === pregunta.value?.id);

const respondida = computed(() => elegida.value !== null);

onMounted(() => {
    cargarPartida();
});

async function cargarPartida() {
    cargando.value = true;
    error.value = '';
    try {
        const sesion = await obtenerSesionActiva();
        if(sesion && sesion.preguntas.length > 0) {
            return await retomarPartida(sesion);
        }
        return await empezarPartida();
    } catch (err) {
        error.value = err.message;
    } finally {
        cargando.value = false;
    }
}

function reiniciarEstado() {    
    elegida.value = null;
    numeroPregunta.value = 1;
    aciertos.value = 0;
    racha.value = 0;
    xp.value = 0;
    terminada.value = false;
    preguntas.value = [];
}

async function retomarPartida(sesion) {
    reiniciarEstado();
    preguntas.value = sesion.preguntas;
    aciertos.value = sesion.respuestas.filter(r => r.es_correcta).length;
    racha.value = sesion.streak_actual;
    xp.value = sesion.puntos_totales;
    
    if (sesion.respuestas.length >= preguntas.value.length) {
        await terminarPartida();
        terminada.value = true;
    } else {
        numeroPregunta.value = sesion.respuestas.length + 1;
    }
}

async function empezarPartida() {
    reiniciarEstado();
    await iniciarPartida();
    preguntas.value = await obtenerPreguntas();
}


async function responder(opcion) {
    elegida.value = opcion.id;
    if(acerto.value){
        aciertos.value++;
        racha.value++;
    } else {
        racha.value = 0;
    }
    xp.value += calcularPuntos(acerto.value, racha.value);
    try {
        await enviarRespuesta(pregunta.value, opcion);
    } catch (err) {
        error.value = err.message;
        return;
    }
}

function estadoDe(opcion) {
    if (!respondida.value) return '';
    if (opcion.id === pregunta.value.id) return 'correcta';
    if (opcion.id === elegida.value) return 'incorrecta';
    return '';
}

async function siguientePregunta() {
    if (numeroPregunta.value < TOTAL_PREGUNTAS) {
        numeroPregunta.value++;
        elegida.value = null;
        return;
    } 

    cargando.value = true;
    
    try {
        await terminarPartida();
        terminada.value = true;
        emit('partidaTerminada', { aciertos: aciertos.value, total: TOTAL_PREGUNTAS, xp: xp.value });        
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
            <button class="boton boton-principal" @click="cargarPartida">Reintentar</button>
        </div>
        <div v-else-if="terminada" class="final">
            <p>Partida terminada!</p>
            <p>Aciertos: {{ aciertos }}</p>
            <p>XP obtenida: {{ xp }}</p>
            <button class="boton boton-principal" @click="cargarPartida">Reiniciar</button>
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

            <MensajeResultado v-if="respondida" :acerto="acerto" :nombreCorrecto="pregunta.nombre" />
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
