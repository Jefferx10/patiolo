"""
Genera los videos de portada de Patiolo con Veo 3.1 (Gemini API), en 1080p.

Uso:
    pip install google-genai
    # Windows (PowerShell):  $env:GEMINI_API_KEY="tu_clave"
    # Mac / Linux:           export GEMINI_API_KEY="tu_clave"
    python tools/generar_video_veo.py              # horizontal + vertical, modelo estándar
    python tools/generar_video_veo.py --solo-horizontal
    python tools/generar_video_veo.py --rapido     # modelo Fast: más barato, algo menos detalle

Resultado (en la carpeta public/):
    patiolo-hero.mp4           16:9, para escritorio
    patiolo-hero-vertical.mp4  9:16, para celular
Si ffmpeg está instalado, los deja comprimidos para web (sin audio, ~2-4 MB).
"""

import argparse
import os
import shutil
import subprocess
import sys
import time

from google import genai
from google.genai import types

CARPETA = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(CARPETA)

PROMPT = (
    'Cinematic night establishing shot of an upscale open-air food patio called PATIOLO. '
    'Very slow, smooth dolly push-in toward the illuminated gold "PATIOLO" sign; camera stays level and steady. '
    'Warm Edison string lights gently sway and softly flicker; the flames in the fire pit and the copper grill dance naturally; '
    'subtle heat shimmer above the fire; leaves of the hanging plants and olive trees move slightly in a light breeze; '
    'a few blurred guests in the background walk and chat, staying out of focus. '
    'Moody, elegant, warm color grade: deep burgundy, charcoal black, cream and soft gold highlights. '
    'Shallow depth of field, anamorphic film look, 24fps, natural motion, photorealistic. '
    'Keep the sign text "PATIOLO" and all restaurant signage exactly as in the source image.'
)

NEGATIVO = (
    'text changes, warped or misspelled letters, new logos, camera shake, fast motion, zoom jumps, '
    'people in the foreground, faces close-up, daylight, cartoon, oversaturated colors'
)

VIDEOS = [
    # (imagen inicial, formato, archivo final)
    ('docs/veo/frame-16x9.jpg', '16:9', 'patiolo-hero.mp4'),
    ('docs/veo/frame-9x16.jpg', '9:16', 'patiolo-hero-vertical.mp4'),
]


def cargar_imagen(ruta):
    with open(os.path.join(RAIZ, ruta), 'rb') as f:
        return types.Image(image_bytes=f.read(), mime_type='image/jpeg')


def generar(client, modelo, imagen, formato, resolucion, loop):
    config = types.GenerateVideosConfig(
        aspect_ratio=formato,
        resolution=resolucion,
        duration_seconds=8,
        negative_prompt=NEGATIVO,
        number_of_videos=1,
        last_frame=imagen if loop else None,  # misma imagen al final = loop sin corte
    )
    op = client.models.generate_videos(model=modelo, prompt=PROMPT, image=imagen, config=config)
    inicio = time.time()
    while not op.done:
        print(f'   generando... {int(time.time() - inicio)} s', end='\r', flush=True)
        time.sleep(10)
        op = client.operations.get(op)
    print()
    if op.error:
        raise RuntimeError(op.error)
    videos = getattr(op.response, 'generated_videos', None) or []
    if not videos:
        raise RuntimeError('Veo no devolvió video (posible filtro de contenido). Prueba de nuevo o ajusta el prompt.')
    return videos[0].video


def intentar(client, modelo, imagen, formato):
    """Prueba 1080p con loop; si la API no acepta alguna opción, baja de a una."""
    intentos = [('1080p', True), ('1080p', False), ('720p', True), ('720p', False)]
    ultimo_error = None
    for resolucion, loop in intentos:
        try:
            print(f' → {formato} {resolucion}{" con loop" if loop else ""}')
            return generar(client, modelo, imagen, formato, resolucion, loop), resolucion
        except Exception as e:  # noqa: BLE001
            ultimo_error = e
            print(f'   no se pudo ({e}). Probando otra combinación…')
    raise RuntimeError(f'No se pudo generar el video {formato}: {ultimo_error}')


def comprimir(origen, destino, ancho):
    if not shutil.which('ffmpeg'):
        os.replace(origen, destino)
        print(f'   ffmpeg no está instalado: quedó sin comprimir como {os.path.basename(destino)}')
        return
    subprocess.run([
        'ffmpeg', '-y', '-loglevel', 'error', '-i', origen, '-an',
        '-vf', f'scale={ancho}:-2', '-c:v', 'libx264', '-crf', '26', '-preset', 'slow',
        '-pix_fmt', 'yuv420p', '-movflags', '+faststart', destino,
    ], check=True)
    os.remove(origen)
    print(f'   listo: {os.path.basename(destino)} ({os.path.getsize(destino) / 1e6:.1f} MB)')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--rapido', action='store_true', help='usar Veo 3.1 Fast')
    ap.add_argument('--solo-horizontal', action='store_true')
    args = ap.parse_args()

    if not os.environ.get('GEMINI_API_KEY') and not os.environ.get('GOOGLE_API_KEY'):
        sys.exit('Falta la clave: define GEMINI_API_KEY antes de correr el script.')

    modelo = 'veo-3.1-fast-generate-preview' if args.rapido else 'veo-3.1-generate-preview'
    client = genai.Client()
    lista = VIDEOS[:1] if args.solo_horizontal else VIDEOS

    for ruta_img, formato, final in lista:
        print(f'\nVideo {formato} con {modelo}')
        video, resolucion = intentar(client, modelo, cargar_imagen(ruta_img), formato)
        client.files.download(file=video)
        crudo = os.path.join(RAIZ, 'public', f'veo-{formato.replace(":", "x")}-{resolucion}.mp4')
        video.save(crudo)
        print(f'   descargado: {os.path.basename(crudo)}')
        comprimir(crudo, os.path.join(RAIZ, 'public', final), 1920 if formato == '16:9' else 1080)

    print('\nListo. Abre index.html para ver la portada con el video.')


if __name__ == '__main__':
    main()
