import { http } from './httpClient.js';

async function login(email, password) {
  const respuesta = await http.post('/auth/login', {
    email,
    password
  });

  console.log('✅ Login exitoso');
  return respuesta;
}


async function logout() {
  try {
    await http.post('/auth/logout', {});
  } catch (error) {
    console.warn('Aviso: Error al logout:', error.message);
  } finally {
    console.log('🚪 Logout completado');
  }
}

async function obtenerPerfil() {
  return http.get('/users/me');
}

export { login, logout, obtenerPerfil };