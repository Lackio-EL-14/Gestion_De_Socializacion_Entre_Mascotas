# DogChat i18n Guide

Este archivo explica cómo funciona la traducción de la interfaz en el frontend de DogChat y qué debe hacer cualquier miembro del equipo cuando quiera agregar una nueva pantalla o ampliar la plataforma.

---

## 1. Librería necesaria

La única librería que se usa para traducción en la interfaz es:

```bash
npm install @ngx-translate/core
```

En este proyecto ya está agregada en [frontend/package.json](./package.json), así que si vas a trabajar sobre el repositorio normalmente basta con ejecutar:

```bash
npm install
```

No se usa `ngx-translate/http-loader`, porque el proyecto tiene un cargador personalizado en [src/app/app-module.ts](./src/app/app-module.ts).

---

## 2. Cómo funciona la traducción

La lógica está dividida en tres partes:

- [src/app/core/services/language.service.ts](./src/app/core/services/language.service.ts) guarda el idioma activo y lo persiste en `localStorage`.
- [src/app/app-module.ts](./src/app/app-module.ts) configura `ngx-translate` y carga los JSON de idioma.
- [public/assets/i18n/es.json](./public/assets/i18n/es.json), [public/assets/i18n/en.json](./public/assets/i18n/en.json) y [public/assets/i18n/fr.json](./public/assets/i18n/fr.json) contienen los textos traducidos.

En el HTML no se escribe el texto directo. Se usa la clave de traducción con el pipe `translate`.

Ejemplo:

```html
<h1>{{ 'dashboard.owner.welcome' | translate }}</h1>
```

El pipe busca esa clave en el JSON del idioma activo y muestra el texto correspondiente.

---

## 3. Qué debe hacerse al crear una nueva pantalla

Si vas a crear un nuevo HTML o ampliar una vista existente, sigue estos pasos:

1. Agrega la clave nueva en los tres archivos de idioma: `es.json`, `en.json` y `fr.json`.
2. Usa esa clave en el HTML con `| translate`.
3. Si el texto está en un atributo, tradúcelo también:
   - `placeholder`
   - `title`
   - `alt`
   - `aria-label`
4. Si el componente TypeScript muestra mensajes dinámicos, usa `TranslateService.instant()`.
5. Si el módulo es nuevo o lazy-loaded, importa `TranslateModule` dentro de ese módulo.

Ejemplo de uso en HTML:

```html
<label>{{ 'pets.create.form.nameLabel' | translate }}</label>
<input [placeholder]="'pets.create.form.namePlaceholder' | translate" />
```

Ejemplo de uso en TypeScript:

```ts
constructor(private readonly translate: TranslateService) {}

private t(key: string): string {
  return this.translate.instant(key);
}
```

---

## 4. Qué hay que hacer al ampliar la plataforma

Cuando se agregue un nuevo módulo o pantalla, la forma correcta de integrarlo es:

- Crear el componente o la vista nueva.
- Importar `TranslateModule` en el módulo correspondiente.
- Definir las nuevas claves en los archivos `es.json`, `en.json` y `fr.json`.
- Mantener el mismo nombre de clave en los tres idiomas.
- Evitar poner texto fijo en el HTML.
- Usar `routerLink` en vez de `href="#"` para no recargar la aplicación.

Ejemplo de estructura de claves:

```json
{
  "module": {
    "section": {
      "title": "...",
      "subtitle": "..."
    }
  }
}
```

La idea es que cada módulo tenga su propio espacio de claves para evitar conflictos.

---

## 5. Patrón recomendado para componentes

Cuando un componente necesita traducir mensajes desde TypeScript, se recomienda este patrón:

```ts
import { TranslateService } from '@ngx-translate/core';

constructor(private readonly translate: TranslateService) {}

private t(key: string): string {
  return this.translate.instant(key);
}
```

Se usa especialmente para:

- mensajes de error
- modales
- validaciones
- textos que cambian según acciones del usuario

---

## 6. Checklist rápido para nuevos desarrolladores

Antes de entregar una pantalla nueva, revisa esto:

- [ ] La pantalla usa claves de traducción, no texto fijo.
- [ ] Las claves existen en `es.json`, `en.json` y `fr.json`.
- [ ] El módulo importa `TranslateModule`.
- [ ] El idioma se conserva al navegar.
- [ ] El navbar usa `routerLink` y no enlaces que recarguen la página.
- [ ] Si hay mensajes en TypeScript, se traducen con `TranslateService`.

---

## 7. Nota importante

Si agregas texto nuevo en una vista, no basta con traducir solo un idioma. Debes actualizar siempre los tres archivos:

- español
- inglés
- francés

Así se mantiene la paridad de traducción en toda la app.

---

## 8. Resumen corto

- Librería principal: `@ngx-translate/core`
- Cargador de idiomas: personalizado en `app-module.ts`
- Idioma activo: manejado por `language.service.ts`
- Textos: definidos en `es.json`, `en.json` y `fr.json`
- HTML nuevo: usar `| translate`
- TypeScript nuevo: usar `TranslateService.instant()` cuando haga falta
