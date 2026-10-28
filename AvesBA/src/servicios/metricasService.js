import { http } from "./httpClient.js";

const BASE = '/api/inaturalist';

export async function obtenerMisMetricas() {
    return await http.get(`${BASE}/metricas/usuario`);
}

export async function obtenerRanking(limite = 10) {
    const response = await http.get(`${BASE}/juego/ranking?limit=${limite}`);
    const ranking = response.ranking;
    return ranking;
}

export async function obtenerMetricasGlobales() {
    return await http.get(`${BASE}/metricas/global`);
}