# Patiolo — sitio web

```
patiolo-sitio/
├── index.html                   ← el sitio (celular + escritorio)
├── img/                         ← fotos
├── veo/frame-16x9.jpg           ← imagen inicial para el video horizontal
├── veo/frame-9x16.jpg           ← imagen inicial para el video vertical
├── patiolo-hero.mp4             ← (agrégalo) video Veo 16:9
└── patiolo-hero-vertical.mp4    ← (agrégalo) video Veo 9:16, para celular
```

Mientras no estén los videos, la portada muestra la foto del patio. En cuanto los agregas, se reproducen solos, en silencio y en loop, con un botón para pausar.

---

## 1. Generar el video en Veo 3.1 (imagen a video)

Dónde: Google Flow (flow.google), la app de Gemini o Google AI Studio, con el modelo **Veo 3.1**.

- Horizontal: imagen inicial `veo/frame-16x9.jpg`, formato **16:9**, 8 s, 1080p.
- Vertical: imagen inicial `veo/frame-9x16.jpg`, formato **9:16**, 8 s.
- Para que el loop no se corte: en Flow usa **Frames to Video** y pon la **misma imagen como primer y último cuadro**.

**Prompt (pégalo tal cual, Veo entiende mejor en inglés):**

```
Cinematic night establishing shot of an upscale open-air food patio called PATIOLO.
Very slow, smooth dolly push-in toward the illuminated gold "PATIOLO" sign; camera stays level and steady.
Warm Edison string lights gently sway and softly flicker; the flames in the fire pit and the copper grill dance naturally;
subtle heat shimmer above the fire; leaves of the hanging plants and olive trees move slightly in a light breeze;
a few blurred guests in the background walk and chat, staying out of focus.
Moody, elegant, warm color grade: deep burgundy, charcoal black, cream and soft gold highlights.
Shallow depth of field, anamorphic film look, 24fps, natural motion, photorealistic.
Keep the sign text "PATIOLO" and all restaurant signage exactly as in the source image.
```

**Prompt negativo** (si la herramienta lo permite):

```
text changes, warped or misspelled letters, new logos, camera shake, fast motion, zoom jumps, people in the foreground, faces close-up, daylight, cartoon, oversaturated colors
```

Tips:
- Genera 2 a 4 versiones y quédate con la que mantiene el letrero intacto. Si Veo deforma "PATIOLO", baja el movimiento de cámara (usa "static camera" en vez de "dolly push-in").
- Veo agrega audio, pero la web lo reproduce en silencio igual.

### Opción B: 1080p con tu clave de Google AI (Gemini API)

Flow limita la descarga a 720p en tu plan, pero la API de Veo 3.1 genera en 1080p y cobra de tu saldo.

```bash
pip install google-genai
export GEMINI_API_KEY="tu_clave"          # Windows PowerShell: $env:GEMINI_API_KEY="tu_clave"
python generar_video_veo.py --solo-horizontal   # primero uno, para revisar
python generar_video_veo.py                     # horizontal + vertical
python generar_video_veo.py --rapido            # modelo Fast, más barato
```

El script usa la misma imagen como primer y último cuadro (loop sin corte), descarga el video y, si tienes ffmpeg, lo deja comprimido con el nombre final.

---

## 2. Optimizar el video para la web

Veo exporta videos pesados. Esto los deja en ~2–4 MB, sin audio y listos para streaming:

```bash
ffmpeg -i veo-horizontal.mp4 -an -vf "scale=1920:-2" -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart patiolo-hero.mp4
ffmpeg -i veo-vertical.mp4   -an -vf "scale=1080:-2" -c:v libx264 -crf 27 -preset slow -pix_fmt yuv420p -movflags +faststart patiolo-hero-vertical.mp4
```

---

## 3. Integrarlo con Antigravity

Abre la carpeta `patiolo-sitio` en Antigravity, deja los dos videos de Veo dentro y pega esto al agente:

```
Este es el sitio de Patiolo (index.html estático, sin frameworks). Mantén exactamente la identidad:
paleta burdeos #5F1121, crema #FFF8E1, carbón #212121, dorado #C5A07F; títulos en Marcellus, texto en Montserrat;
logo de llama con hoja (SVG ya incluido). No cambies textos, colores ni tipografías.

Tareas:
1. En esta carpeta hay dos videos de Veo 3.1. Comprímelos con ffmpeg (sin audio, H.264, CRF 26, +faststart):
   el horizontal a 1920 px de ancho como patiolo-hero.mp4, y el vertical a 1080 px de ancho como patiolo-hero-vertical.mp4.
2. Verifica que la portada (#inicio) reproduzca el video en loop, en silencio, con el póster img/patio.jpg mientras carga,
   el vertical en celulares en modo retrato, y que el botón "Pausar video" funcione y respete prefers-reduced-motion.
3. Abre el sitio en el navegador a 1440 px y a 390 px de ancho y revisa que el texto de la portada se lea bien sobre el video;
   si el video es muy claro, sube la opacidad de .hero::before (hoy 0.35).
4. Reemplaza en el script la constante WHATSAPP por [TU NÚMERO, ej. 56912345678].
5. Publica la carpeta en Cloudflare Pages.
```

---

## 4. Pendientes antes de publicar

- Número de WhatsApp: `var WHATSAPP = '56900000000';` al final de `index.html`.
- Datos entre corchetes: `[DIRECCIÓN]`, `[HORARIO]`, `[NOMBRE DEL SHOW]`, `[LOCAL 1]`, `[@USUARIO]`…
- Mapa: reemplaza el bloque `[MAPA]` por el iframe de Google Maps (Compartir → Insertar un mapa).
- Fotos reales de cada local y del artista de la semana.
