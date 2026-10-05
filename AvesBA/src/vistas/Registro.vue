<script setup></script>

<template>
  <div class="pantalla">
    <div class="tarjeta">
      <router-link to="/" class="omitir">Omitir</router-link>
      <h1>Registro</h1>
      
      <input type="text" placeholder="Nombre de Usuario" class="campo" />
      <input type="password" placeholder="Contraseña" class="campo" />
      <label class="etiqueta">Fecha de Nacimiento</label>
      <input type="date" class="campo" />
      <input type="text" placeholder="Email" class="campo" />
      <button type="button" class="boton boton-principal">Registrar Jugador</button>

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
  position: relative;
}

.omitir {
  align-self: flex-end;
  font-size: 0.85rem;
  color: #64748b;
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

.nota-futuro {
  border: 1px dashed #94a3b8;
  border-radius: 8px;
  padding: 0.4rem;
}

.etiqueta {
   font-size: 0.85rem;
    color: #64748b;
     margin-bottom: -0.4rem; }


</style>