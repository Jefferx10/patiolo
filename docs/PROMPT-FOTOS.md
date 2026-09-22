# Prompt para Antigravity Agent (Google AI Studio): fotos del sitio

Sube con ⊕ estas 3 fotos:
- `mesas.jpg`: tus mesas y sillas
- `fogon.jpg`: el fogón
- `fachada.jpg`: la fachada de ejemplo de los locales

Luego pega todo lo que está dentro del bloque:

```
Adjunto 3 fotos reales de PATIOLO (patio de comidas, bar y eventos): mesas.jpg (mesas y sillas), fogon.jpg (el fogón)
y fachada.jpg (fachada de ejemplo de los locales del patio). Necesito las fotos finales del sitio web.

Usa con mi API key vinculada el modelo de edición/generación de imágenes de Gemini más reciente disponible
(los "image" / Nano Banana), pasando mi foto como imagen de entrada en cada caso.

ESTILO COMÚN (todas las imágenes):
- Fotografía nocturna profesional de hospitalidad, fotorrealista, poca profundidad de campo.
- Luz cálida de guirnaldas con ampolletas Edison; brillos y reflejos en la paleta de la marca:
  burdeos #5F1121, negro carbón #212121, crema #FFF8E1 y dorado suave #C5A07F.
- Sin personas en primer plano, sin marcas de agua, sin texto aparte del que pido.
- Que las 8 imágenes parezcan de la misma sesión de fotos.

REGLA PARA LAS FOTOS REALES (mesas y fogón): son muebles reales que el cliente va a ver en persona.
No cambies su forma, color, material, cantidad ni posición. Solo mejora la foto y el ambiente.

IMÁGENES:

1. bancas.jpg: a partir de mesas.jpg
   De noche, con guirnaldas de ampolletas encima de las mesas. Limpia el fondo (basura, cables, autos), sin inventar objetos.
   16:9, 1600x900.

2. fogata.jpg: a partir de fogon.jpg
   De noche, con fuego vivo en el fogón, brasas brillando, el entorno iluminado por el fuego y guirnaldas arriba.
   4:3, 1600x1200.

3 a 8. Fachadas de los locales, a partir de fachada.jpg
   Mantén la misma arquitectura, materiales y proporciones de la fachada real. En cada una cambia solo el letrero,
   la iluminación interior y los detalles del mesón según el local.
   Todos los letreros siguen el mismo sistema: letras doradas retroiluminadas sobre fondo negro/carbón, con el
   nombre del local escrito EXACTAMENTE como se indica y un pequeño ícono simple al lado. Toma como referencia
   el estilo de los letreros "NOVA ÉKLAT" y "LA PARRILLA" del render del patio.
   16:9, 1600x900, con el letrero centrado y legible.

   3. local-bacos.jpg: "BACO'S BURGER", hamburguesería. Plancha a la vista, humo suave, pan brioche en el mesón.
   4. local-nova.jpg: "NOVA ÉKLAT", cafetería. Máquina de espresso de cobre, vitrina de pastelería, luz cálida.
   5. local-chanchis.jpg: "CHANCHIS", papas fritas con toppings. Freidoras, conos y bandejas de papas con cheddar y toppings.
   6. local-ohsushi.jpg: "OH SUSHI", sushi. Barra de madera clara, vitrina con pescado fresco, faroles de papel.
   7. local-ohramen.jpg: "OH RAMEN", ramen. Ollas humeantes, cortina noren sobre la entrada, bowls en el mesón.
   8. local-barra.jpg: "LA BARRA", barra de tragos. Contra-barra de botellas iluminada, schoperas de cobre,
      cócteles en la barra. Este fondo puede ser burdeos #5F1121 en vez de carbón.

PROCESO:
- Genera 2 opciones de cada imagen y muéstrame una grilla por imagen para elegir.
- Revisa letra por letra el texto de cada letrero. Si alguno sale mal escrito, genéralo de nuevo; si falla dos
  veces, deja ese letrero de lado o poco visible, pero nunca con letras mal escritas.
- Con las elegidas: recorta y escala al tamaño exacto indicado, JPG calidad 82, menos de 400 KB cada una.
- Entrégame fotos-patiolo.zip con los 8 archivos, con exactamente estos nombres:
  bancas.jpg, fogata.jpg, local-bacos.jpg, local-nova.jpg, local-chanchis.jpg,
  local-ohsushi.jpg, local-ohramen.jpg, local-barra.jpg
```

Cuando tengas el zip, copia los 8 archivos a la carpeta `img/` del sitio y reemplaza los anteriores si te lo pide. El sitio los muestra solo, sin tocar el HTML. Mientras falte alguna, la tarjeta muestra la llama de la marca.
