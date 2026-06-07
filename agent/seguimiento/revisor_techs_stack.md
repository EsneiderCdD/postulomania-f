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
Ubicación: Medellín Tipo de contrato: Indefinido Disponibilidad: Inmediata Descripción del Cargo: En ASIGNAR S.A.S, estamos en la búsqueda de un Desarrollador de Software apasionado por la tecnología, proactivo y con capacidad de trabajar en equipo. El candidato ideal debe contar con sólidos conocimientos en desarrollo web y backend, utilizando tecnologías como JavaScript, PHP, Python y Vue, , para participar activamente en el diseño, desarrollo y mantenimiento de nuestras soluciones digitales. Responsabilidades: Diseñar y desarrollar aplicaciones web escalables y seguras. Participar en todas las fases del ciclo de desarrollo del software. Mantener y optimizar código existente. Colaborar con otros desarrolladores, diseñadores y equipos funcionales. Documentar procesos y soluciones desarrolladas. Investigar nuevas tecnologías que puedan mejorar la eficiencia del equipo. Requisitos: Formación en Ingeniería de Sistemas, Desarrollo de Software o áreas afines. Experiencia mínima de 3 años en desarrollo de software. Conocimientos comprobables en: JavaScript (preferiblemente con frameworks como React, Vue). PHP (Laravel, Symfony o similar). Python (Django, Flask o scripts automatizados). Manejo de bases de datos (MySQL, PostgreSQL, MongoDB). Buenas prácticas de programación y control de versiones (Git). Capacidad de trabajo en equipo y comunicación efectiva. Deseable: Experiencia con APIs RESTful. Conocimiento en metodologías ágiles (Scrum/Kanban). Ofrecemos: Salario $4.000.000 en adelante de acuerdo a experiencia laboral Modalidad de trabajo 100 % Presencial en Medellín Ambiente laboral colaborativo y dinámico. Oportunidades de crecimiento profesional y formación continua. Participación en proyectos innovadores y con impacto.

Requerimientos

Educación mínima: Universidad / Carrera tecnológica
3 años de experiencia