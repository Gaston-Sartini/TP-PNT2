import { pedir } from "./apiService.js";

const BASE = '/api/inaturalist/juego';

export async function iniciarPartida() {
    return await pedir(`${BASE}/iniciar`, { method: 'POST' });
}

export async function terminarPartida() {
    return await pedir(`${BASE}/terminar`, { method: 'POST' });
}

export async function obtenerPregunta() {
    const respuesta = await pedir(`${BASE}/aves`);
    return respuesta.ave;
}

export async function enviarRespuesta(ave, opcion)  {
    return await pedir(`${BASE}/respuesta`, {
        method: 'POST',
        body: JSON.stringify({
            ave_id: ave.id,
            ave_nombre: ave.nombre,
            respuesta_usuario: opcion.nombre
        })
    });
}