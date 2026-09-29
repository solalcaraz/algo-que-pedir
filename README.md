# Algo Que Pedir

[![CI](https://img.shields.io/github/actions/workflow/status/solalcaraz/algo-que-pedir/ci.yml?style=flat-square&label=CI)](https://github.com/solalcaraz/algo-que-pedir/actions/workflows/ci.yml)
[![Cobertura backend](https://img.shields.io/codecov/c/github/solalcaraz/algo-que-pedir?flag=backend&style=flat-square&label=cobertura%20backend&logo=codecov)](https://codecov.io/gh/solalcaraz/algo-que-pedir)
[![Cobertura vista local](https://img.shields.io/codecov/c/github/solalcaraz/algo-que-pedir?flag=frontend-local&style=flat-square&label=cobertura%20vista%20local&logo=codecov)](https://codecov.io/gh/solalcaraz/algo-que-pedir)
[![Cobertura vista usuario](https://img.shields.io/codecov/c/github/solalcaraz/algo-que-pedir?flag=frontend-usuario&style=flat-square&label=cobertura%20vista%20usuario&logo=codecov)](https://codecov.io/gh/solalcaraz/algo-que-pedir)
![Lenguajes](https://img.shields.io/github/languages/count/solalcaraz/algo-que-pedir?style=flat-square&label=lenguajes)
![Tamaño](https://img.shields.io/github/repo-size/solalcaraz/algo-que-pedir?style=flat-square&label=tama%C3%B1o)
![Último commit](https://img.shields.io/github/last-commit/solalcaraz/algo-que-pedir?style=flat-square&label=%C3%BAltimo%20commit)

![Kotlin](https://img.shields.io/badge/Kotlin-7F52FF?style=flat-square&logo=kotlin&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=flat-square&logo=springboot&logoColor=white)
![Svelte](https://img.shields.io/badge/Svelte-FF3E00?style=flat-square&logo=svelte&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Chakra UI](https://img.shields.io/badge/Chakra%20UI-319795?style=flat-square&logo=chakraui&logoColor=white)

App de pedidos de comida a domicilio con dos vistas. El local gestiona sus pedidos, su menú y sus ingredientes; el usuario busca locales, arma su pedido y después lo califica. Es el trabajo práctico integrador de Algoritmos II y III de la Tecnicatura en Programación Informática de la UNSAM, que hicimos en equipo durante 2025. En el primer cuatrimestre modelamos el dominio; en el segundo le sumamos una API REST con dos frontends.

## Problema que resuelve

La consigna describe una plataforma que conecta usuarios, locales y repartidores. Lo difícil no es el CRUD sino las reglas de negocio, que cambian entrega a entrega:

- El precio de un plato suma el costo de sus ingredientes, la comisión de la plataforma y, si es de autor, las regalías. Sobre eso se aplica un descuento por plato nuevo (baja un punto por día) o por promoción, nunca los dos juntos.
- Cada usuario acepta platos según un criterio (vegano, exquisito, conservador, fiel, marketing, impaciente), combinable con otros.
- Los repartidores tienen condiciones propias para aceptar un pedido, que también se combinan con AND u OR.
- Suman cupones con descuentos especiales, acciones que el usuario agenda para más tarde y procesos de administración que avisan por mail.

El desafío técnico fue modelar todo eso para que sumar un tipo nuevo no obligue a tocar lo que ya funciona. En la segunda materia, el desafío pasó a ser exponer ese dominio en una API REST para consumirla desde dos frontends hechos con tecnologías distintas, sin duplicar la lógica de precios en el cliente.

## Demo

La app no tiene base de datos ni está pensada para producción: los datos se cargan en memoria al levantar el backend. Por eso la muestro en GIFs grabados en local, uno por funcionalidad.

**Vista del local (Svelte)**

| Funcionalidad | Demo |
|---|---|
| Pedidos por estado y cambio de estado | ![Pedidos del local](docs/demo/local-pedidos.gif) |
| Detalle de un pedido | ![Detalle del pedido](docs/demo/local-detalle-pedido.gif) |
| Menú y edición de un plato con sus ingredientes | ![Menú y edición de plato](docs/demo/local-menu-plato.gif) |
| Alta, edición y baja de ingredientes | ![Ingredientes](docs/demo/local-ingredientes.gif) |
| Perfil del local | ![Perfil del local](docs/demo/local-perfil.gif) |

**Vista del usuario (React)**

| Funcionalidad | Demo |
|---|---|
| Registro e inicio de sesión | ![Registro y login](docs/demo/usuario-registro-login.gif) |
| Búsqueda de locales y filtro de cercanos | ![Home](docs/demo/usuario-home.gif) |
| Armado del pedido y checkout | ![Pedido y checkout](docs/demo/usuario-pedido-checkout.gif) |
| Mis pedidos y cancelación | ![Mis pedidos](docs/demo/usuario-mis-pedidos.gif) |
| Calificación de un local | ![Calificar](docs/demo/usuario-calificar.gif) |
| Perfil, criterios de búsqueda e ingredientes | ![Perfil](docs/demo/usuario-perfil.gif) |

## Tecnologías

| Parte | Stack |
|---|---|
| Backend (`backend/`) | Kotlin 1.9, Spring Boot 3.3, Java 21, Gradle, Kotest, MockK, JaCoCo |
| Vista del local (`frontend-local/`) | SvelteKit 2 con Svelte 5, TypeScript, Vite, Axios, Vitest y Testing Library. La maqueta previa está en HTML y CSS |
| Vista del usuario (`frontend-usuario/`) | React 19, TypeScript, Chakra UI 3, React Router 7, React Hook Form, Axios, Vite, Vitest y Testing Library |
| Integración continua | GitHub Actions: tests, lint y build de las tres partes |

## Cómo funciona

El backend tiene dos capas. El dominio (`backend/src/main/kotlin/*.kt`) es Kotlin puro: resuelve las reglas de la consigna sin saber nada de HTTP. Encima está la API de Spring (`controller` → `service` → repositorios en memoria), que traduce entre el dominio y lo que necesita cada vista mediante DTOs. Al arrancar, `AppBootstrap` carga locales, platos, usuarios y pedidos de ejemplo.

Cada frontend consume esa API por su lado. La vista del local (Svelte) administra el negocio: pedidos, menú, ingredientes, datos del local. La vista del usuario (React) es mobile y cubre el recorrido del cliente, desde buscar un local hasta calificarlo.

En el dominio usamos patrones de diseño donde la consigna anunciaba cambios. Los criterios de usuario, las condiciones de delivery y la puntuación de locales son Strategy; sus combinaciones, Composite. Los cupones usan Template Method: las condiciones comunes viven en la clase base, mientras cada cupón define la suya. Lo que pasa al confirmar un pedido (publicidad, auditoría, aviso al local) se resuelve con Observers. Las acciones que el usuario agenda son Command. Cada vez que la consigna dice "pueden aparecer nuevos", detrás hay una interfaz: cada caso nuevo es una clase más, no otro `if`.

En la API, el precio lo calcula siempre el backend. El checkout de React muestra el desglose, pero al confirmar el backend vuelve a calcular el total; si no coincide con el que mandó el front, rechaza el pedido.

Las decisiones que tomé y por qué:

- **Los criterios de búsqueda viajan como un DTO con tipo y subcriterios.** El front no puede mandar objetos con comportamiento, así que envía un `CriterioDTO` con el tipo (`VEGANO`, `FIEL`, `COMBINADO`...) más sus datos. El backend lo convierte en la Strategy del dominio, con subcriterios anidados que reflejan el Composite del modelo.
- **Solo el local dueño puede editar un plato.** No hay autenticación con tokens, así que el front manda el id del local logueado. Si el plato es de otro local, el service rechaza la edición.
- **Las imágenes de los platos las sirve el backend.** El formulario de plato elige entre las imágenes que ya están en el servidor en lugar de subir archivos. Así no hubo que resolver el almacenamiento, ni hay riesgo de que las rutas del front y del back se desincronicen.
- **Validaciones del perfil de usuario con Strategy y Composite.** Cada regla (texto requerido, valor positivo, rango) es una estrategia; un campo puede combinar varias. Gracias a eso, el mismo componente de input sirve para todo el formulario.
- **Un solo repositorio para las tres partes.** Originalmente eran tres repos privados de la cátedra. Los junté conservando el historial completo de cada uno, para que el sistema se pueda ver y correr desde un solo lugar.

## Cómo correrlo

Necesitás JDK 21, Node 22 y Yarn 1.

```bash
git clone https://github.com/solalcaraz/algo-que-pedir.git
cd algo-que-pedir
```

**Backend** (queda escuchando en `http://localhost:9000`):

```bash
cd backend
./gradlew bootRun
```

**Vista del local** (en otra terminal):

```bash
cd frontend-local
yarn install
yarn dev
```

**Vista del usuario** (en otra terminal):

```bash
cd frontend-usuario
npm install
npm run dev
```

Vite levanta la primera app en `http://localhost:5173`; la segunda, en el siguiente puerto libre.

Usuarios de prueba que carga el backend:

| Vista | Usuario | Contraseña |
|---|---|---|
| Local | `local1` (Taberna de Moe) | `local1` |
| Usuario | `smiller2005` | `123` |

Para correr los tests:

- Backend: `./gradlew test`
- Vista del local: `yarn test:unit --run`
- Vista del usuario: `npx vitest run`

## Qué aprendí y qué mejoraría

**Qué aprendí**

Fue mi primer proyecto largo, el más parecido a un sistema real. Antes de este TP nunca había conectado un front con una API, ni trabajado en algo de este tamaño. Lo técnico, de lo más básico a lo más complejo:

- Modelar un dominio con objetos desde cero, con sus tests, aplicando patrones de diseño donde el enunciado anunciaba casos nuevos.
- Llevar ese modelo a una API REST con Spring Boot: controllers, services, DTOs, manejo de errores.
- Maquetar en HTML y CSS, para después convertir esas pantallas en componentes (primero en Svelte, luego en React) conectados a la API.
- Armar un sistema de validaciones generales con Strategy en React. Los profes lo destacaron en la corrección; a mí me sirvió para entender los patrones fuera del dominio.

También aprendí a trabajar en equipo con Git: ramas con un propósito (no con el nombre de cada uno), pull requests documentados con el trabajo hecho. Para organizarnos usamos Trello, con las tareas divididas por funcionalidad. Además de mi parte, fui la referente del grupo ante los tutores, así que me tocó coordinar un equipo grande.

Algoritmos II me costó mucho, sobre todo el backend, la lógica. Para Algoritmos III cambié la forma de encararlo: investigué más, me involucré más. También aprendí a leer documentación y a usarla para practicar. Svelte, por ejemplo, tiene ejercicios interactivos en su documentación que me ayudaron a entender rápido lo que necesitaba.

**Qué mejoraría**

- Persistencia real: hoy todo vive en memoria, así que se pierde al reiniciar el backend.
- Autenticación: las contraseñas se guardan con un hash que no es criptográfico (`cyrb53`); la sesión es un id guardado en el navegador, sin token. Usaría Spring Security con bcrypt y JWT.
- Configuración: la URL del backend y los orígenes de CORS están escritos en el código; los pasaría a variables de entorno.
- El detalle del pedido en la vista del usuario no muestra la distancia al local, porque ese endpoint no la devuelve.
- La vista del usuario tiene mucha menos cobertura de tests que las otras dos partes (se ve en los badges de arriba).

## Autoría y mejoras

Este repositorio es el original del trabajo práctico integrador que hicimos en equipo entre marzo y noviembre de 2025. El tag [`tp-original-2025`](https://github.com/solalcaraz/algo-que-pedir/tree/tp-original-2025) marca el TP tal como lo entregamos.

**Equipo:** María Sol Alcaraz, Facundo Casado (Algoritmos II), Joaquín Navarro, Damián Palomba, David Pazos (Algoritmos III) y Carla Rocca.

**Mi parte en la versión original**:

- En Algoritmos II, los tipos de usuario y los cupones del dominio.
- En la maqueta HTML y CSS, la vista de edición de plato, más los estilos de botones, switch e inputs.
- En la vista del local (Svelte), los componentes de botón e input, el modelo de plato con sus validaciones, las vistas de menú y edición de plato conectadas al backend, el modal de ingredientes del plato, más los tests de esas vistas. Además integré el componente tabla en la edición de plato, sumándole una fila extra para agregar ingredientes.
- En la API, el CRUD de platos, con la validación de que solo lo edita su local y las imágenes servidas desde el backend. También los endpoints de usuario, incluida la conversión de criterios entre el front y el dominio.
- En la vista del usuario (React), el perfil: datos personales, criterios de búsqueda, ingredientes preferidos y a evitar.
- También en React, un sistema de validaciones generales con Strategy y Composite, junto con el input que las usa. Los tests del botón, de las validaciones y de los modelos también son míos.

**Lo que hice después**:

- Junté los tres repositorios en uno, conservando el historial de cada uno. Sumé un CI que prueba y compila las tres partes.
- Arreglé los tests del backend, que no compilaban, junto con el build de las dos vistas, que fallaba.
- Corregí los 18 errores de tipos que `svelte-check` marcaba en los tests de la vista del local; ahora ese chequeo también corre en el CI.
- Corregí estos bugs, cada uno en su propio commit:
  - El perfil del local no guardaba Efectivo ni Tarjeta como medios de pago. Además se rompía en los locales que no aceptan todos.
  - Recargar el perfil del local mandaba al login.
  - El error de dirección vacía aparecía debajo del nombre del local.
  - Después del login, la lista de pedidos del usuario consultaba al usuario 0 hasta recargar la página.
  - La distancia máxima del criterio Impaciente no se guardaba.
  - El botón para cerrar la calificación de un local mandaba al login.
  - El link Calificar del footer también mandaba al login.
  - Eliminar un ingrediente prohibido lo sacaba de preferidos.
  - El criterio Fiel no aceptaba ningún plato.
  - En pagos con QR o tarjeta, el desglose del pedido que ve el local no sumaba el total.
  - El local El Imperio compartía usuario con otro, así que no se podía entrar con él.
  - El CORS de dos controllers impedía usar las dos vistas a la vez.
  - La validación del descuento de un plato mostraba el mismo error dos veces.
- Hice que el registro de un local avise que salió bien antes de redirigir al login. Antes no mostraba nada.
- Conecté la cantidad de pedidos del local, que la vista del usuario mostraba siempre en 0 porque el backend no la enviaba.
- Recuperé la maqueta HTML completa, con sus rutas a estilos e imágenes arregladas.
- Saqué código muerto o comentado. Solo quedaron los comentarios que explican un porqué.
- Unifiqué la validación de los modelos de la vista del local en una clase base.
- Grabé la demo en GIFs; también escribí este README.

Para verificar que el comportamiento no cambió, corrí los tests de las tres partes antes y después. Los 219 del backend siguen pasando, con 5 nuevos. En la vista del local pasé de 140 a 266: volvieron a correr seis archivos que no cargaban, más los tests que agregué. En la del usuario, de 50 a 55. También comparé las respuestas de 33 endpoints de la API contra el original; solo cambiaron las dos que corrige el arreglo del desglose.
