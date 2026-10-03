<script setup></script>

<template>
  <div class="pantalla">
    <div class="tarjeta">
      <h1>Login</h1>
      <input type="text" placeholder="Usuario" class="campo" />
      <input type="password" placeholder="Contraseña" class="campo" />
      <button type="button" class="boton boton-principal">Login</button>
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

.nota {
  text-align: center;
  font-size: 0.8rem;
  color: #64748b;
  margin: 0;
}
</style>