// Ayudas para los gráficos de ApexCharts.
// ApexCharts necesita los colores escritos en JavaScript, pero nuestra paleta vive
// en src/estilos/tema.css. Estas funciones van a buscar los valores ahí, así hay
// una sola paleta para toda la app: si cambia un color en tema.css, cambia también
// en los gráficos.

const estilosDeLaPagina = () => getComputedStyle(document.documentElement);

// color('musgo') devuelve el valor de --color-musgo
export const color = nombre => estilosDeLaPagina().getPropertyValue(`--color-${nombre}`).trim();

// La tipografía de los textos (--fuente-texto)
export const fuente = () => estilosDeLaPagina().getPropertyValue('--fuente-texto').trim();
