# Brújula de Negocio 🧭

Aplicativo web general de **orientación emprendedora para jóvenes y adultos**.
Responde un test sobre tu perfil —edad, localidad, género, afinidades, habilidades
e intereses— y obtén qué **categoría general de negocio** encaja mejor contigo, con
sus requisitos, riesgos, lo que necesitas aprender y lo que debes verificar.

**App en línea:** https://nelsonojeda78.github.io/brujula-negocio/

> Este repositorio es independiente. Toma como referencia la estructura del
> aplicativo *Mi Primer Negocio* (hecho para un caso específico en Macará, Loja),
> pero su catálogo, su motor de afinidad y su público son distintos y generales.

---

## Diferencia clave con el aplicativo de referencia

| | Mi Primer Negocio | Brújula de Negocio |
|---|---|---|
| Público | Un adolescente de 16 años en Macará | Jóvenes y adultos, cualquier localidad |
| Entrada | Test fijo de 9 preguntas | Perfil configurable: edad, zona, género, capital, tiempo, afinidades, habilidades, intereses, condiciones |
| Salida | 9 ideas de negocio concretas | **10 categorías generales**, sin ideas concretas |
| Localidad | Macará, Loja (fija) | Se pregunta por tamaño y tipo de zona; nunca ubicación exacta |

**No entrega ideas de negocio concretas.** Entrega el *tipo* de negocio y el método
para que cada persona lo aterrice en su propio contexto. Esa fue una decisión de
diseño explícita: una idea concreta útil en una ciudad puede no servir en otra.

---

## Qué hace la aplicación

| Módulo | Para qué sirve |
|---|---|
| 🎯 **Test de perfil** | 9 preguntas sin ningún dato personal: rango de edad, tipo de zona, género (opcional), capital, tiempo, afinidades, habilidades, intereses y condiciones |
| 🧭 **Tu orientación** | Ranking de las 10 categorías con porcentaje y, sobre todo, **el motivo de cada ajuste** |
| 🗂️ **Las 10 categorías** | Servicios personales, oficios, comercio, comida, digital, educación, cuidado, logística, creatividad, hogar — con capital típico, permisos, escalabilidad, riesgos, qué aprender y qué verificar |
| 🧮 **Tus números** | Costo, precio, margen y **punto de equilibrio**; incluye la regla de la reserva |
| 🔍 **3 precios** | Comparador de 3 fuentes que calcula la **mediana** del mercado |
| 🗓️ **Plan de 90 días** | Entender · Verificar · Probar · Decidir, con 25 tareas y progreso guardado |
| 📒 **Libreta** | Registro de ingresos y gastos con resultado real y exportación a CSV |
| 🏛️ **6 pilares** | Lo que hay que resolver antes de invertir en cualquier negocio |
| 🔐 **Privacidad** | Qué se guarda, dónde, y qué nunca se pide |

---

## Privacidad — por diseño

**Ningún dato sale del dispositivo y no se pide ningún dato identificatorio.**

- No se pide **nombre, documento, dirección, teléfono, correo ni fecha de nacimiento**.
- La **localidad** se pregunta por *tamaño y tipo de zona* (ciudad grande, pueblo,
  zona fronteriza…), nunca por ubicación exacta.
- El **género** es opcional, con la opción "prefiero no decirlo".
- Todo se guarda en el `localStorage` del navegador. **No hay backend, ni analítica,
  ni peticiones a servidores propios.**
- El usuario puede **exportar** todos sus datos o **borrarlos** desde la app.
- El `.gitignore` bloquea exportaciones (`.csv`, `.json`) para que no se suban al repo.

> El sitio y el repositorio son públicos. **El código es público; los datos de cada
> persona nunca salen de su dispositivo.**

---

## Alcance y descargos

La app repite estas advertencias de forma visible en lugar de esconderlas:

- Entrega **orientación general**, no asesoría profesional, legal, contable ni tributaria.
- **No fija precios, márgenes, costos ni proyecciones de ingreso.** Esos números
  dependen de cada mercado y los debe levantar el usuario con 3 fuentes reales.
- Los **requisitos legales, sanitarios y de permisos varían por país, ciudad y
  actividad**: la app indica *qué* verificar, no *cuál* es la respuesta.
- **Ninguna categoría sugerida es una recomendación de inversión.**
- Si el usuario es **menor de edad**, la app lo señala y advierte sobre la necesidad
  de un adulto responsable para contratos, permisos y obligaciones legales.

---

## Estructura

```
├── app/                          ← sitio publicado
│   ├── index.html                ← estructura
│   ├── styles.css                ← tema visual
│   ├── app.js                    ← motor de afinidad y módulos
│   ├── data.js                   ← perfil, categorías, pilares, plan
│   ├── sw.js                     ← service worker con auto-actualización
│   ├── manifest.webmanifest      ← configuración PWA
│   └── icon-*.png                ← iconos
├── .github/workflows/
│   └── deploy-pages.yml          ← despliegue automático a Pages
└── README.md
```

---

## Cómo se usa

### Celular
1. Abrir https://nelsonojeda78.github.io/brujula-negocio/
2. Menú del navegador → **"Agregar a pantalla de inicio"**.
3. Queda como app con su icono y **funciona sin conexión**.

### PC
Abrir el mismo enlace, o instalarla desde el icono de instalación de la barra de
direcciones (Chrome/Edge).

---

## Actualización automática

- Cada `push` a `main` publica automáticamente vía GitHub Actions.
- El *service worker* detecta la versión nueva en segundo plano.
- Aparece el aviso **"Hay una versión nueva · Actualizar"**; al tocarlo, la app se
  actualiza sola y **conserva los datos del usuario**.
- No hay que reinstalar nada en los dispositivos.

---

## Cómo hacer cambios

```bash
git clone https://github.com/nelsonojeda78/brujula-negocio.git
cd brujula-negocio
# editar archivos de app/ (el contenido está en app/data.js)
git add .
git commit -m "Describe el cambio"
git push
```

En 1–2 minutos Pages publica la versión nueva y los dispositivos la reciben solos.

Para probar localmente hace falta un servidor (el service worker no funciona con
`file://`):

```bash
python3 -m http.server 8899 --directory app
# abrir http://127.0.0.1:8899/
```

---

## Cómo ajustar el motor de afinidad

El puntaje base combina dos cosas, ambas visibles en la interfaz:

- **Intensidad (60%)**: cuánto pesa en el perfil cada eje que la categoría valora.
- **Cobertura (40%)**: qué proporción de los ejes que la categoría pide están presentes.

Sobre eso se aplican **reglas explícitas y trazables** por capital, espacio físico,
vehículo, urgencia de ingresos, carga de permisos, minoría de edad, disponibilidad de
equipo, dependientes y tamaño de la localidad. Cada ajuste se muestra al usuario con
su motivo, en la sección *"Por qué te salió esta"*.

Los pesos viven en `app/data.js`: en `senales` de cada categoría y en las constantes
de `PESO` de afinidades, habilidades e intereses en `app/app.js`.

---

## Licencia y uso

Proyecto de orientación educativa. Úsalo y adáptalo libremente. Si lo publicas
modificado, conserva los descargos y las advertencias de alcance: son parte del valor
de la herramienta, no adornos.
