# Maguey Studio — sitio Astro

Sitio de la agencia Maguey Studio, migrado de HTML estático a **Astro**. Dominio de producción: **https://magueystudio.mx**.

## Estructura
- `astro.config.mjs` — configuración de Astro. `site` = dominio de producción, `trailingSlash: 'never'`, `build.format: 'file'`, integración `@astrojs/sitemap` (genera `sitemap-index.xml`).
- `src/pages/` — páginas `.astro`. Cada archivo = una ruta (sin `.html`). Ej. `src/pages/geo.astro` → `/geo`.
- `src/pages/blog/[...slug].astro` — renderiza cada post del blog. `src/pages/blog/index.astro` — índice del blog.
- `src/content/blog/*.md` — **los posts del blog** (Markdown con frontmatter). Aquí van los artículos nuevos.
- `src/content/config.ts` — schema (Zod) del frontmatter del blog: `title` (≤70), `seoTitle?`, `description` (50–160), `pubDate`, `updatedDate?`, `category`, `draft`.
- `src/layouts/` — `BaseLayout.astro` (head/SEO/tema + nav/footer) y layout de artículo de blog.
- `src/components/` — `Nav.astro`, `Footer.astro`, `WhatsAppFloat.astro`, etc.
- `src/styles/global.css` — sistema de diseño compartido (paleta, tema claro/oscuro, nav, footer, botones).
- `public/` — archivos servidos tal cual en la raíz: `robots.txt`, `llms.txt`, `BingSiteAuth.xml`, `logo.png`, imágenes, y las **landings de clientes** (`agente/`, `promotoria/`, `santos/`, `dentista/`, `clinicas/`, `opus/`) que conservan su HTML original y su URL.
- `_legacy/` — copia del sitio HTML anterior (solo referencia; no se publica).

## Contenido y contexto
- **`client-brief.md` es el contexto para crear contenido** (negocio, audiencia, posicionamiento, SEO, restricciones de salud). Léelo antes de escribir blog/landings/copy.
- **`cliente.json`** — metadatos del cliente/proyecto.

## Escribir un post nuevo
1. Crea `src/content/blog/<slug>.md` con el frontmatter del schema (title ≤70; si el SEO title es más largo, usa `seoTitle`).
2. Cuerpo en Markdown (sin H1: el layout lo pone desde `title`).
3. Enlaces internos sin `.html` (`/geo`, `/salud`, `/blog/<slug>`).
4. `npm run build` para validar.

## Comandos
- `npm run dev` — servidor local.
- `npm run build` — genera `dist/` (lo que se publica).
- `npm run preview` — previsualiza el build.

## SEO — no romper
- Conservar TODAS las URLs actuales 1:1 (ver `_legacy/` y `sitemap`). El único redirect es `/fable → /clinicas` (301, en `vercel.json`).
- Conservar el schema `ProfessionalService` de la home con las **3 ciudades** (Tuxtla Gutiérrez, Tijuana, CDMX), `areaServed: "MX"` y `hasOfferCatalog`.
- Conservar `llms.txt`, `robots.txt` (con bots de IA), verificación de Bing (`BingSiteAuth.xml` + meta `msvalidate.01` en la home) y los canonicals por página.
