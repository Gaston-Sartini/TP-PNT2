
export function calcularPuntos(acerto, racha)   {
    if(!acerto) {
        return 0;
    };
    return 10 + 5 * (racha - 1);
}