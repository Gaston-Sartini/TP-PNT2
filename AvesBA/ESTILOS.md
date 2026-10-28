# Guía de estilos de Aves BA

Cómo está armado el diseño del front y cómo encontrar de dónde sale cada estilo.

## 1. De dónde sale todo

Todos los estilos salen de **4 archivos globales**, más el `<style scoped>` de cada componente.
Los globales se cargan en `src/main.js` **en este orden** (cada uno puede pisar al anterior):

| # | Archivo | Qué tiene |
|---|---|---|
| 1 | **Bulma** (`bulma-no-dark-mode.css`) | Librería de estilos. Trae componentes listos: `button`, `box`, `tag`, `navbar`, `progress`, `notification`, `columns`, `hero`, `menu`, etc. Es la que usamos en la clase 8. Se importa la versión sin modo oscuro automático, para que la app se vea igual en todas las computadoras. |
| 2 | `src/estilos/tema.css` | La **paleta de colores**, las tipografías, las sombras y los bordes. Los colores están medidos sobre la imagen de portada. Acá también se le pasan esos colores a Bulma. |
| 3 | `src/estilos/base.css` | Estilos generales (títulos) y **clases propias reutilizables**, todas con prefijo `av-` (de Aves). |
| 4 | `src/estilos/animaciones.css` | Las **transiciones de Vue** (`<Transition name="...">`) y los **efectos** con `@keyframes` (clases `av-anim-...`). |

Además, **cada componente** tiene su propio `<style scoped>` para lo que es solo suyo. Todos arrancan con un comentario *"De dónde sale cada estilo"*.

Las tipografías (Nunito para textos y Fredoka para títulos) se cargan desde Google Fonts en `index.html`.

**Gráficos (ApexCharts):** sus colores se escriben en JavaScript, así que no pueden usar `var(--...)` directamente. Para no copiar la paleta, `src/estilos/graficos.js` tiene `color('musgo')` y `fuente()`, que leen los valores de `tema.css`. Los usan `Metricas.vue` y `MetricasAdmin.vue`.

## 2. La regla para leer cualquier clase

Cuando veas una clase en un template, fijate cómo empieza:

| Si la clase... | Viene de | Dónde buscarla |
|---|---|---|
| empieza con `is-`, `has-`, `m*-` o `p*-` (por ejemplo `is-primary`, `has-text-centered`, `mb-3`), o es un nombre como `box`, `button`, `tag`, `title`, `navbar` | **Bulma** | Documentación de Bulma (bulma.io) |
| empieza con `av-anim-` | **Nuestros efectos** | `src/estilos/animaciones.css` |
| empieza con `av-` | **Nuestras clases** | Primero el `<style>` del mismo archivo; si no está ahí, `src/estilos/base.css` |
| es `var(--color-...)` u otra variable `var(--...)` | **Nuestra paleta** | `src/estilos/tema.css` |
| es un `<Transition name="X">` | **Transición de Vue** | Buscá `X-enter` en `src/estilos/animaciones.css` |

## 3. La paleta

Todos los colores salen de la imagen `src/assets/imagenes/hero-background.webp`.

| Variable | Color | De qué parte de la imagen | Para qué se usa |
|---|---|---|---|
| `--color-bosque` | `#3a4626` | Follaje oscuro | Barra superior, títulos |
| `--color-musgo` | `#5b6a38` | Follaje medio | Color principal: botones, barra de avance, menú activo |
| `--color-salvia` | `#869266` | Carteles verdes de ubicación | Detalles y bordes al pasar el mouse |
| `--color-cielo` | `#a5cddc` | Cielo | Fondo detrás de la foto del ave |
| `--color-agua` | `#4f7f86` | Lago | Links y avisos de información |
| `--color-madera` | `#7b5725` | Cartel "Aves de Buenos Aires" | Marco de la foto, XP final |
| `--color-dorado` | `#d9a441` | Luz del atardecer | XP, racha, estrellas, línea de la barra |
| `--color-crema` | `#f4efdc` | Pergamino | Fondo general de la página |
| `--color-hoja` | `#4f8a3c` | Verde vivo | Respuesta correcta |
| `--color-terracota` | `#b5462f` | Puente de hierro | Respuesta incorrecta y errores |

### Cómo Bulma termina usando nuestros colores

Bulma arma cada color con tres variables: **tono** (`-h`), **saturación** (`-s`) y **luminosidad** (`-l`). En la segunda parte de `tema.css` las pisamos con los valores de la imagen:

| Clase de Bulma | Variables que pisamos | Color resultante |
|---|---|---|
| `is-primary` | `--bulma-primary-h/s/l` | Musgo |
| `is-success` | `--bulma-success-h/s/l` | Hoja |
| `is-danger` | `--bulma-danger-h/s/l` | Terracota |
| `is-warning` | `--bulma-warning-h/s/l` | Dorado |
| `is-info` y los links | `--bulma-info-*` y `--bulma-link-*` | Agua |

Por eso cualquier `button is-primary` sale verde musgo sin escribir CSS. Las variables `-invert-l` definen el color del texto encima (blanco sobre los verdes, oscuro sobre el dorado).

## 4. Las clases propias (`base.css`)

| Clase | Qué hace | Dónde se usa |
|---|---|---|
| `av-fondo-paisaje` | Pone la imagen de portada de fondo, con una capa verde oscura encima para que el texto se lea | Login, Registro, cartel de Selección de modo |
| `av-vidrio` | Tarjeta blanca semitransparente con desenfoque (efecto vidrio) | Tarjeta de Login y Registro |
| `av-texto-suave` | Texto chico y gris | Atribución de la foto |
| `av-elevable` | El botón sube un poco y hace sombra al pasar el mouse | Casi todos los botones |

## 5. Las animaciones (`animaciones.css`)

### Transiciones de Vue

Cuando un elemento está dentro de `<Transition name="X">` y aparece o desaparece (por un `v-if` o porque cambia su `:key`), Vue le agrega solo estas clases:

- `X-enter-from` y `X-enter-active` → mientras **aparece**;
- `X-leave-to` y `X-leave-active` → mientras **desaparece**.

El `name` es el prefijo. En `animaciones.css` definimos qué hace cada una:

| Nombre | Efecto | Dónde |
|---|---|---|
| `pagina` | La pantalla nueva aparece subiendo un poco | `App.vue`, al cambiar de ruta |
| `pregunta` | La pregunta nueva entra desde la derecha y la vieja sale por la izquierda | `JuegoImagenes.vue` (cambia la `:key` con el id del ave) |
| `aparecer` | El elemento aparece subiendo y creciendo un poco | Cartel de resultado, aviso de error del Login, área de juego |
| `pop` | El número crece y vuelve | Marcador de aciertos, racha y XP (`EstadoJuego.vue`) |

`mode="out-in"` (en `pagina` y `pregunta`) significa: primero termina de salir lo viejo y recién después entra lo nuevo.

> **Regla importante: un solo elemento raíz.** Todo lo que va dentro de un `<Transition>` (incluidas todas las pantallas, porque `App.vue` las envuelve en `<Transition name="pagina">`) tiene que tener **un único elemento raíz** en su `<template>`. Ni siquiera un comentario HTML puede quedar al lado: en modo desarrollo Vue lo cuenta como un segundo nodo, no puede animar la salida y la navegación queda trabada en esa pantalla. Los comentarios van **adentro** del elemento raíz.
>
> ```html
> <!-- MAL: comentario + div = dos raíces -->
> <template>
>   <!-- explicación -->
>   <div class="box">...</div>
> </template>
>
> <!-- BIEN -->
> <template>
>   <div class="box">
>     <!-- explicación -->
>     ...
>   </div>
> </template>
> ```

### Efectos con `@keyframes`

| Clase | Efecto | Dónde |
|---|---|---|
| `av-anim-aleteo` | El pajarito sube, baja y se balancea sin parar | Pantalla de carga del juego |
| `av-anim-latido` | Late una vez | Opción correcta |
| `av-anim-sacudida` | Se sacude de lado a lado | Opción incorrecta |
| `av-anim-rebote` | Aparece creciendo con rebote | Trofeo de la pantalla final |
| `av-anim-brillo` | Un halo dorado que late | Etiqueta de la racha, desde 3 seguidas |

Al final del archivo hay una regla de **accesibilidad**: si la persona activó "reducir movimiento" en su sistema, todas las animaciones se apagan.

### Ejemplo explicado: el pajarito que aletea

En `JuegoImagenes.vue`, mientras `cargando` es `true`:

```html
<span class="av-anim-aleteo">🐦</span>
```

- **El pájaro** no es una imagen: es un emoji, un carácter de texto. Por eso se ve distinto en Windows, Mac o celular.
- **`v-if="cargando"`** hace que solo exista mientras se espera al backend. Cuando llegan las preguntas, Vue lo saca del DOM y la animación termina sola.
- **La clase `av-anim-aleteo`** está en `animaciones.css`:

```css
@keyframes av-aleteo {
  0%, 100% { transform: translateY(0) rotate(-6deg); }
  50% { transform: translateY(-8px) rotate(6deg); }
}
.av-anim-aleteo {
  display: inline-block;
  animation: av-aleteo 0.8s ease-in-out infinite;
}
```

- **`@keyframes av-aleteo`** describe los "cuadros clave" de la animación:
  - al principio y al final (`0%, 100%`) el pájaro está en su lugar, inclinado 6° a la izquierda;
  - a la mitad (`50%`) está 8 píxeles más arriba (`translateY(-8px)`) e inclinado 6° a la derecha;
  - el navegador calcula solo todos los pasos intermedios.
- **`animation: av-aleteo 0.8s ease-in-out infinite`** aplica esos cuadros: cada vuelta dura 0,8 segundos, arranca y frena suave (`ease-in-out`) y se repite para siempre (`infinite`).
- **`display: inline-block`** es necesario porque `transform` (mover y rotar) no funciona sobre elementos en línea como un `<span>` común.

Subir y bajar mientras se inclina de un lado al otro da la sensación de aleteo.

## 6. Un ejemplo de punta a punta: el botón de la respuesta correcta

1. En `BotonOption.vue`, la función `clasesEstado` le agrega dos clases al botón cuando el estado es `'correcta'`: `is-success` y `av-anim-latido`.
2. `is-success` es una clase de **Bulma**, que pinta el botón con su color "success".
3. Ese color no es el de Bulma: en `tema.css` pisamos `--bulma-success-h/s/l` con el **verde hoja** de la imagen.
4. `av-anim-latido` está en `animaciones.css`: hace que el botón crezca un 4 % y vuelva.
5. En el `<style scoped>` de `BotonOption.vue`, la regla `.av-opcion.is-success[disabled]` evita que Bulma lo vuelva transparente al deshabilitarlo.

## 7. Qué tiene cada pantalla y componente

| Archivo | Clases de Bulma principales | Propio |
|---|---|---|
| `App.vue` | — | Elige si la pantalla va dentro del layout (`meta.conMenu` del router) y anima el cambio de ruta (`pagina`) |
| `components/LayoutPrincipal.vue` | `navbar`, `section`, `columns`, `column`, `box`, `menu` | Barra verde bosque con línea dorada; menú activo en musgo; en celular el menú pasa a una fila |
| `vistas/Login.vue` | `hero is-fullheight`, `box`, `field`, `input`, `button is-primary`, `notification` | Foto de portada (`av-fondo-paisaje`), tarjeta de vidrio, título crema con sombra |
| `vistas/Registro.vue` | Igual que Login | Igual que Login |
| `vistas/SeleccionModo.vue` | `buttons`, `button`, `box`, `notification` | Cartel con la foto, área de juego centrada |
| `components/JuegoImagenes.vue` | `progress`, `notification`, `button` | Transiciones `pregunta` y `aparecer`, pajarito de carga |
| `components/EstadoJuego.vue` | `tags`, `tag`, `progress` | Números con `pop`, racha con `av-anim-brillo` |
| `components/TarjetaAve.vue` | `image` | Marco de madera, fondo celeste detrás de la foto |
| `components/BotonOption.vue` | `button`, `is-success`, `is-danger` | Dos renglones (nombre y nombre científico), latido o sacudida |
| `components/MensajeResultado.vue` | `notification is-success/is-danger is-light` | Ícono a la izquierda |
| `components/ResultadoFinal.vue` | `level`, `box`, `title`, `heading`, `button` | Trofeo con rebote, estrellas doradas |
| `vistas/DatosJugador.vue` | `box`, `media`, `tag`, `progress` | Avatar redondo con la inicial |

## 8. Cambios de estructura que vinieron con el diseño

- **Bulma quedó instalado.** Después de hacer `git pull`, cada uno tiene que correr `npm install`.
- **El menú lateral y "Cerrar sesión" pasaron de `SeleccionModo.vue` a `components/LayoutPrincipal.vue`**, que envuelve a todas las pantallas internas. Es el mismo patrón `<slot>` del `MainLayout` de la clase 8. Qué pantallas lo usan se marca en `router/index.js` con `meta: { conMenu: true }`.
- **El layout pide el perfil del jugador al cargar**, para mostrar el saludo. Eso además hace que el registro de tiempo de conexión mande el id del jugador.
- **Componente nuevo `ResultadoFinal.vue`** para la pantalla de fin de partida.
- **La imagen de portada** está en `src/assets/imagenes/` y se usa desde `base.css`.
- **`src/assets/estilos.css` se eliminó:** su contenido se repartió entre `tema.css` y `base.css`.

## 9. Para agregar estilos nuevos sin perder el hilo

1. **Un color nuevo** → agregalo a `tema.css` como `--color-...` y usalo con `var(...)`.
2. **Algo que ya resuelve Bulma** (botón, aviso, etiqueta, columnas) → usá su clase antes de escribir CSS.
3. **Algo propio que se repite en varias pantallas** → clase `av-...` en `base.css`.
4. **Algo propio de una sola pantalla** → en su `<style scoped>`, con prefijo `av-`.
5. **Una animación** → en `animaciones.css`: una transición de Vue (por nombre) o un efecto `av-anim-...`.
