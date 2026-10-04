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
    } catch (err) {
        error.value = 'Error al cargar las aves: ' + err.message;
    } finally {
        cargando.value = false;
    }    
};

onMounted(() => {
    cargarAves();
});

</script>

<template>
    <div>
        <h1>Aves BA</h1>
        <div v-if="cargando">Cargando aves...</div>
        <div v-else-if="error">
            <p>{{ error }}</p>
            <button @click="cargarAves">Reintentar</button>
        </div>
        <div v-else>
            <p>Se cargaron {{ aves.length }} aves.</p>
        </div>
    </div>



</template>