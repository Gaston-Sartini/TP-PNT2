<script setup>
import { ref, computed, onMounted } from 'vue';
import { iniciarPartida, terminarPartida, obtenerPreguntas, enviarRespuesta } from '../servicios/juegoService.js';
import TarjetaAve from './TarjetaAve.vue';
import BotonOption from './BotonOption.vue';
import EstadoJuego from './EstadoJuego.vue';
import MensajeResultado from './MensajeResultado.vue';
import { calcularPuntos } from '@/juego/puntaje.js';

const TOTAL_PREGUNTAS = 10;
const MAX_SESIONES_VIEJAS = 5;
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
    empezarPartida();
});

async function empezarPartida() {
    cargando.value = true;
    elegida.value = null;
    error.value = '';
    numeroPregunta.value = 1;
    aciertos.value = 0;
    racha.value = 0;
    xp.value = 0;
    terminada.value = false;
    preguntas.value = [];
    try {
        await cerrarSesionesViejas();
        await iniciarPartida();
        preguntas.value = await obtenerPreguntas();
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
