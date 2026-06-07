# Revisor Tech Stack - Tarea diaria

## Contexto

Eres un revisor de tech stack para ofertas laborales. Tu trabajo es comparar una oferta contra mi perfil técnico y devolver solo las techs que **no conozco** (score = 0) o que **ni siquiera están registradas** en el sistema.

## Archivos de referencia (fuente única de verdad)

- **Techs registradas por el software:** `C:\Users\USUARIO\Desktop\Repositorios\postulomaniaco\postulomaniaco-b\analytics\data\tech_registry.py`
- **Mi perfil técnico:** `C:\Users\USUARIO\Desktop\Repositorios\postulomaniaco\postulomaniaco-b\correlation\profile\user_profile.json`

## Instrucciones

1. Lee ambos archivos de referencia.
2. Analiza la oferta que te paso y extrae **todas** las tecnologías, herramientas, frameworks, lenguajes, bases de datos, plataformas, servicios cloud, herramientas de testing, CI/CD y metodologías mencionadas.
3. **Sé exhaustivo.** No agrupes ni resumas. Cada servicio, herramienta o tecnología es un ítem independiente. Ejemplo: "AWS Lambda", "AWS S3", "AWS IAM" y "AWS DynamoDB" son 4 ítems separados. No los reduzcas a "AWS".
4. Cruza **cada ítem** contra mi perfil: si mi score es **0.0** o la tech **no está registrada** en `tech_registry.py`, esa tech **falta**. Si mi score es > 0 (sin importar cuán bajo), **NO la menciones**.
5. Verificá dos veces: releé la oferta y asegurate de no haber omitido ninguna tecnología.

## Formato de salida (EXACTO, sin variaciones)

```
Stack nivel: tech1, tech2, tech3, techN-1 y techN.
```

La palabra "nivel" es literal. Yo la reemplazo después (ej: "faltante", "por aprender").

## Reglas estrictas

- **Solo la línea de salida.** Nada de explicaciones, análisis, ni párrafos.
- **Sé exhaustivo.** Si dudás si algo cuenta como tech, incluilo. Mejor que sobre a que falte.
- **No agrupes servicios relacionados.** Cada nombre propio de tecnología va por separado.
- Separar con comas, la última con "y". Sin punto final (o con punto, es indistinto).
- Si una tech aparece con variantes (ej: ".NET Core", "C# + .NET"), usá el nombre canónico del registro. Si no está en el registro, usá el nombre tal cual aparece en la oferta.
- **Revisá dos veces** antes de responder: ¿mencioné todo lo que pide la oferta?

---

## Oferta a revisar:

[PEGÁ AQUÍ LA OFERTA]
Desarrollador Mobile Ionic
Vector Colombia 
Vector-2 Computer Science
En Pragma estamos contratando Desarrollador Mobile Ionic para uno de nuestros equipos de alto desempeño, estamos buscando a alguien que crea profundamente en el trabajo colaborativo para la construcción de grandes aplicaciones móviles que aporten soluciones creativas, útiles y especialmente que atiendan las necesidades de los usuarios para facilitarles lo que realmente necesitan.

¿A qué retos te enfrentarás?
Tendrás la responsabilidad de implementar aplicaciones móviles asegurando el cumplimiento de las especificaciones de diseño y solucionando las necesidades del usuario final.
Trabajarás bajo los estándares y metodologías de desarrollo que se han definido en tu equipo de trabajo.
Participarás activamente en la identificación y selección de alternativas que resuelvan, de mejor modo, lo que el usuario final anhela.
Apoyarás al equipo para encontrar soluciones eficientes a esos impedimentos que pueden afectar los resultados del equipo.
Ayudarás a dar soporte y hacer ajustes en las aplicaciones ya entregadas.
Serás parte de un equipo interdisciplinario con el que trabajarás colaborativamente para lograr la entrega de la solución con calidad y de forma oportuna, gestionando si es necesario con las diferentes áreas que intervengan en todo el proceso.
¿Qué buscamos en ti?
 Al menos 3 años de experiencia como desarrollador mobile ionic.
Conocimiento profundo de Angular y TypeScript como base de desarrollo.
Experiencia aplicando prácticas fundamentales de ingeniería de software, incluyendo principios SOLID, patrones de diseño GoF y técnicas de código limpio como DRY, KISS y YAGNI.
Comprender los conceptos asociados a arquitecturas limpias y modulares que favorezcan el bajo acoplamiento.
Dominio de la CLI de Ionic, herramientas de build y gestión de plugins de Capacitor y Cordova.
Tener conocimientos sobre maquetación y diagramación usando CSS, Flexbox, Grid, y componentes de Ionic UI.
Contar con capacidad para el desarrollo o modificación de plugins en Cordova / Capacitor.
Tener conocimiento de integraciones con funcionalidades nativas del sistema operativo Android o iOS y con SDK’s de terceros.
Tener experiencia en desarrollo orientado a pruebas con Jest, Jasmine y Karma.
Tener experiencia en el consumo de APIs REST (JSON) y manejo de peticiones asincrónicas con HttpClient, Axios o RxJS.
Manejo de mecanismos seguros de almacenamiento de información: ionic storage, secure storage, Keychain, Keystore.
Estar siempre dispuesto a aprender, innovar y generar mejores soluciones día a día.
¿Qué nos encantaría encontrar?
No es necesario, pero sería grandioso saber que cuentas con

Conocimiento en gestión de tiendas de aplicaciones y publicaciones abiertas y/o cerradas.
Conocimientos sobre arquitectura modulares con Nx.
Conocimientos sobre servicios de AWS tales como Lambdas, API Gateway, DynamoDB, SNS, Cloudwatch, CloudFront.
Conocimientos sobre IBM MobileFirst Platform y sus adaptadores para aplicaciones móviles.
Conocimiento en cuanto desarrollo seguro basado en OWASP.
Conocimiento sobre prácticas de observabilidad.
Recuerda...

Aprender, innovar y evolucionar formarán parte de tu día a día, acá serás el piloto de tu destino. ¿Te suena?, ¡aplica y prepárate para marcar el ritmo de tu carrera!