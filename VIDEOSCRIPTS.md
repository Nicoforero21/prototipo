# Guiones para Videos Promocionales de "Cultiva Colombia"

Aquí encontrarás dos guiones detallados para crear videos sobre la plataforma.

---

## Guion 1: Video para el Público General (Docentes, Estudiantes, Aficionados)

**Título del video:** Cultiva Colombia: Tu Huerto Inteligente al Alcance de un Clic
**Tono:** Amigable, inspirador, educativo y cercano.
**Música:** Instrumental suave y optimista de fondo.

**(0:00-0:15) - Introducción**
*   **(Visual):** Escenas rápidas y dinámicas: un niño sonriendo mientras riega una planta, una maestra mostrando una hortaliza a sus alumnos, un primer plano de una hoja con gotas de agua, y el logo de "Cultiva Colombia".
*   **(Voz en off):** "¿Te imaginas poder conectar a tus estudiantes con la tierra de una forma divertida y tecnológica? ¿O empezar tu propio huerto en casa sin ser un experto? En Colombia, la tierra nos une, y la tecnología ahora nos ayuda a entenderla. Te presentamos **Cultiva Colombia**."

**(0:16-0:45) - ¿Qué es Cultiva Colombia y para quién es?**
*   **(Visual):** Navegación fluida por la página de inicio (`/`). Se muestra el mapa interactivo y las tarjetas de cultivos destacados. El cursor se mueve con calma.
*   **(Voz en off):** "Cultiva Colombia es una plataforma educativa y gratuita, diseñada para **docentes, estudiantes y familias** que buscan fomentar la soberanía alimentaria y el amor por la naturaleza. Nuestro objetivo es darte las herramientas para que conozcas, cultives y cuides las plantas que nos alimentan."

**(0:46-1:30) - El Mapa Interactivo: Descubre qué sembrar**
*   **(Visual):** Se hace zoom en el mapa de la página principal. El cursor hace clic en un marcador (por ejemplo, el del tomate en el Valle del Cauca). Aparece el tooltip y luego se navega a la ficha del tomate (`/cultivos/tomate`).
*   **(Voz en off):** "Todo empieza aquí, en nuestro **mapa interactivo**. ¿No sabes qué se da bien en tu región? ¡No hay problema! Explora el mapa y descubre cultivos ideales para cada zona de Colombia. Con un solo clic, accedes a una ficha técnica completa, donde te explicamos todo lo que necesitas saber: desde su dificultad y ciclo de vida hasta los requisitos de riego y espacio."

**(1:31-2:30) - Detectar con IA: Tu Botánico de Bolsillo**
*   **(Visual):** Se navega a la página "Detectar con IA" (`/detectar`). Se muestra una foto de una planta con una mancha en una hoja. Se arrastra y suelta la imagen en el cargador. Aparecen los resultados del análisis: el nombre de la planta, un diagnóstico ("Necesita atención") y las recomendaciones.
*   **(Voz en off):** "¿Encontraste una planta en el patio del colegio y no sabes qué es? ¿O notas que las hojas de tu tomatera tienen manchas extrañas? Nuestra herramienta de **inteligencia artificial** es tu aliada. Sube una foto y en segundos, la IA identificará la especie, evaluará su estado de salud y te dará recomendaciones de cuidado."
*   **(Voz en off - ejemplo práctico):** "Imagina esto: un estudiante trae una hoja, la analizan juntos en clase y descubren que es una hierbabuena. ¡Ahora tienen un nuevo proyecto para el huerto escolar! Es aprender haciendo."

**(2:31-3:00) - Recursos Pedagógicos: Herramientas para Docentes**
*   **(Visual):** Se navega a la página de "Recursos" (`/recursos`). Se muestra el cursor sobre las diferentes guías descargables, destacando los títulos como "Guía para Mi Primera Huerta Escolar".
*   **(Voz en off):** "Sabemos que los docentes son clave en esta misión. Por eso, en nuestra sección de **Recursos**, encontrarás guías pedagógicas, proyectos de aula y material didáctico listos para descargar y usar. Queremos facilitarte la increíble labor de enseñar sobre el medio ambiente."

**(3:01-3:30) - Mi Panel de Cultivo: Seguimiento Personalizado**
*   **(Visual):** Se muestra el proceso de registro (`/register`) y luego el "Dashboard" (`/dashboard`) de un usuario con varios cultivos. Se destaca la barra de progreso y los recordatorios de riego.
*   **(Voz en off):** "Y si quieres llevar tu huerto al siguiente nivel, ¡créate una cuenta! Podrás añadir tus cultivos a tu **panel personal**, hacer seguimiento de su progreso, recibir alertas y tener toda la información organizada en un solo lugar."

**(3:31-3:45) - Conclusión**
*   **(Visual):** Vuelven las escenas inspiradoras del inicio. El logo de Cultiva Colombia aparece en grande en el centro.
*   **(Voz en off):** "Cultiva Colombia es más que una página web; es una comunidad que siembra conocimiento. Únete a nosotros y empecemos a cultivar el futuro, una semilla a la vez. Visítanos en [URL del sitio]."

---

## Guion 2: Video Técnico (Para Desarrolladores, Portafolio)

**Título del video:** Deep Dive: Arquitectura de una App Educativa con Next.js, Firebase y Genkit
**Tono:** Profesional, técnico, claro y conciso.
**Música:** Electrónica suave o lo-fi, que no distraiga.

**(0:00-0:20) - Introducción y Stack Tecnológico**
*   **(Visual):** Pantalla negra con el título. Transición a un diagrama simple de la arquitectura: [Frontend: Next.js/React] -> [Backend: Firebase Auth/Firestore] -> [IA: Genkit/Gemini].
*   **(Voz en off):** "Hola, en este video haremos un recorrido técnico por 'Cultiva Colombia', una aplicación web full-stack construida para demostrar la integración de un frontend moderno, servicios de backend y capacidades de inteligencia artificial. El stack principal es **Next.js** con el App Router, **Firebase** para autenticación y base de datos, y **Genkit** para orquestar las llamadas a los modelos de IA de Google."

**(0:21-1:15) - Configuración y Entorno (El archivo `.env`)**
*   **(Visual):** Mostrar el IDE. Abrir el archivo `README.md` y resaltar las variables de entorno. Luego, abrir el archivo `.env` (con valores de ejemplo, no reales).
*   **(Voz en off):** "La configuración es clave. Todo se gestiona a través de variables de entorno en el archivo `.env`. Este archivo desacopla las credenciales del código."
*   **(Visual):** Señalar las variables `NEXT_PUBLIC_`.
*   **(Voz en off):** "Las variables con el prefijo `NEXT_PUBLIC_` son para el SDK de cliente de Firebase. Son seguras para exponer en el navegador y las usamos para la autenticación en el lado del cliente."
*   **(Visual):** Señalar `FIREBASE_CREDENTIALS` y `GEMINI_API_KEY`.
*   **(Voz en off):** "Por otro lado, `FIREBASE_CREDENTIALS` contiene las claves de una cuenta de servicio para el SDK de Administrador de Firebase. Esta variable es **secreta** y solo se usa en el servidor para operaciones privilegiadas, como crear usuarios o modificar la base de datos desde Server Actions. `GEMINI_API_KEY` se usa para autenticar las llamadas de Genkit a la API de Gemini."

**(1:16-2:30) - Flujo de Autenticación (Server-Side)**
*   **(Visual):** Abrir `src/lib/auth-actions.ts`. Mostrar la función `registerUserAction`. Luego, abrir `src/lib/firebase-admin.ts`.
*   **(Voz en off):** "Veamos el flujo de registro. El formulario en la página de registro (`/register`) invoca una **Server Action** llamada `registerUserAction`. Esta acción, que se ejecuta exclusivamente en el servidor, primero valida los datos con Zod. Luego, utiliza el SDK de Administrador de Firebase, inicializado en `firebase-admin.ts`, para crear el usuario en Firebase Authentication (`createAdminAuthUser`) y, acto seguido, crea un documento correspondiente en Firestore en la colección 'users'. Este enfoque es seguro porque la contraseña nunca viaja al navegador del cliente."

**(2:31-3:45) - Integración de IA con Genkit**
*   **(Visual):** Abrir el archivo `src/ai/flows/detect-plant-species.ts`. Resaltar las partes clave.
*   **(Voz en off):** "La funcionalidad de detección de plantas se implementa con Genkit. Definimos un flujo de Genkit en `detect-plant-species.ts`. Primero, definimos los esquemas de entrada y salida usando Zod. Esto es crucial para la robustez y para que el modelo de lenguaje sepa qué formato de JSON debe devolver (`DetectPlantSpeciesInputSchema`, `DetectPlantSpeciesOutputSchema`)."
*   **(Visual):** Mostrar la definición del prompt (`ai.definePrompt`). Señalar la plantilla de Handlebars `{{media url=photoDataUri}}`.
*   **(Voz en off):** "El corazón del flujo es el prompt. Usamos `ai.definePrompt` para instruir a un modelo multimodal de Gemini. Le pasamos un rol ('Eres un botánico experto'), el prompt de texto y la imagen del usuario, que se pasa como una URI de datos en formato Base64. El `output: {schema: ...}` le indica al modelo que estructure su respuesta como un JSON válido, lo que elimina la necesidad de parsear texto de forma manual en el frontend."
*   **(Visual):** Abrir `src/components/plant-detector.tsx` y mostrar cómo se invoca la acción `detectPlantAction` y cómo se maneja el estado con `useActionState`.
*   **(Voz en off):** "En el frontend, el componente `PlantDetector` utiliza el hook `useActionState` de React para manejar el estado del formulario (loading, error, success) de forma nativa, llamando a la Server Action que a su vez invoca nuestro flujo de Genkit."

**(3:46-4:20) - Componentes de Cliente vs. Servidor y Renderizado de Mapa**
*   **(Visual):** Abrir `src/app/page.tsx` (Server Component) y luego `src/components/map-loader.tsx` (Client Component).
*   **(Voz en off):** "La aplicación utiliza el App Router de Next.js, aprovechando los **Server Components** por defecto para mejorar el rendimiento. Por ejemplo, la página de inicio es un Server Component que obtiene los datos de los cultivos directamente desde `src/lib/data.ts`."
*   **(Visual):** Mostrar el `dynamic` import en `map-loader.tsx`.
*   **(Voz en off):** "Sin embargo, componentes interactivos como el mapa de Leaflet requieren estado en el cliente. Para evitar errores de SSR y de doble inicialización en modo estricto, envolvemos el mapa en un componente (`MapLoader`) que se carga dinámicamente con `next/dynamic` y `ssr: false`. Esto asegura que Leaflet solo se renderice en el navegador."

**(4:21-4:40) - Conclusión**
*   **(Visual):** Volver al diagrama de arquitectura del principio.
*   **(Voz en off):** "En resumen, 'Cultiva Colombia' es un ejemplo práctico de cómo combinar la renderización del lado del servidor de Next.js para el rendimiento, Firebase para un backend robusto y seguro, y Genkit para integrar de forma estructurada y fiable las potentes capacidades de la IA generativa. Gracias por acompañarme en este recorrido técnico."
