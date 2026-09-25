/* ==========================================================================
   DATOS — Brújula de Negocio
   Test general de orientación emprendedora para jóvenes y adultos.

   ALCANCE DECLARADO (importante):
   Esta app NO entrega ideas de negocio concretas. Entrega CATEGORÍAS GENERALES
   de negocio y una guía para que cada persona las aterrice en su propio
   contexto. No fija precios, márgenes, costos ni proyecciones de ingreso:
   esos datos dependen de cada localidad y deben levantarse localmente.

   Referencia metodológica: el informe A1 (Macará, Loja) sirvió como modelo de
   estructura y de disciplina de advertencias. Las categorías de este catálogo
   son de propósito general y NO provienen de ese informe.
   ========================================================================== */

export const META = {
  app: 'Brújula de Negocio',
  version: '1.0.0',
  lema: 'Encuentra el tipo de negocio que encaja contigo',
  referencia: 'Estructura inspirada en el informe A1 — orientación para decisión humana',
  alcance: 'Orientación general. No es asesoría financiera, legal ni tributaria.'
};

/* --------------------------------------------------------------------------
   AVISO CENTRAL — se muestra en inicio y en resultados
   -------------------------------------------------------------------------- */
export const AVISO_CENTRAL = {
  titulo: 'Qué es y qué no es esta app',
  es: [
    'Una herramienta de orientación que ordena tu perfil y te sugiere CATEGORÍAS de negocio.',
    'Una guía de lo que necesitas aprender, conseguir y verificar antes de invertir.',
    'Un espacio privado: tus respuestas se quedan en tu dispositivo.'
  ],
  noEs: [
    'No te da una idea de negocio lista. Te da la categoría y el método para que la definas tú.',
    'No fija precios, márgenes, costos ni ingresos. Esos números dependen de tu localidad y los tienes que levantar tú.',
    'No es asesoría legal, contable ni tributaria. Los requisitos varían por país, ciudad y actividad.',
    'No predice si vas a ganar dinero. Nadie puede hacerlo sin datos reales de tu mercado.'
  ],
  reglaOro: 'Ninguna categoría que salga aquí es una recomendación de inversión. Es un punto de partida para investigar.'
};

/* --------------------------------------------------------------------------
   PERFIL — datos que se piden. NINGUNO es identificatorio.
   -------------------------------------------------------------------------- */
export const EDADES = [
  { id: 'e1', r: '13–17', n: '13 a 17 años', nota: 'Menor de edad: requiere acompañamiento de un adulto responsable para contratos, permisos y obligaciones legales.', menor: true },
  { id: 'e2', r: '18–24', n: '18 a 24 años', nota: 'Mayor de edad. Puede contratar y registrar a su nombre, aunque quizá con poco capital.' },
  { id: 'e3', r: '25–34', n: '25 a 34 años', nota: 'Suele haber experiencia laboral y algo de capital o crédito.' },
  { id: 'e4', r: '35–49', n: '35 a 49 años', nota: 'Experiencia y red de contactos consolidadas; tiempo más limitado.' },
  { id: 'e5', r: '50+', n: '50 años o más', nota: 'Experiencia y capital acumulados; el tiempo disponible y el riesgo asumible cambian.' }
];

export const GENEROS = [
  { id: 'g0', n: 'Prefiero no decirlo' },
  { id: 'g1', n: 'Mujer' },
  { id: 'g2', n: 'Hombre' },
  { id: 'g3', n: 'Otro / prefiero describirlo yo' }
];

/* Localidad: por tamaño y tipo, no por nombre (no pedimos ubicación exacta) */
export const LOCALIDADES = [
  { id: 'l1', n: 'Ciudad grande (más de 500 000 habitantes)', nota: 'Volumen alto, competencia alta, alquileres caros.' },
  { id: 'l2', n: 'Ciudad mediana (100 000 a 500 000)', nota: 'Equilibrio entre volumen y competencia.' },
  { id: 'l3', n: 'Ciudad pequeña (20 000 a 100 000)', nota: 'Mercado de proximidad; la reputación pesa mucho.' },
  { id: 'l4', n: 'Pueblo o zona rural (menos de 20 000)', nota: 'Mercado pequeño; conviene ticket bajo y alta rotación, o vender fuera por internet.' },
  { id: 'l5', n: 'Zona fronteriza o de paso', nota: 'Flujo de personas de afuera. Oportunidad y riesgo: el flujo puede cortarse.' }
];

/* Capital disponible en USD (moneda neutra, se aclara que es referencial) */
export const CAPITALES = [
  { id: 'c1', n: 'Casi nada (menos de 100 USD)', v: 0 },
  { id: 'c2', n: 'Poco (100 a 500 USD)', v: 1 },
  { id: 'c3', n: 'Moderado (500 a 2 000 USD)', v: 2 },
  { id: 'c4', n: 'Amplio (más de 2 000 USD)', v: 3 }
];

export const TIEMPOS = [
  { id: 't1', n: 'Menos de 10 horas por semana', v: 1 },
  { id: 't2', n: 'Entre 10 y 25 horas por semana', v: 2 },
  { id: 't3', n: 'Entre 25 y 40 horas por semana', v: 3 },
  { id: 't4', n: 'Tiempo completo (más de 40 horas)', v: 4 }
];

/* Afinidades: qué tipo de trabajo disfruta / tolera */
export const AFINIDADES = [
  { id: 'a1', n: 'Tratar con personas cara a cara', eje: 'personas' },
  { id: 'a2', n: 'Trabajar solo, con concentración', eje: 'soledad' },
  { id: 'a3', n: 'Hacer cosas con las manos', eje: 'manual' },
  { id: 'a4', n: 'Usar computadora o celular', eje: 'digital' },
  { id: 'a5', n: 'Cocinar o preparar alimentos', eje: 'alimento' },
  { id: 'a6', n: 'Vender y convencer', eje: 'venta' },
  { id: 'a7', n: 'Organizar, ordenar y planificar', eje: 'organizacion' },
  { id: 'a8', n: 'Enseñar o explicar', eje: 'ensenanza' },
  { id: 'a9', n: 'Cuidar o atender a otros', eje: 'cuidado' },
  { id: 'a10', n: 'Crear, diseñar o inventar', eje: 'creatividad' },
  { id: 'a11', n: 'Moverme, hacer diligencias, recorrer la ciudad', eje: 'movilidad' },
  { id: 'a12', n: 'Reparar y mantener cosas', eje: 'reparacion' }
];

/* Habilidades: qué ya sabe hacer (se autoevalúa) */
export const HABILIDADES_PERFIL = [
  { id: 'h1', n: 'Llevar cuentas y ser ordenado con el dinero', eje: 'finanzas' },
  { id: 'h2', n: 'Hablar con desconocidos con facilidad', eje: 'comunicacion' },
  { id: 'h3', n: 'Vender o negociar', eje: 'venta' },
  { id: 'h4', n: 'Usar herramientas digitales y redes', eje: 'digital' },
  { id: 'h5', n: 'Diseñar, editar o crear contenido', eje: 'creatividad' },
  { id: 'h6', n: 'Cocinar o manejar alimentos', eje: 'alimento' },
  { id: 'h7', n: 'Reparar, armar o mantener equipos', eje: 'reparacion' },
  { id: 'h8', n: 'Enseñar o capacitar a otros', eje: 'ensenanza' },
  { id: 'h9', n: 'Organizar eventos o coordinar personas', eje: 'organizacion' },
  { id: 'h10', n: 'Cuidar niños, adultos mayores o enfermos', eje: 'cuidado' },
  { id: 'h11', n: 'Escribir bien', eje: 'escritura' },
  { id: 'h12', n: 'Conducir vehículo o moto', eje: 'movilidad' }
];

/* Intereses: qué temas le importan */
export const INTERESES = [
  { id: 'i1', n: 'Deporte y actividad física', eje: 'deporte' },
  { id: 'i2', n: 'Comida y bebida', eje: 'alimento' },
  { id: 'i3', n: 'Moda, belleza y cuidado personal', eje: 'belleza' },
  { id: 'i4', n: 'Tecnología e internet', eje: 'digital' },
  { id: 'i5', n: 'Educación y aprendizaje', eje: 'ensenanza' },
  { id: 'i6', n: 'Salud y bienestar', eje: 'cuidado' },
  { id: 'i7', n: 'Hogar, decoración y jardín', eje: 'hogar' },
  { id: 'i8', n: 'Animales y mascotas', eje: 'animales' },
  { id: 'i9', n: 'Arte, música y cultura', eje: 'creatividad' },
  { id: 'i10', n: 'Comercio y ventas', eje: 'venta' },
  { id: 'i11', n: 'Construcción y oficios', eje: 'manual' },
  { id: 'i12', n: 'Eventos y celebraciones', eje: 'eventos' }
];

/* Situaciones que condicionan la recomendación */
export const CONDICIONES = [
  { id: 'k1', n: 'Tengo un espacio físico disponible (local, garaje, patio)', eje: 'espacio' },
  { id: 'k2', n: 'Tengo vehículo o moto para movilizarme', eje: 'movilidad' },
  { id: 'k3', n: 'Tengo computadora e internet estable', eje: 'equipoDigital' },
  { id: 'k4', n: 'Solo tengo celular con internet', eje: 'soloCelular' },
  { id: 'k5', n: 'Necesito ingresos pronto (no puedo esperar meses)', eje: 'urgencia' },
  { id: 'k6', n: 'Puedo esperar unos meses antes de ganar', eje: 'paciencia' },
  { id: 'k7', n: 'Tengo familia o personas que dependen de mí', eje: 'dependientes' },
  { id: 'k8', n: 'Puedo conseguir ayuda de alguien con experiencia', eje: 'mentor' }
];

/* --------------------------------------------------------------------------
   CATEGORÍAS GENERALES DE NEGOCIO
   Sin ideas concretas. Cada categoría describe un TIPO de negocio y su
   estructura de requisitos. `senales` mapea ejes del perfil a pesos.
   -------------------------------------------------------------------------- */
export const CATEGORIAS = [
  {
    id: 'K1', emoji: '🤝', nombre: 'Servicios personales y de proximidad',
    definicion: 'Vendes tu tiempo y tu trato directo a personas de tu entorno: apoyo en tareas cotidianas, atención a domicilio, diligencias, asistencia puntual.',
    ejemplosTipo: 'Se aterriza en tu ciudad según lo que la gente ya pide y no encuentra.',
    capitalMin: 0, requiereLocal: false, requierePermiso: 'bajo', escalable: false, ingresoRapido: true,
    senales: { personas: 3, movilidad: 2, cuidado: 2, organizacion: 1, venta: 1, comunicacion: 1, servicio: 3 },
    competencia: 'Alta y muy local. Se compite por confianza, puntualidad y trato.',
    margenTipo: 'Por hora o por servicio. El techo lo pone tu tiempo disponible.',
    riesgos: ['Ingreso atado a tus horas: no escala sin contratar.', 'Depende de tu reputación; un mal servicio cuesta clientes rápido.', 'Si entras a casas ajenas, la seguridad personal es un factor real.'],
    aprender: ['Atención al cliente y manejo de quejas', 'Fijar tarifas por servicio, no por intuición', 'Agenda y puntualidad', 'Protocolos de seguridad personal'],
    verificar: ['Si tu actividad exige permiso municipal o registro', 'Seguro o responsabilidad civil si entras a domicilios', 'Cómo cobrar y registrar sin mezclar el dinero propio']
  },
  {
    id: 'K2', emoji: '🛠️', nombre: 'Oficios, reparación y mantenimiento',
    definicion: 'Ofreces una destreza técnica: reparar, instalar, armar, mantener o dar servicio a equipos, instalaciones u objetos.',
    ejemplosTipo: 'Se define por el oficio que ya dominas o estás dispuesto a aprender.',
    capitalMin: 1, requiereLocal: false, requierePermiso: 'medio', escalable: false, ingresoRapido: true,
    senales: { manual: 3, reparacion: 3, soledad: 1, personas: 1, movilidad: 2, tecnologia: 1, servicio: 2 },
    competencia: 'Media. La calidad técnica y la garantía son el diferenciador.',
    margenTipo: 'Por trabajo, con materiales aparte. El margen depende de tu destreza.',
    riesgos: ['Necesitas herramientas: el capital inicial no es cero.', 'Si dañas algo, respondes por ello.', 'Requiere aprendizaje real; no se improvisa.'],
    aprender: ['El oficio a fondo, con práctica supervisada', 'Presupuestar materiales y mano de obra por separado', 'Dar garantía y cumplirla', 'Seguridad en el trabajo'],
    verificar: ['Si el oficio requiere certificación o licencia en tu país', 'Responsabilidad por daños y si necesitas seguro', 'Tratamiento de garantías y devoluciones']
  },
  {
    id: 'K3', emoji: '🛒', nombre: 'Comercio y reventa',
    definicion: 'Compras productos para revenderlos, con o sin punto de venta. El negocio está en elegir bien qué comprar y rotarlo rápido.',
    ejemplosTipo: 'Se define por lo que tu mercado local ya consume y no encuentra fácil.',
    capitalMin: 2, requiereLocal: false, requierePermiso: 'medio', escalable: true, ingresoRapido: true,
    senales: { venta: 3, personas: 2, producto: 3, organizacion: 2, movilidad: 2, dinero: 2, tecnologia: 1 },
    competencia: 'Alta. Casi siempre compites por precio, surtido o cercanía.',
    margenTipo: 'Margen por unidad, multiplicado por rotación. Rotación lenta mata el negocio.',
    riesgos: ['Capital inmovilizado en mercadería que puede no venderse.', 'Perecederos o moda: lo que no rota se pierde.', 'Requiere control de stock estricto desde el día uno.'],
    aprender: ['Calcular costo real incluyendo flete, merma e impuestos', 'Control de inventario y rotación', 'Negociar con proveedores', 'Fijar precios con criterio, no por imitación'],
    verificar: ['Requisitos de registro tributario y facturación', 'Permisos de venta si usas espacio público', 'Normas sanitarias si vendes alimentos o productos de salud', 'Aranceles si importas']
  },
  {
    id: 'K4', emoji: '🍲', nombre: 'Comida y bebida',
    definicion: 'Preparas y vendes alimentos o bebidas: al paso, por encargo, a domicilio o en eventos.',
    ejemplosTipo: 'Se define por lo que sabes preparar bien y lo que tu zona demanda.',
    capitalMin: 2, requiereLocal: false, requierePermiso: 'alto', escalable: true, ingresoRapido: true,
    senales: { alimento: 3, manual: 2, personas: 2, creatividad: 1, venta: 1, organizacion: 2 },
    competencia: 'Alta. Se compite por sabor, precio y constancia.',
    margenTipo: 'Margen por porción, muy sensible al desperdicio y al costo de insumos.',
    riesgos: ['Es la categoría con más requisitos sanitarios y de manipulación.', 'Perecederos: el desperdicio se come el margen.', 'Depende de proveedores estables de insumos.'],
    aprender: ['Manipulación higiénica de alimentos y cadena de frío', 'Costear una receta por porción', 'Controlar merma y desperdicio', 'Atención rápida en horas pico'],
    verificar: ['Permiso sanitario y carné de manipulación de alimentos', 'Permisos municipales para puesto fijo o móvil', 'Normas de etiquetado si vendes envasado', 'Requisitos tributarios del sector']
  },
  {
    id: 'K5', emoji: '💻', nombre: 'Servicios digitales y por internet',
    definicion: 'Trabajas con computadora o celular y entregas por internet: contenido, diseño, soporte, gestión, servicios remotos.',
    ejemplosTipo: 'Se define por la habilidad digital que ya tienes o puedes aprender en semanas.',
    capitalMin: 0, requiereLocal: false, requierePermiso: 'bajo', escalable: true, ingresoRapido: false,
    senales: { digital: 3, soledad: 2, creatividad: 2, tecnologia: 3, organizacion: 1, escritura: 2 },
    competencia: 'Muy alta y global. Contra herramientas automáticas se compite por criterio, trato y rapidez.',
    margenTipo: 'Por proyecto o por hora. Escala si empaquetas el servicio.',
    riesgos: ['Competencia con herramientas automáticas que abaratan el trabajo repetitivo.', 'Requiere aprender la herramienta antes de vender.', 'Los clientes remotos pueden tardar en pagar.'],
    aprender: ['La herramienta o plataforma a fondo', 'Empaquetar el servicio con precio claro', 'Cobrar a distancia de forma segura', 'Gestionar clientes y plazos por escrito'],
    verificar: ['Cómo facturar servicios a clientes de otro país', 'Tratamiento de datos de terceros que manejes', 'Derechos de autor del material que uses o crees', 'Medios de pago disponibles en tu país']
  },
  {
    id: 'K6', emoji: '🎓', nombre: 'Educación, formación y tutoría',
    definicion: 'Enseñas lo que sabes: clases, talleres, capacitación, acompañamiento en el aprendizaje.',
    ejemplosTipo: 'Se define por la materia o destreza que dominas mejor que tu entorno.',
    capitalMin: 0, requiereLocal: false, requierePermiso: 'bajo', escalable: true, ingresoRapido: true,
    senales: { ensenanza: 3, personas: 2, comunicacion: 2, organizacion: 2, soledad: 1, creatividad: 1 },
    competencia: 'Media. Se compite por resultados demostrables y constancia.',
    margenTipo: 'Por hora o por grupo. Un grupo rinde más que una clase individual.',
    riesgos: ['Requiere constancia: el alumno abandona si no ve avance.', 'Si enseñas a menores, aplican reglas de protección infantil.', 'El ingreso depende de horarios que chocan con tu otra actividad.'],
    aprender: ['Didáctica: explicar para que se entienda', 'Diseñar un programa con objetivos medibles', 'Evaluar el avance del alumno', 'Manejo de grupos y disciplina'],
    verificar: ['Si tu país exige título o registro para enseñar ciertas materias', 'Reglas de trabajo con menores de edad', 'Requisitos tributarios por servicios educativos', 'Uso de material con derechos de autor']
  },
  {
    id: 'K7', emoji: '🧑‍🍼', nombre: 'Cuidado y atención a personas',
    definicion: 'Cuidas o acompañas a personas que lo necesitan: niños, adultos mayores, personas enfermas o con discapacidad.',
    ejemplosTipo: 'Se define por la necesidad de cuidado que existe en tu entorno.',
    capitalMin: 0, requiereLocal: false, requierePermiso: 'alto', escalable: true, ingresoRapido: true,
    senales: { cuidado: 3, personas: 3, comunicacion: 2, organizacion: 1, ensenanza: 1, servicio: 3 },
    competencia: 'Media, muy basada en confianza y referencias.',
    margenTipo: 'Por hora o por jornada. Sube con especialización.',
    riesgos: ['Es la categoría con mayor responsabilidad sobre la integridad de otra persona.', 'Puede exigir certificación y antecedentes penales.', 'Desgaste emocional y físico real.'],
    aprender: ['Primeros auxilios y reanimación básica', 'Necesidades específicas según la persona cuidada', 'Comunicación con la familia del usuario', 'Poner límites y cuidar tu propia salud'],
    verificar: ['Certificación o curso obligatorio según tu país', 'Antecedentes penales y referencias verificables', 'Seguro de responsabilidad civil', 'Reglas de protección de datos de la persona cuidada']
  },
  {
    id: 'K8', emoji: '🚚', nombre: 'Logística, transporte y entregas',
    definicion: 'Mueves cosas o personas: entregas, mandados, transporte de carga ligera, apoyo logístico.',
    ejemplosTipo: 'Se define por la demanda de movimiento que hay en tu zona.',
    capitalMin: 2, requiereLocal: false, requierePermiso: 'alto', escalable: true, ingresoRapido: true,
    senales: { movilidad: 3, organizacion: 2, soledad: 2, manual: 1, personas: 1, reparacion: 1 },
    competencia: 'Alta en zonas urbanas; media en zonas rurales.',
    margenTipo: 'Por trayecto o por jornada. El combustible y el desgaste son el costo real.',
    riesgos: ['Requiere vehículo: el capital inicial es el más alto de la lista.', 'Regulación de tránsito, licencias y seguros obligatorios.', 'Riesgo de accidentes y de responsabilidad sobre la carga.'],
    aprender: ['Costear combustible, desgaste y mantenimiento por kilómetro', 'Optimizar rutas', 'Trato con clientes y manejo de reclamos', 'Mantenimiento preventivo del vehículo'],
    verificar: ['Licencia y categoría requerida para tu vehículo', 'Seguro obligatorio y cobertura de carga', 'Permisos de transporte si aplica regulación local', 'Límites de carga y horarios restringidos']
  },
  {
    id: 'K9', emoji: '🎨', nombre: 'Creatividad, eventos y entretenimiento',
    definicion: 'Produces o coordinas experiencias: diseño, música, fotografía, decoración, organización de eventos.',
    ejemplosTipo: 'Se define por tu estilo y por el tipo de celebraciones de tu zona.',
    capitalMin: 1, requiereLocal: false, requierePermiso: 'medio', escalable: true, ingresoRapido: false,
    senales: { creatividad: 3, eventos: 3, personas: 2, manual: 1, venta: 1, organizacion: 2, tecnologia: 1 },
    competencia: 'Alta y muy sensible al gusto del cliente.',
    margenTipo: 'Por proyecto. Muy variable según alcance y materiales.',
    riesgos: ['Demanda irregular: hay temporadas altas y meses muertos.', 'El cliente cambia de opinión y hay que rehacer trabajo.', 'Requiere equipo o materiales que se degradan con el uso.'],
    aprender: ['Técnica de tu disciplina', 'Presupuestar por proyecto con anticipo', 'Contratos simples y acuerdos por escrito', 'Portafolio y presentación de tu trabajo'],
    verificar: ['Permisos para eventos en espacio público o ruido', 'Derechos de autor y licencias de música o imágenes', 'Seguros si hay público o instalaciones', 'Requisitos tributarios por servicios eventuales']
  },
  {
    id: 'K10', emoji: '🏠', nombre: 'Hogar, jardín y mascotas',
    definicion: 'Das servicio al espacio donde vive la gente o a sus animales: limpieza, mantenimiento, jardinería, cuidado de mascotas.',
    ejemplosTipo: 'Se define por lo que las casas y familias de tu zona necesitan de forma recurrente.',
    capitalMin: 0, requiereLocal: false, requierePermiso: 'bajo', escalable: true, ingresoRapido: true,
    senales: { manual: 2, animales: 3, hogar: 3, personas: 1, movilidad: 2, servicio: 2, organizacion: 1 },
    competencia: 'Media. La recurrencia y la confianza son el activo.',
    margenTipo: 'Por servicio o por contrato periódico. La recurrencia estabiliza el ingreso.',
    riesgos: ['Trabajo físico y a veces estacional.', 'Entras a espacios privados: la confianza es indispensable.', 'Con animales, hay riesgo de mordedura o enfermedad.'],
    aprender: ['Técnica del servicio específico', 'Cobrar por contrato periódico en vez de por visita suelta', 'Manejo seguro de animales e insumos', 'Comunicación con el dueño del espacio'],
    verificar: ['Seguro o responsabilidad por daños en propiedad ajena', 'Normas sobre manejo de residuos e insumos químicos', 'Vacunación si trabajas con animales', 'Permisos si operas desde tu vivienda']
  }
];

/* --------------------------------------------------------------------------
   REGLAS DE AJUSTE POR PERFIL
   Explican POR QUÉ la categoría sube o baja para cada persona.
   -------------------------------------------------------------------------- */
export const REGLAS = {
  capitalInsuficiente: 'Tu capital disponible está por debajo de lo que esta categoría suele exigir al arrancar.',
  capitalSuficiente: 'Tu capital disponible alcanza para el arranque típico de esta categoría.',
  sinLocal: 'No tienes espacio físico y esta categoría normalmente lo requiere o lo facilita.',
  conLocal: 'Tienes espacio físico disponible, que esta categoría aprovecha.',
  sinVehiculo: 'Esta categoría suele necesitar vehículo y no marcaste que tengas uno.',
  conVehiculo: 'Tienes vehículo, que esta categoría aprovecha.',
  urgencia: 'Necesitas ingresos pronto y esta categoría tarda más en dar los primeros.',
  ingresoRapido: 'Esta categoría suele permitir ingresos desde las primeras semanas.',
  permisoAlto: 'Esta categoría tiene requisitos de permiso o certificación altos: verifícalos antes de invertir.',
  menorEdad: 'Eres menor de edad: necesitas un adulto responsable para contratos, permisos y obligaciones legales.',
  soloCelular: 'Solo tienes celular: las categorías que dependen de computadora te van a costar más.',
  dependientes: 'Tienes personas que dependen de ti: conviene priorizar categorías con ingreso rápido y riesgo bajo.',
  escalable: 'Esta categoría puede crecer sin que trabajes más horas tú mismo.',
  noEscalable: 'Esta categoría tiene techo: el ingreso depende de tus horas.'
};

/* --------------------------------------------------------------------------
   LOS 6 PILARES — lo que hay que resolver antes de invertir
   -------------------------------------------------------------------------- */
export const PILARES = [
  { n: 1, t: 'A quién le vas a vender', d: 'Personas concretas, no "a todos". Si no puedes nombrar diez clientes posibles, todavía no hay mercado.', estrella: true },
  { n: 2, t: 'Cuánto te cuesta y a cuánto lo vendes', d: 'Costo real (insumos, flete, merma, tu tiempo) contra precio de venta. Sin este número no hay negocio, hay ilusión.' },
  { n: 3, t: 'Qué permiso o registro necesitas', d: 'Varía por país, ciudad y actividad. Es lo primero que se verifica, no lo último.' },
  { n: 4, t: 'Cuánto necesitas invertir y cuánto puedes perder', d: 'Nunca destines al arranque todo el dinero que tienes. La reserva es lo que evita que el negocio muera tras el primer problema.' },
  { n: 5, t: 'Cómo vas a registrar lo que entra y sale', d: 'Fecha, qué, cuánto y saldo. La constancia diaria vale más que la herramienta que uses.' },
  { n: 6, t: 'Cómo sabrás si funcionó', d: 'Una meta medible y una fecha. Sin eso, la decisión de continuar o cambiar se toma por emoción.' }
];

export const NOTA_PILAR_1 = 'El pilar 1 es el que más se salta la gente. Casi nadie fracasa por falta de esfuerzo: fracasa por vender algo que nadie estaba buscando.';

/* --------------------------------------------------------------------------
   PLAN DE 90 DÍAS — genérico, sirve para cualquier categoría
   -------------------------------------------------------------------------- */
export const PLAN_90 = {
  etapas: [
    {
      id: 'entender', nombre: 'Entender', dias: '1–15', emoji: '🧠',
      objetivo: 'Definir el negocio en una página',
      entregable: 'Tu negocio definido en 1 página',
      tareas: [
        'Elegir una sola categoría y descartar las demás por 90 días',
        'Nombrar 10 clientes posibles concretos (personas o negocios reales)',
        'Escribir qué problema o necesidad les resuelves',
        'Investigar qué ofrece hoy la competencia en tu zona',
        'Definir en una frase qué te hace distinto',
        'Escribir tu meta medible a 90 días'
      ]
    },
    {
      id: 'verificar', nombre: 'Verificar', dias: '16–30', emoji: '🔍',
      objetivo: 'Confirmar requisitos, costos y precios reales',
      entregable: 'Requisitos claros + precios de 3 fuentes',
      tareas: [
        'Consultar qué permiso, registro o certificación exige tu actividad',
        'Consultar 3 fuentes distintas de precio o costo en tu zona',
        'Calcular la mediana de esos 3 datos',
        'Calcular tu costo real por unidad o servicio',
        'Calcular cuánto necesitas vender para recuperar la inversión',
        'Definir el presupuesto de arranque y la reserva que NO vas a tocar'
      ]
    },
    {
      id: 'probar', nombre: 'Probar', dias: '31–60', emoji: '🚀',
      objetivo: 'Vender a clientes reales y registrar todo',
      entregable: 'Registro diario con números reales',
      tareas: [
        'Conseguir tu primer cliente real',
        'Llegar a 5 clientes reales',
        'Llegar a 10 clientes reales',
        'Registrar cada movimiento el mismo día, sin saltarte ninguno',
        'Pedir a 3 clientes que te recomienden',
        'Ajustar el precio o el servicio según lo que observaste',
        'Revisar tu punto de equilibrio cada semana'
      ]
    },
    {
      id: 'decidir', nombre: 'Decidir', dias: '61–90', emoji: '🧭',
      objetivo: 'Evaluar con datos si continúas, ajustas o cambias',
      entregable: 'Una hoja con el resultado real',
      tareas: [
        'Sumar todos los ingresos de los 90 días',
        'Sumar todos los gastos de los 90 días',
        'Calcular el resultado real (ingresos menos gastos)',
        'Comparar con tu meta medible de la etapa Entender',
        'Escribir qué funcionó, qué no y por qué',
        'Decidir: continuar, ajustar o cambiar de categoría'
      ]
    }
  ],
  criterioHonesto: 'Si al día 90 no vendiste nada, el aprendizaje sigue siendo valioso. Cambia de enfoque con datos, no insistas por orgullo.'
};

/* --------------------------------------------------------------------------
   HERRAMIENTAS GRATUITAS — genéricas
   -------------------------------------------------------------------------- */
export const HERRAMIENTAS = {
  notaVigencia: 'Los planes gratuitos cambian con frecuencia. Verifica límites y condiciones actuales antes de depender de cualquiera de estas herramientas.',
  categorias: [
    { t: 'Para pensar y aprender', items: ['Asistente de IA como tutor: pídele que te explique a tu nivel', 'Khan Academy y YouTube para matemática financiera básica', 'Cursos gratuitos de tu oficio o disciplina'] },
    { t: 'Para llevar cuentas', items: ['Google Sheets o Excel en el celular', 'Una libreta física: sirve igual si eres constante', 'La libreta de esta app con exportación a CSV'] },
    { t: 'Para vender y comunicar', items: ['WhatsApp Business con catálogo y respuestas rápidas', 'Canva para piezas gráficas y catálogo', 'Redes sociales de tu zona o rubro'] },
    { t: 'Para organizarte', items: ['Google Drive para respaldar fotos y documentos', 'Calendario del celular para pedidos y entregas', 'Recordatorios para el registro diario'] }
  ],
  reglaIA: {
    titulo: 'Regla de uso de la IA',
    texto: 'La IA propone, no decide. Si le pides un precio, te dará un número plausible que puede no tener relación con tu ciudad. Sirve para entender el método; el precio real sale de consultar 3 fuentes locales.'
  }
};

/* --------------------------------------------------------------------------
   PRIVACIDAD
   -------------------------------------------------------------------------- */
export const PRIVACIDAD = {
  titulo: 'Tus datos se quedan en tu dispositivo',
  puntos: [
    'Esta app no tiene servidor propio, no usa analítica y no envía nada a internet.',
    'No se pide nombre, documento, dirección, teléfono ni correo.',
    'La localidad se pide por TAMAÑO y TIPO de zona, nunca por ubicación exacta.',
    'El género es opcional y solo se usa para ajustar la orientación; puedes elegir "prefiero no decirlo".',
    'Todo se guarda en el almacenamiento local de tu navegador y puedes borrarlo cuando quieras.'
  ]
};

export const DESCARGOS = [
  'Esta app entrega orientación general, no asesoría profesional.',
  'Los requisitos legales, tributarios y sanitarios varían por país, ciudad y actividad. Verifícalos en tu localidad.',
  'No se emiten precios, márgenes, costos ni proyecciones de ingreso: dependen de tu mercado y los debes levantar tú.',
  'Ninguna categoría sugerida es una recomendación de inversión.'
];
