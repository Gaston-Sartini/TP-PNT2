<script setup>
import { ref, computed, onMounted } from 'vue';
import { iniciarPartida, terminarPartida, obtenerPreguntas, enviarRespuesta, obtenerSesionActiva } from '../servicios/juegoService.js';
import TarjetaAve from './TarjetaAve.vue';
import BotonOption from './BotonOption.vue';
import EstadoJuego from './EstadoJuego.vue';
import MensajeResultado from './MensajeResultado.vue';
import ResultadoFinal from './ResultadoFinal.vue';
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
        <!-- Cargando: pajarito que aletea (av-anim-aleteo, estilos/animaciones.css)
             y barra de Bulma sin valor, que se mueve sola. -->
        <div v-if="cargando" class="has-text-centered py-5">
            <p class="is-size-1"><span class="av-anim-aleteo">🐦</span></p>
            <p class="mb-3 has-text-weight-semibold">Buscando aves...</p>
            <progress class="progress is-small is-primary" max="100"></progress>
        </div>

        <!-- Error: aviso rojo de Bulma (notification is-danger is-light) -->
        <div v-else-if="error" class="notification is-danger is-light">
            <p class="mb-3">{{ error }}</p>
            <button class="button is-danger" @click="cargarPartida">Reintentar</button>
        </div>

        <!-- Fin de la partida: componente propio con medalla y estrellas -->
        <ResultadoFinal v-else-if="terminada" :aciertos="aciertos" :total="TOTAL_PREGUNTAS" :xp="xp" @reiniciar="cargarPartida" />

        <div v-else-if="pregunta">
            <EstadoJuego :numeroPregunta="numeroPregunta" :aciertos="aciertos" :totalPreguntas="TOTAL_PREGUNTAS" :racha="racha" :xp="xp" />

            <!-- <Transition name="pregunta">: al cambiar de pregunta cambia la :key,
                 Vue saca la vieja y mete la nueva, animadas (estilos/animaciones.css). -->
            <Transition name="pregunta" mode="out-in">
                <!-- columns is-desktop (Bulma): en pantallas grandes, foto a la izquierda y
                     opciones a la derecha, para que entre todo sin scrollear.
                     En celular y tablet se apilan, una debajo de la otra. -->
                <div :key="pregunta.id" class="columns is-desktop av-columnas-juego">
                    <div class="column is-7-desktop">
                        <TarjetaAve :foto="pregunta.foto" :atribucion="pregunta.atribucion" />
                    </div>
                    <div class="column is-5-desktop">
                        <p class="has-text-weight-bold mb-2">¿Qué ave es esta?</p>
                        <BotonOption v-for="opcion in pregunta.opciones" :key="opcion.id"
                            :nombre="opcion.nombre"
                            :nombreCientifico="opcion.nombreCientifico"
                            :estado="estadoDe(opcion)"
                            :deshabilitado="elegida !== null"
                            @elegir="responder(opcion)" />

                        <!-- Resultado y botón para seguir: aparecen al responder.
                             av-pie-respuesta: en celular queda fijo abajo de la pantalla (ver style). -->
                        <Transition name="aparecer">
                            <div v-if="respondida" class="av-pie-respuesta">
                                <MensajeResultado :acerto="acerto" :nombreCorrecto="pregunta.nombre" />
                                <button class="button is-primary is-fullwidth is-medium av-elevable" @click="siguientePregunta">
                                    {{ numeroPregunta < TOTAL_PREGUNTAS ? 'Siguiente →' : 'Ver resultado 🏁' }}
                                </button>
                            </div>
                        </Transition>
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>

<style scoped>
/* De dónde sale cada estilo:
   - columns, column, is-*-desktop, button, notification, progress: Bulma.
   - Transiciones "pregunta" y "aparecer", y av-anim-aleteo: estilos/animaciones.css.
   - Lo de abajo es solo de este componente. */

/* Menos separación entre la foto y las opciones que la que pone Bulma por defecto */
.av-columnas-juego {
    margin-bottom: 0;
}

.av-pie-respuesta {
    margin-top: 0.75rem;
}
/* El aviso de acierto/error, más bajo que el de Bulma por defecto.
   .notification es la raíz de MensajeResultado: los estilos scoped del padre
   llegan al elemento raíz de un componente hijo (regla de Vue). */
.av-pie-respuesta .notification {
    padding: 0.6rem 1rem;
    margin-bottom: 0.6rem;
}

/* En celular (hasta 768px, el corte "mobile" de Bulma): el resultado y el botón
   "Siguiente" quedan pegados abajo de la pantalla (position: sticky), así no
   hay que bajar para encontrarlos después de responder. */
@media (max-width: 768px) {
    .av-pie-respuesta {
        position: sticky;
        bottom: 0;
        z-index: 2;
        margin: 0.5rem -0.75rem 0;
        padding: 0.75rem;
        background: white;
        border-top: 1px solid #ddd8c4;
        box-shadow: 0 -6px 14px rgba(38, 48, 26, 0.12);
    }
    /* Más bajos para tapar lo menos posible las opciones */
    .av-pie-respuesta .notification {
        padding: 0.5rem 0.75rem;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
    }
    .av-pie-respuesta .button {
        font-size: 1rem;
    }
}
</style>
