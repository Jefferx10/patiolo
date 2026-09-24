/* Datos de las cartas de Patiolo.
   Provisorio: cuando conectemos la base de datos, esta constante se reemplaza
   por una consulta (fetch) con la misma estructura y la página no cambia.

   Estructura:
   "slug-del-local": {
     nombre, tipo, descripcion,
     whatsapp: "56912345678",        // opcional, para el botón de pedido
     categorias: [
       { nombre: "Categoría", items: [
         { nombre, desc, precio, foto, destacado, agotado, antes }
       ]}
     ]
   }
   foto: ruta dentro de img/carta/ (si no existe, se muestra la llama de la marca)
   precio: número en pesos, sin puntos ni símbolo
   antes: precio anterior, para mostrar una oferta
*/
window.CARTAS = {
  "bacos-burger": {
    nombre: "Baco's Burger",
    tipo: "Hamburguesas",
    descripcion: "Smash burgers a la plancha, pan brioche y salsas de la casa.",
    categorias: [
      {
        nombre: "Hamburguesas",
        items: [
          { nombre: "Clásica Baco's", desc: "Doble smash de 160 g, cheddar, pepinillos y salsa de la casa en pan brioche.", precio: 8990, foto: "bacos-clasica.jpg", destacado: true },
          { nombre: "Baco's BBQ", desc: "Smash de 160 g, cebolla caramelizada, tocino crocante y salsa BBQ ahumada.", precio: 9990, foto: "bacos-bbq.jpg" },
          { nombre: "Cheese Lover", desc: "Triple cheddar fundido, cebolla crispy y mayo de ajo.", precio: 10490, foto: "bacos-cheese.jpg" },
          { nombre: "Veggie Baco's", desc: "Medallón de garbanzo y betarraga, palta, tomate y alioli.", precio: 8490, foto: "bacos-veggie.jpg" }
        ]
      },
      {
        nombre: "Acompañamientos",
        items: [
          { nombre: "Papas rústicas", desc: "Con sal de mar y romero.", precio: 3990, foto: "bacos-papas.jpg" },
          { nombre: "Aros de cebolla", desc: "Seis unidades, con salsa ranch.", precio: 4490, foto: "bacos-aros.jpg" }
        ]
      }
    ]
  },

  "nova-eklat": {
    nombre: "Nova Éklat",
    tipo: "Cafetería",
    descripcion: "Café de especialidad, pastelería y brunch para empezar temprano.",
    categorias: [
      {
        nombre: "Café",
        items: [
          { nombre: "Espresso", desc: "Grano de especialidad, tueste medio.", precio: 2290, foto: "nova-espresso.jpg" },
          { nombre: "Flat white", desc: "Doble espresso con leche texturizada.", precio: 3490, foto: "nova-flatwhite.jpg", destacado: true },
          { nombre: "Latte de vainilla", desc: "Con almíbar de vainilla natural.", precio: 3790, foto: "nova-latte.jpg" },
          { nombre: "Cold brew", desc: "Extracción en frío por 18 horas.", precio: 3990, foto: "nova-coldbrew.jpg" }
        ]
      },
      {
        nombre: "Pastelería",
        items: [
          { nombre: "Croissant de mantequilla", desc: "Horneado en el día.", precio: 2790, foto: "nova-croissant.jpg" },
          { nombre: "Cheesecake de frambuesa", desc: "Base de galleta y salsa de frambuesa fresca.", precio: 4490, foto: "nova-cheesecake.jpg" },
          { nombre: "Brunch Éklat", desc: "Huevos revueltos, palta, tostadas de masa madre y jugo natural.", precio: 8990, foto: "nova-brunch.jpg" }
        ]
      }
    ]
  },

  "chanchis": {
    nombre: "Chanchis",
    tipo: "Papas fritas con toppings",
    descripcion: "Papas cortadas a mano con cheddar, pulled pork, chorizo y más.",
    categorias: [
      {
        nombre: "Papas con toppings",
        items: [
          { nombre: "Chanchis clásica", desc: "Papas a mano, cheddar fundido y cebollín.", precio: 5990, foto: "chanchis-clasica.jpg", destacado: true },
          { nombre: "Pulled pork", desc: "Cerdo desmenuzado, salsa BBQ y pickles.", precio: 8490, foto: "chanchis-pulled.jpg" },
          { nombre: "Chorizo criollo", desc: "Chorizo en trozos, pebre y mayo de merkén.", precio: 7990, foto: "chanchis-chorizo.jpg" },
          { nombre: "Veggie crunch", desc: "Champiñones salteados, queso azul y nueces.", precio: 7490, foto: "chanchis-veggie.jpg" }
        ]
      },
      {
        nombre: "Para compartir",
        items: [
          { nombre: "Fuente Chanchis", desc: "Papas para cuatro personas con tres toppings a elección.", precio: 14990, foto: "chanchis-fuente.jpg" },
          { nombre: "Salsas extra", desc: "Cheddar, ranch, merkén o BBQ.", precio: 990, foto: "chanchis-salsas.jpg" }
        ]
      }
    ]
  },

  "oh-sushi": {
    nombre: "Oh Sushi",
    tipo: "Sushi",
    descripcion: "Rolls, nigiris y tablas para compartir, armados al momento.",
    categorias: [
      {
        nombre: "Rolls",
        items: [
          { nombre: "Acevichado", desc: "Camarón panko, palta y salsa acevichada.", precio: 7990, foto: "sushi-acevichado.jpg", destacado: true },
          { nombre: "Salmón furai", desc: "Salmón apanado, queso crema y cebollín.", precio: 7490, foto: "sushi-furai.jpg" },
          { nombre: "Veggie roll", desc: "Palta, pepino, zanahoria y sésamo.", precio: 6490, foto: "sushi-veggie.jpg" }
        ]
      },
      {
        nombre: "Tablas",
        items: [
          { nombre: "Tabla Oh Sushi", desc: "45 piezas variadas para compartir.", precio: 24990, foto: "sushi-tabla.jpg" },
          { nombre: "Tabla premium", desc: "60 piezas con salmón, camarón y atún.", precio: 34990, foto: "sushi-premium.jpg" }
        ]
      },
      {
        nombre: "Nigiris",
        items: [
          { nombre: "Nigiri de salmón", desc: "Dos unidades, con toque de limón.", precio: 4490, foto: "sushi-nigiri.jpg" },
          { nombre: "Nigiri flameado", desc: "Dos unidades, con queso crema flameado.", precio: 4990, foto: "sushi-flameado.jpg" }
        ]
      }
    ]
  },

  "oh-ramen": {
    nombre: "Oh Ramen",
    tipo: "Ramen",
    descripcion: "Caldos de cocción lenta, fideos y toppings a elección.",
    categorias: [
      {
        nombre: "Ramen",
        items: [
          { nombre: "Tonkotsu", desc: "Caldo de cerdo de 12 horas, chashu, huevo marinado y nori.", precio: 10990, foto: "ramen-tonkotsu.jpg", destacado: true },
          { nombre: "Shoyu", desc: "Caldo de pollo y soya, brotes de bambú y cebollín.", precio: 9990, foto: "ramen-shoyu.jpg" },
          { nombre: "Miso picante", desc: "Caldo de miso, aceite de chili y maíz.", precio: 10490, foto: "ramen-miso.jpg" },
          { nombre: "Veggie ramen", desc: "Caldo de hongos, tofu y verduras de estación.", precio: 9490, foto: "ramen-veggie.jpg" }
        ]
      },
      {
        nombre: "Entradas",
        items: [
          { nombre: "Gyozas", desc: "Cinco unidades de cerdo, a la plancha.", precio: 5990, foto: "ramen-gyozas.jpg" },
          { nombre: "Edamame", desc: "Con sal de mar.", precio: 3490, foto: "ramen-edamame.jpg" }
        ]
      }
    ]
  },

  "la-barra": {
    nombre: "La Barra",
    tipo: "Tragos y schop",
    descripcion: "Coctelería de autor, schop de barril y vinos, al centro del patio.",
    categorias: [
      {
        nombre: "Coctelería de autor",
        items: [
          { nombre: "Patiolo Sour", desc: "Pisco, limón de pica, almíbar de romero y amargo.", precio: 6990, foto: "barra-sour.jpg", destacado: true },
          { nombre: "Humo de fogón", desc: "Mezcal, piña asada y jarabe ahumado.", precio: 8490, foto: "barra-humo.jpg" },
          { nombre: "Gin del patio", desc: "Gin, pepino, albahaca y tónica premium.", precio: 7490, foto: "barra-gin.jpg" }
        ]
      },
      {
        nombre: "Cervezas",
        items: [
          { nombre: "Schop rubia 500 cc", desc: "De barril, rotativa de la semana.", precio: 4490, foto: "barra-schop.jpg" },
          { nombre: "Schop IPA 500 cc", desc: "Amarga y cítrica.", precio: 4990, foto: "barra-ipa.jpg" },
          { nombre: "Jarra 1,5 L", desc: "Para compartir, de la rubia del día.", precio: 11990, foto: "barra-jarra.jpg" }
        ]
      },
      {
        nombre: "Vinos y sin alcohol",
        items: [
          { nombre: "Copa de vino", desc: "Tinto o blanco de la selección de la casa.", precio: 4990, foto: "barra-vino.jpg" },
          { nombre: "Limonada de menta y jengibre", desc: "Jarro de 1 litro.", precio: 5490, foto: "barra-limonada.jpg" }
        ]
      }
    ]
  }
};
