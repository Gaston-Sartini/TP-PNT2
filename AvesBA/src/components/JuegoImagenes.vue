<script setup>
import { ref, onMounted } from 'vue';
import { obtenerAves } from '../servicios/avesService';
import TarjetaAve from './TarjetaAve.vue';
import BotonOption from './BotonOption.vue';
import EstadoJuego from './EstadoJuego.vue';
import MensajeResultado from './MensajeResultado.vue';
import { computed } from 'vue';

const aves = ref([]);
const cargando = ref(false);
const error = ref('');

async function cargarAves() {
    cargando.value = true;
    error.value = '';
    try {
        aves.value = await obtenerAves();
        nuevaPregunta(); // Generamos una nueva pregunta después de cargar las aves
    } catch (err) {
        error.value = 'Error al cargar las aves: ' + err.message;
    } finally {
        cargando.value = false;
    }    
};

onMounted(() => {
    cargarAves();
});

// Creamos una variable que genera una lista mezclada de aves para el juego
function mezclar(lista){
    return [...lista].sort(() => Math.random() - 0.5);
}

const pregunta = ref(null);

// Creamos una funcion para generar las preguntas.
function nuevaPregunta() {
    const elegidas = mezclar(aves.value).slice(0, 4); // Tomamos 4 aves al azar
    pregunta.value = {
        correcta: elegidas[0], // La primera ave es la correcta
        opciones: mezclar(elegidas) // Mezclamos las opciones
    };
    elegida.value = null; // Reiniciamos la respuesta elegida
}

const elegida = ref(null);
function responder(opcion) {
    elegida.value = opcion.id;
    if (opcion.id === pregunta.value.correcta.id) {
        aciertos.value++;
        racha.value++;
        xp.value += 10 + 5 * (racha.value - 1); // 10 XP base + 2 XP por cada acierto consecutivo
    } else {
        racha.value = 0;
    }
}
function estadoDe(opcion) {
    if(elegida.value === null) return '';
    if(opcion.id === pregunta.value.correcta.id) return 'correcta';
    if(opcion.id === elegida.value) return 'incorrecta';
    return '';
}

const TOTAL_PREGUNTAS = 10;
const numeroPregunta = ref(1);
const aciertos = ref(0);
const terminada = ref(false);
const racha = ref(0);
const xp = ref(0);
const acerto = computed(() => elegida.value === pregunta.value.correcta.id);

function siguientePregunta() {
    if (numeroPregunta.value < TOTAL_PREGUNTAS) {
        numeroPregunta.value++;
        nuevaPregunta();
    } else {
        terminada.value = true;
        partidaTerminada('partidaTerminada', { aciertos: aciertos.value, total: TOTAL_PREGUNTAS, xp: xp.value });
    }
}
const partidaTerminada = defineEmits(['partidaTerminada']);
function reiniciar() {
    numeroPregunta.value = 1;
    aciertos.value = 0;
    terminada.value = false;
    racha.value = 0;
    xp.value = 0;
    nuevaPregunta();
}
</script>

<template>
    <div>
        <h1 class="titulo">Aves BA</h1>
        <div v-if="cargando">Cargando aves...</div>
        <div v-else-if="error">
            <p class="error">{{ error }}</p>
            <button class="boton boton-principal" @click="cargarAves">Reintentar</button>
        </div>
        <div v-else-if="terminada" class="final">
            <p>Partida terminada!</p>
            <p>Aciertos: {{ aciertos }}</p>
            <p>XP obtenida: {{ xp }}</p>            
            <button class="boton boton-principal" @click="reiniciar">Reiniciar</button>
        </div>
        <div v-else-if="pregunta">
            <EstadoJuego :numeroPregunta="numeroPregunta" :aciertos="aciertos" :totalPreguntas="TOTAL_PREGUNTAS" :racha="racha" :xp="xp" />            
            <TarjetaAve :foto="pregunta.correcta.foto" :atribucion="pregunta.correcta.atribucion" />
            <BotonOption v-for="opcion in pregunta.opciones" :key="opcion.id" 
                :nombre="opcion.nombre" 
                :nombreCientifico="opcion.nombreCientifico"
                :estado="estadoDe(opcion)"
                :deshabilitado="elegida !== null"
                @elegir="responder(opcion)" />

            <MensajeResultado v-if="elegida !== null" :acerto="acerto" :nombreCorrecto="pregunta.correcta.nombre" />
            <button v-if="elegida !== null" class="boton boton-principal" @click="siguientePregunta">Siguiente</button>
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
