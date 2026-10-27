<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';

const router = useRouter();
const authStore = useAuthStore();
const email = ref('');
const password = ref('');
const error = ref('');
const cargando = ref(false);

async function ingresar() {
  if (!email.value || !password.value) {
    error.value = 'Completá el email y la contraseña.';
    return;
  }
  cargando.value = true;
  error.value = '';
  try {
    await authStore.login(email.value, password.value);
    router.push('/modo');
  } catch (err) {
    error.value = err.message;
  } finally {
    cargando.value = false;
  }
}
</script>

<template>
  <div class="pantalla">
    <div class="tarjeta">
      <h1>Login</h1>
      <input v-model="email" type="email" placeholder="Email" class="campo" @keyup.enter="ingresar" />
      <input v-model="password" type="password" placeholder="Contraseña" class="campo" @keyup.enter="ingresar" />
      <p v-if="error" class="error">{{ error }}</p>
      <button type="button" class="boton boton-principal" :disabled="cargando" @click="ingresar">
        {{ cargando ? 'Ingresando...' : 'Login' }}
      </button>
      <router-link to="/registro">
        <button type="button" class="boton">Registrar</button>
      </router-link>
      
    </div>
  </div>
</template>

<style scoped>
.pantalla {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
}

.tarjeta {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 280px;
  padding: 2rem;
  border: 1px solid #38bdf8;
  border-radius: 12px;
}

.tarjeta h1 {
  text-align: center;
  margin: 0 0 0.5rem;
}

.campo {
  padding: 0.5rem;
  border: 1px solid #38bdf8;
  border-radius: 8px;
}

.boton {
  padding: 0.5rem;
  border: 1px solid #38bdf8;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  width: 100%;
}

.boton-principal {
  background: #38bdf8;
  color: white;
  font-weight: bold;
}

.error {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-error-texto);
}

.nota {
  text-align: center;
  font-size: 0.8rem;
  color: #64748b;
  margin: 0;
}
</style>