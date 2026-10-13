const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

async function hacerRequest(endpoint, opciones = {}) {
  const {
    metodo = 'GET',
    datos = null,
    headers = {}
  } = opciones;

  const url = `${API_BASE_URL}${endpoint}`;

  // Headers base
  const headersBase = {
    'Content-Type': 'application/json',
  };

  // Combinar headers
  const headersFinales = { ...headersBase, ...headers };

  const opcionesRequest = {
    method: metodo,
    headers: headersFinales,
    credentials: 'include', // >>> importante para incluir las cookies
  };

  if (datos) {
    opcionesRequest.body = JSON.stringify(datos);
  }

  try {
    const response = await fetch(url, opcionesRequest);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail?.[0]?.msg ||
        errorData.mensaje ||
        `Error ${response.status}: ${response.statusText}`
      );
    }

    const respuesta = await response.json();
    return respuesta;

  } catch (error) {
    console.error(`Error en request a ${url}:`, error);
    throw error;
  }
}


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