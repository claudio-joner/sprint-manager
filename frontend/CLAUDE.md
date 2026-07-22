# Reglas de acceso al proyecto

## Directorio de trabajo

El directorio de trabajo es exclusivamente `SprintManager/frontend` (esta carpeta). Todos los cambios de código deben realizarse únicamente aquí dentro.

## Backend

El proyecto backend está en `SprintManager/backend` (`../backend` desde acá) y es **solo de lectura**.

Se puede acceder al backend únicamente para:

* Comprender la arquitectura.
* Revisar entidades, DTOs, contratos y endpoints.
* Revisar validaciones y reglas del negocio.
* Ver cómo espera recibir y devolver información la API.

**Nunca:**

* Modificar, crear, eliminar, renombrar o mover archivos del backend.
* Ejecutar comandos que modifiquen el backend.

Si el frontend requiere un cambio en el backend: informarlo, explicar por qué, y esperar autorización explícita antes de tocar nada allí. Nunca modificar el backend por iniciativa propia.

---

# Alcance de trabajo

Responsabilidad exclusiva: desarrollo del **frontend Angular**. No modificar ningún otro proyecto o carpeta del workspace sin autorización explícita.

---

# Fuente de verdad

El backend es la fuente de verdad para modelos, DTOs, endpoints, contratos de API, reglas de validación y reglas del negocio. Nunca inventar información — si falta un dato, buscarlo primero en el backend; si no está ahí, preguntar al usuario.

---

# Memoria funcional del proyecto

No existe (todavía) documentación funcional formal ("Arquitectura de SprintManager") en el repo. Hasta que exista:

* No inventar funcionalidades, reglas de negocio o comportamientos no documentados ni presentes en el código.
* Ante dudas funcionales, preguntar directamente al usuario en vez de asumir.
* Si en algún momento se agrega esa documentación, revisarla antes de implementar y compararla con el código existente; ante contradicciones o vacíos, preguntar antes de continuar.

---

# Forma de trabajar

Antes de cualquier implementación importante, explicar:

* Qué se entendió del requerimiento.
* Cómo se piensa resolver.
* Qué archivos se van a modificar.
* Qué componentes nuevos se crearán (si corresponde).
* Qué servicios se utilizarán.
* Cómo se comunicará con el backend.
* Qué riesgos o dudas existen.

Esperar aprobación explícita antes de realizar cambios importantes.

---

# Git

Nunca ejecutar automáticamente comandos de Git (`add`, `commit`, `push`, `pull`, `merge`, `rebase`, `reset`, `stash`, `switch`, `checkout`, `tag`, etc.).

Si corresponde usar Git: explicar el motivo, indicar exactamente qué comando se ejecutaría, y esperar autorización explícita antes de correrlo.

---

# Objetivo

Construir un frontend Angular profesional, mantenible y escalable, respetando la arquitectura existente, trabajando exclusivamente sobre `SprintManager/frontend`, y usando `SprintManager/backend` únicamente como referencia para comprender e integrar correctamente la API.
