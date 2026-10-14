import { http } from "./httpClient.js";

const BASE = '/api/inaturalist/juego';

export async function iniciarPartida() {
    return await http.post(`${BASE}/iniciar`);
}

export async function terminarPartida() {
    return await http.post(`${BASE}/terminar`);
}

export async function obtenerPregunta() {
    const respuesta = await http.get(`${BASE}/aves`);
    return respuesta.ave;
}

export async function enviarRespuesta(ave, opcion)  {
    return await http.post(`${BASE}/respuesta`, {
        ave_id: ave.id,
        ave_nombre: ave.nombre,
        respuesta_usuario: opcion.nombre
    });
}
