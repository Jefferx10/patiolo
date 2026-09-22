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
