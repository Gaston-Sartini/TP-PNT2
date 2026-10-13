const API_URL = 'http://localhost:8000';


export async function pedir(ruta, opciones = {}) {
    const token = localStorage.getItem('access_token');
    const headers = {
        'Content-Type': 'application/json',
        ...(opciones.headers || {})
    };
    if(token){
        headers['Authorization'] = `Bearer ${token}`;
    }

    const endpoint = ruta.startsWith('/') ? ruta : `/${ruta}`;
    const url = `${API_URL}${endpoint}`;

    let response;
    try{
        response = await fetch(url, {
            ...opciones,
            headers
        });
    } catch {
        // El fetch solo falla así cuando no hay respuesta: servidor apagado o sin red.
        throw new Error('No se pudo conectar con el servidor');
    }

    if(!response.ok){
        let mensajeError = `Error HTTP ${response.status}: ${response.statusText}`;
        try{
            const errorData = await response.json();
            if(errorData && typeof errorData.detail === 'string') {
                mensajeError = errorData.detail;
            }
        } catch {
            // La respuesta de error no traía JSON: queda el mensaje genérico.
        }
        throw new Error (mensajeError);
    }
    if(response.status === 204) {
        return null;
    }
    return await response.json();
}
