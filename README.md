# Norvel — Sitio corporativo (demo)

Mockup de sitio corporativo para **Norvel Peritos Ajustadores**, una firma de ajuste de seguros **ficticia**.
Marca, logotipo, personas, teléfonos, direcciones, correos, aseguradoras y casos son inventados. Los dominios usan `.example` (reservado) y los teléfonos son `000`.

**Stack:** HTML5 · CSS3 (custom properties) · JavaScript vanilla · Decap CMS (opcional)

## Características

- 6 páginas: Inicio, Nosotros, Servicios, Experiencia, Equipo y Contacto
- Multilenguaje ES / EN / PT (`js/translations.js` + `js/i18n.js`)
- Contadores animados, scroll reveal, carrusel infinito y loader de página
- Galería filtrable con lightbox (`js/gallery.js`)
- Formulario de contacto listo para Formspree
- Panel Decap CMS en `/admin` (requiere Netlify Identity)
- SEO básico: meta tags, Open Graph, Schema.org, sitemap y robots

## Estructura

```
/
├── index.html · nosotros.html · servicios.html
├── experiencia.html · equipo.html · contacto.html
├── css/        main.css · components.css
├── js/         main.js · i18n.js · translations.js · gallery.js · cms-helpers.js
├── admin/      index.html · config.yml (Decap CMS)
├── assets/images/
│   ├── logo.svg · favicon.svg · about.svg · coverage-map.svg
│   └── gallery/caso-1.svg … caso-9.svg (ilustraciones)
├── netlify.toml · sitemap.xml · robots.txt
```

## Ver en local

El sitio usa rutas absolutas (`/css/...`), así que hay que servirlo desde la raíz:

```bash
python -m http.server 8080
```

Abrir http://localhost:8080

## Personalizar

- **Colores:** variables `--brand-*` al inicio de `css/main.css`
- **Textos:** `js/translations.js` (los tres idiomas) y el HTML de cada página
- **Formulario:** reemplazar `YOUR_FORM_ID` en `contacto.html` con un ID de Formspree
- **Dominio:** reemplazar `https://norvel.example` en `sitemap.xml`, `robots.txt` y el Schema.org de `index.html` / `contacto.html`

## Deploy (Netlify)

1. Importar el repositorio en Netlify, sin build command y con `publish directory = .`
2. (Opcional, para el CMS) Activar **Identity** y **Git Gateway**
