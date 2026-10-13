import { http } from './httpClient.js';


/**
 * Login del usuario
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña
 * @returns {Promise<Object>} Respuesta del servidor
 */
async function login(email, password) {
  const respuesta = await http.post('/auth/login', {
    email,
    password
  });

  console.log('✅ Login exitoso');
  return respuesta;
}

/**
 * Logout del usuario
 * Notifica al servidor para limpiar la sesión
 */
async function logout() {
  try {
    await http.post('/auth/logout', {});
  } catch (error) {
    console.warn('Aviso: Error al logout:', error.message);
  } finally {
    console.log('🚪 Logout completado');
  }
}

/**
 * Obtener datos del usuario autenticado
 * ⚡ EJEMPLO: Cómo usar el middleware con un endpoint protegido
 *
 * Las cookies se envían automáticamente en todas las requests
 * No necesitas hacer nada especial - httpClient lo maneja
 * @returns {Promise<Object>} Datos del usuario
 */
async function obtenerPerfil() {
  return http.get('/users/me');
}

export { login, logout, obtenerPerfil };

/**
 * 📝 TEMPLATE PARA LOS OTROS DESARROLLADORES
 *
 * Agrega aquí nuevas funciones según necesites.
 *
 * Ejemplo 1: Obtener perfil
 * export async function obtenerPerfil() {
 *   return http.get('/usuarios/perfil')
 * }
 *
 * Ejemplo 2: Renovar token
 * export async function renovarToken() {
 *   return http.post('/auth/refresh', {})
 * }
 *
 * Ejemplo 3: Registrar usuario
 * export async function registrar(datos) {
 *   return http.post('/auth/registro', datos)
 * }
 *
 * Las cookies se envían automáticamente en todas las requests ✅
 */
