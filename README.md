# Patiolo — sitio web

Patio de comidas, bar y experiencias.

- `public/`: el sitio que se publica (index.html, img/ y los videos de portada)
- `docs/`: guías, prompts para Veo y fotos, y cuadros iniciales del video
- `tools/`: script para generar el video de portada con Veo 3.1

## Videos de portada
Copia a `public/` los videos comprimidos:
- `patiolo-hero.mp4` (16:9)
- `patiolo-hero-vertical.mp4` (9:16, opcional)

Deben pesar menos de 5 MB cada uno.

## Publicar (Cloudflare Pages)
- Framework preset: None
- Build command: vacío
- Build output directory: `public`

## Reservas conectadas a la app Patiolo
La sección **Reserva tu mesa** (`#reservar`) y el formulario de **Eventos privados** envían los datos a la app
(Firebase, función `reservasWeb`). Las reservas aparecen al instante en la app, menú **Reservas**.

- Dirección del servicio: variable `API_RESERVAS` en el `<script>` de `index.html`.
- Horarios, capacidad, días bloqueados y confirmación automática se configuran en la app: **Configuración → Reservas**.
- Dominios aceptados: `patiolo.cl` (y subdominios), `*.pages.dev` y los que agregues en esa misma pantalla.
- Si el servicio no responde, los formularios ofrecen enviar la solicitud por WhatsApp.
