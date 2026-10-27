import { http } from "./httpClient.js";

const BASE = '/api/inaturalist/juego';

export async function iniciarPartida() {
    return await http.post(`${BASE}/iniciar`);
}

export async function terminarPartida() {
    return await http.post(`${BASE}/terminar`);
}

export async function obtenerPreguntas() {
    const respuesta = await http.get(`${BASE}/aves`);
    return respuesta.preguntas;
}

export async function enviarRespuesta(ave, opcion)  {
    return await http.post(`${BASE}/respuesta`, {
        ave_id: ave.id,
        respuesta_usuario: opcion.nombre
    });
}

export async function obtenerSesionActiva() {
    try {
        return await http.get(`${BASE}/sesion`);
    } catch (err) {
        if(err.status === 404) return null;
        throw err;
    }
}