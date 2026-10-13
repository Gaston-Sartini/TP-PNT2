const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Realiza una request HTTP con cookies automáticas
 * @param {string} endpoint - La ruta de la API (ej: '/usuarios/perfil')
 * @param {Object} opciones - Configuración de la request
 * @param {string} opciones.metodo - GET, POST, PUT, DELETE (default: GET)
 * @param {Object} opciones.datos - El body de la request (para POST/PUT)
 * @param {Object} opciones.headers - Headers adicionales personalizados
 * @returns {Promise<Object>} La respuesta parseada como JSON
 * @throws {Error} Si la request falla
 */
async function hacerRequest(endpoint, opciones = {}) {
  const {
    metodo = 'GET',
    datos = null,
    headers = {}
  } = opciones;

  const url = `${API_BASE_URL}${endpoint}`;

  // Headers base (siempre incluidos)
  const headersBase = {
    'Content-Type': 'application/json',
  };

  // Combinar headers base con los personalizados
  const headersFinales = { ...headersBase, ...headers };

  // Configurar opciones de fetch
  const opcionesRequest = {
    method: metodo,
    headers: headersFinales,
    credentials: 'include', // 🔑 IMPORTANTE: Esto hace que se envíen las cookies HttpOnly
  };

  // Agregar body si hay datos
  if (datos) {
    opcionesRequest.body = JSON.stringify(datos);
  }

  try {
    const response = await fetch(url, opcionesRequest);

    // Manejar errores HTTP
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail?.[0]?.msg ||
        errorData.mensaje ||
        `Error ${response.status}: ${response.statusText}`
      );
    }

    // Parsear y retornar respuesta
    const respuesta = await response.json();
    return respuesta;

  } catch (error) {
    console.error(`Error en request a ${url}:`, error);
    throw error;
  }
}

/**
 * Métodos de conveniencia para cada verbo HTTP
 */
const http = {
  get: (endpoint, opciones) =>
    hacerRequest(endpoint, { ...opciones, metodo: 'GET' }),

  post: (endpoint, datos, opciones) =>
    hacerRequest(endpoint, { ...opciones, datos, metodo: 'POST' }),

  put: (endpoint, datos, opciones) =>
    hacerRequest(endpoint, { ...opciones, datos, metodo: 'PUT' }),

  delete: (endpoint, opciones) =>
    hacerRequest(endpoint, { ...opciones, metodo: 'DELETE' }),
};

export { http };
