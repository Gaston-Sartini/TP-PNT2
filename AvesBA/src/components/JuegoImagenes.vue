<script setup>
import { ref, onMounted } from 'vue';
import { obtenerAves } from '../servicios/avesService';

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
    console.log('Nueva pregunta generada:', pregunta.value);
}
</script>

<template>
    <div>
        <h1>Aves BA</h1>
        <div v-if="cargando">Cargando aves...</div>
        <div v-else-if="error">
            <p>{{ error }}</p>
            <button @click="cargarAves">Reintentar</button>
        </div>
        <div v-else-if="pregunta">            
            <img :src="pregunta.correcta.foto" alt="Imagen del ave" class="imagen-ave" />
            <button v-for="opcion in pregunta.opciones" :key="opcion.id">
                {{ opcion.nombre }}
            </button>
            <button @click="nuevaPregunta">Otra Pregunta</button>
        </div>
    </div>



</template>