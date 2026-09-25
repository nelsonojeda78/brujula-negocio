/* ==========================================================================
   Brújula de Negocio — lógica
   Test general de orientación emprendedora. Sin datos personales.
   Todo se guarda SOLO en localStorage del dispositivo.
   ========================================================================== */
import * as D from './data.js';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const usd = n => '$' + (Number(n) || 0).toFixed(2);
const hoy = () => new Date().toISOString().slice(0, 10);
const fmtFecha = f => { try { return new Date(f + 'T12:00:00').toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' }); } catch { return f; } };
const plural = (n, s, p) => n === 1 ? s : p;

/* ---------------- estado ---------------- */
const KEY = 'brujula_v1';
const vacio = () => ({
  perfil: { edad: null, genero: null, localidad: null, capital: null, tiempo: null,
            afinidades: [], habilidades: [], intereses: [], condiciones: [] },
  completo: false,
  resultado: null,
  elegida: null,
  cuentas: { que: '', quien: '', costo: '', precio: '', inversion: '', meta: '' },
  fuentes: {},
  plan: {},
  libreta: []
});
let S = cargar();
function cargar() {
  try { const r = localStorage.getItem(KEY); return r ? Object.assign(vacio(), JSON.parse(r)) : vacio(); }
  catch { return vacio(); }
}
function guardar() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); }
  catch { toast('No se pudo guardar. Revisa el espacio del dispositivo.'); }
}

/* ---------------- navegación ---------------- */
function go(v) {
  $$('.view').forEach(e => e.classList.toggle('active', e.id === 'view-' + v));
  $$('.tab').forEach(t => t.classList.toggle('active', t.dataset.go === v));
  window.scrollTo({ top: 0, behavior: 'instant' });
  ({
    inicio: rInicio, perfil: rPerfil, resultado: rResultado, categorias: rCategorias,
    detalle: rDetalle, cuentas: rCuentas, precios: rPrecios, plan90: rPlan90,
    libreta: rLibreta, pilares: rPilares, privacidad: rPrivacidad
  })[v]?.();
  history.replaceState(null, '', '#' + v);
}
document.addEventListener('click', e => {
  const t = e.target.closest('[data-go]');
  if (t) { e.preventDefault(); go(t.dataset.go); }
});

function toast(msg) {
  const b = document.createElement('div');
  b.className = 'aviso info';
  b.style.cssText = 'position:fixed;bottom:calc(96px + var(--safe-b));left:50%;transform:translateX(-50%);z-index:300;max-width:90vw;box-shadow:var(--sh)';
  b.innerHTML = `<span class="aviso-i">ℹ️</span><div>${esc(msg)}</div>`;
  document.body.appendChild(b);
  setTimeout(() => b.remove(), 3400);
}
function modal({ titulo, cuerpo, acciones }) {
  const root = $('#modal-root');
  root.innerHTML = `<div class="modal-bg"><div class="modal"><h3>${titulo}</h3><div>${cuerpo}</div>
    <div class="modal-acts">${acciones.map(a => `<button class="btn ${a.cls || 'btn-ghost'}" data-mact="${a.id}">${a.txt}</button>`).join('')}</div></div></div>`;
  const cerrar = () => (root.innerHTML = '');
  root.querySelector('.modal-bg').addEventListener('click', e => { if (e.target.classList.contains('modal-bg')) cerrar(); });
  acciones.forEach(a => root.querySelector(`[data-mact="${a.id}"]`)?.addEventListener('click', () => { cerrar(); a.fn?.(); }));
}

/* ==========================================================================
   MOTOR DE AFINIDAD
   Cruza el perfil declarado con las señales de cada categoría y aplica
   reglas explícitas de edad, capital, localidad, tiempo y condiciones.
   Devuelve ranking con el MOTIVO de cada ajuste (trazabilidad).
   ========================================================================== */
function calcularResultado() {
  const P = S.perfil;
  const eje = {};
  const sumar = (arr, peso = 1) => (arr || []).forEach(id => {
    const f = [...D.AFINIDADES, ...D.HABILIDADES_PERFIL, ...D.INTERESES, ...D.CONDICIONES].find(x => x.id === id);
    if (f?.eje) eje[f.eje] = (eje[f.eje] || 0) + peso;
  });
  sumar(P.afinidades, 3);
  sumar(P.habilidades, 2.5);
  sumar(P.intereses, 2);
  sumar(P.condiciones, 1.5);

  const capNivel = D.CAPITALES.find(c => c.id === P.capital)?.v ?? 0;
  const tiempoNivel = D.TIEMPOS.find(t => t.id === P.tiempo)?.v ?? 1;
  const edadObj = D.EDADES.find(e => e.id === P.edad);
  const localidad = D.LOCALIDADES.find(l => l.id === P.localidad);
  const esMenor = !!edadObj?.menor;
  const tieneLocal = P.condiciones.includes('k1');
  const tieneVehiculo = P.condiciones.includes('k2');
  const soloCelular = P.condiciones.includes('k4');
  const urgencia = P.condiciones.includes('k5');
  const dependientes = P.condiciones.includes('k7');
  const localidadPequena = ['l3', 'l4'].includes(P.localidad);
  const frontera = P.localidad === 'l5';

  /* Normalización: el puntaje base mide qué proporción de los ejes que la
     categoría valora están presentes en el perfil, ponderada por el peso de
     cada eje. Se compara contra el MEJOR caso posible de esa misma categoría
     dado el perfil disponible, no contra un techo absoluto inalcanzable. */
  const ejesPerfil = Object.keys(eje).filter(k => eje[k] > 0);
  const maxEje = Math.max(1, ...Object.values(eje));

  const ranking = D.CATEGORIAS.map(cat => {
    let bruto = 0, ideal = 0;
    Object.entries(cat.senales).forEach(([k, peso]) => {
      const tiene = (eje[k] || 0) > 0;
      // Ideal: la categoría valora este eje y el perfil lo tiene.
      // Si el perfil no lo tiene, el ideal no lo cuenta (no se penaliza dos veces).
      if (tiene) ideal += peso * maxEje;
      bruto += (eje[k] || 0) * peso;
    });
    // Cobertura: cuántos ejes que la categoría pide están presentes.
    const pedidos = Object.keys(cat.senales).length;
    const cubiertos = Object.keys(cat.senales).filter(k => (eje[k] || 0) > 0).length;
    const cobertura = pedidos ? cubiertos / pedidos : 0;

    // Base = 60% intensidad relativa + 40% cobertura de los ejes pedidos.
    const intensidad = ideal > 0 ? bruto / ideal : 0;
    let pct = (intensidad * 0.6 + cobertura * 0.4) * 100;
    const motivos = [];

    // --- Capital ---
    if (capNivel < cat.capitalMin) {
      pct -= 16; motivos.push({ t: 'menos', txt: D.REGLAS.capitalInsuficiente });
    } else if (capNivel > cat.capitalMin) {
      pct += 5; motivos.push({ t: 'mas', txt: D.REGLAS.capitalSuficiente });
    }

    // --- Espacio físico ---
    if (cat.requiereLocal && !tieneLocal) { pct -= 10; motivos.push({ t: 'menos', txt: D.REGLAS.sinLocal }); }
    if (tieneLocal) { pct += 4; motivos.push({ t: 'mas', txt: D.REGLAS.conLocal }); }

    // --- Vehículo ---
    if (cat.id === 'K8') {
      if (!tieneVehiculo) { pct -= 20; motivos.push({ t: 'menos', txt: D.REGLAS.sinVehiculo }); }
      else { pct += 10; motivos.push({ t: 'mas', txt: D.REGLAS.conVehiculo }); }
    }

    // --- Urgencia de ingresos ---
    if (urgencia && !cat.ingresoRapido) { pct -= 14; motivos.push({ t: 'menos', txt: D.REGLAS.urgencia }); }
    if (urgencia && cat.ingresoRapido) { pct += 6; motivos.push({ t: 'mas', txt: D.REGLAS.ingresoRapido }); }

    // --- Carga regulatoria ---
    if (cat.requierePermiso === 'alto') {
      pct -= 8;
      motivos.push({ t: 'alerta', txt: D.REGLAS.permisoAlto });
    }

    // --- Menor de edad ---
    if (esMenor) {
      if (['K7', 'K8', 'K4'].includes(cat.id)) { pct -= 18; }
      else { pct -= 4; }
      motivos.push({ t: 'alerta', txt: D.REGLAS.menorEdad });
    }

    // --- Solo celular ---
    if (soloCelular && ['K5'].includes(cat.id)) { pct -= 10; motivos.push({ t: 'menos', txt: D.REGLAS.soloCelular }); }

    // --- Dependientes ---
    if (dependientes) {
      if (cat.ingresoRapido && cat.capitalMin <= 1) pct += 4;
      else if (!cat.ingresoRapido) pct -= 6;
      motivos.push({ t: 'alerta', txt: D.REGLAS.dependientes });
    }

    // --- Escalabilidad vs tiempo disponible ---
    if (tiempoNivel <= 1 && cat.escalable) { pct += 3; }
    if (tiempoNivel >= 3 && cat.escalable) { pct += 3; motivos.push({ t: 'mas', txt: D.REGLAS.escalable }); }
    if (tiempoNivel <= 1 && !cat.escalable) { pct -= 5; motivos.push({ t: 'menos', txt: D.REGLAS.noEscalable }); }

    // --- Localidad ---
    if (localidadPequena) {
      if (cat.escalable) { pct += 6; motivos.push({ t: 'mas', txt: 'Tu zona es pequeña: conviene una categoría que pueda vender también fuera de tu localidad.' }); }
      else { pct -= 3; }
    }
    if (frontera) {
      motivos.push({ t: 'alerta', txt: 'Zona fronteriza o de paso: el flujo de personas puede cortarse sin aviso. No dependas solo de él.' });
    }
    if (P.localidad === 'l1' && !cat.escalable) {
      motivos.push({ t: 'alerta', txt: 'En ciudades grandes la competencia es alta: las categorías que dependen solo de tus horas sufren más.' });
    }

    return {
      cat, pct: Math.max(0, Math.min(100, Math.round(pct))),
      motivos,
      aptoMenor: !esMenor || !['K7', 'K8', 'K4'].includes(cat.id)
    };
  }).sort((a, b) => b.pct - a.pct);

  return {
    ranking,
    eje,
    perfil: {
      esMenor, capNivel, tiempoNivel,
      edad: edadObj, localidad,
      tieneLocal, tieneVehiculo, soloCelular, urgencia, dependientes, localidadPequena, frontera
    },
    fecha: new Date().toISOString()
  };
}

/* ==========================================================================
   PERFIL — captura por pasos, sin datos personales
   ========================================================================== */
const PASOS = [
  { id: 'p-edad', t: '¿En qué rango de edad estás?', ayuda: 'No pedimos tu fecha de nacimiento ni ningún dato que te identifique.' },
  { id: 'p-localidad', t: '¿Cómo es la zona donde vas a vender?', ayuda: 'Se pregunta por tamaño y tipo, no por tu dirección.' },
  { id: 'p-genero', t: '¿Con qué género te identificas?', ayuda: 'Es opcional. Solo se usa para ajustar la orientación.', opcional: true },
  { id: 'p-capital', t: '¿Cuánto dinero puedes destinar al arranque?', ayuda: 'Cantidad que estás dispuesto a perder si no funciona.' },
  { id: 'p-tiempo', t: '¿Cuánto tiempo real le puedes dedicar por semana?', ayuda: 'Cuenta tu trabajo, estudios y obligaciones antes de responder.' },
  { id: 'p-afinidades', t: '¿Qué tipo de trabajo disfrutas o toleras bien?', ayuda: 'Marca todo lo que aplique. Esto pesa más que lo que te gustaría hacer.', multi: true },
  { id: 'p-habilidades', t: '¿Qué ya sabes hacer?', ayuda: 'Sé honesto: lo que no sabes se aprende, pero hay que saberlo antes de invertir.', multi: true },
  { id: 'p-intereses', t: '¿Qué temas te importan o te dan curiosidad?', ayuda: 'Marca los que te mantendrían interesado en el tema por meses.', multi: true },
  { id: 'p-condiciones', t: '¿Con qué cuentas hoy?', ayuda: 'Marca solo lo que tienes ahora, no lo que podrías conseguir.', multi: true }
];

function rPerfil() {
  const P = S.perfil;
  const listo = PASOS.filter(p => p.opcional || (p.multi ? P[p.id.replace('p-', '')]?.length : P[p.id.replace('p-', '')])).length;
  $('#perfil-progress').style.width = (listo / PASOS.length * 100) + '%';
  $('#perfil-progress-label').textContent = `${listo} / ${PASOS.length}`;

  const body = $('#perfil-body');
  body.innerHTML = PASOS.map(p => {
    const campo = p.id.replace('p-', '');
    const val = P[campo];
    let inner = '';

    if (p.multi) {
      const fuente = campo === 'afinidades' ? D.AFINIDADES : campo === 'habilidades' ? D.HABILIDADES_PERFIL
                   : campo === 'intereses' ? D.INTERESES : D.CONDICIONES;
      const sel = val || [];
      inner = `<div class="chips">${fuente.map(o => `
        <button class="chip-sel${sel.includes(o.id) ? ' on' : ''}" data-multi="${campo}" data-id="${o.id}">
          <span class="chip-check">${sel.includes(o.id) ? '✓' : '+'}</span>${esc(o.n)}
        </button>`).join('')}</div>
        <div class="txt-dim" style="font-size:12.5px;margin-top:9px">${sel.length} seleccionada${sel.length === 1 ? '' : 's'}</div>`;
    } else if (campo === 'genero') {
      inner = `<div class="opts">${D.GENEROS.map(o => `
        <button class="opt${val === o.id ? ' sel' : ''}" data-single="genero" data-id="${o.id}">
          <span class="opt-tx">${esc(o.n)}</span></button>`).join('')}</div>`;
    } else {
      const fuente = campo === 'edad' ? D.EDADES : campo === 'localidad' ? D.LOCALIDADES
                   : campo === 'capital' ? D.CAPITALES : D.TIEMPOS;
      inner = `<div class="opts">${fuente.map(o => `
        <button class="opt${val === o.id ? ' sel' : ''}" data-single="${campo}" data-id="${o.id}">
          <span class="opt-tx">${esc(o.n)}${o.nota ? `<span class="opt-sub">${esc(o.nota)}</span>` : ''}</span>
        </button>`).join('')}</div>`;
    }

    const completo = p.opcional || (p.multi ? (val || []).length : val);
    return `<div class="card${completo ? ' card-ok' : ''}">
      <div class="row" style="justify-content:space-between;align-items:flex-start;margin-bottom:5px">
        <h2 style="font-size:16.5px;font-weight:750;letter-spacing:-.3px">${esc(p.t)}</h2>
        ${completo ? '<span class="badge b-ok">✓</span>' : p.opcional ? '<span class="badge b-dim">Opcional</span>' : ''}
      </div>
      <p class="txt-dim" style="font-size:13px;margin-bottom:14px">${esc(p.ayuda)}</p>
      ${inner}
    </div>`;
  }).join('') + `
    <div class="card card-acc">
      <div class="card-head"><h2>Listo para ver tu resultado</h2></div>
      <p class="txt-dim mb">Se evaluarán las ${D.CATEGORIAS.length} categorías generales de negocio según tu perfil.</p>
      <button class="btn btn-primary btn-lg" id="ver-resultado">Ver mi orientación →</button>
      <button class="btn btn-ghost btn-sm mt" id="limpiar-perfil">Borrar y empezar de nuevo</button>
    </div>`;

  $$('[data-single]', body).forEach(b => b.onclick = () => {
    S.perfil[b.dataset.single] = b.dataset.id; guardar(); rPerfil();
  });
  $$('[data-multi]', body).forEach(b => b.onclick = () => {
    const campo = b.dataset.multi, id = b.dataset.id;
    const arr = S.perfil[campo] || [];
    S.perfil[campo] = arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id];
    guardar(); rPerfil();
  });
  $('#ver-resultado').onclick = () => {
    const faltan = PASOS.filter(p => !p.opcional && !(p.multi ? (S.perfil[p.id.replace('p-', '')] || []).length : S.perfil[p.id.replace('p-', '')]));
    if (faltan.length) return toast(`Te faltan ${faltan.length} ${plural(faltan.length, 'respuesta', 'respuestas')}.`);
    S.completo = true; S.resultado = calcularResultado(); guardar(); go('resultado');
  };
  $('#limpiar-perfil').onclick = () => modal({
    titulo: '¿Borrar el perfil?',
    cuerpo: '<p>Se borrarán tus respuestas del test. Tu plan y tu libreta se conservan.</p>',
    acciones: [{ id: 'no', txt: 'Cancelar' },
      { id: 'si', txt: 'Borrar', cls: 'btn-danger', fn: () => { S.perfil = vacio().perfil; S.completo = false; S.resultado = null; guardar(); rPerfil(); } }]
  });
}

/* ==========================================================================
   RESULTADO
   ========================================================================== */
function rResultado() {
  const R = S.resultado || calcularResultado();
  const body = $('#resultado-body');
  if (!R) { body.innerHTML = '<div class="empty">Primero completa tu perfil.</div>'; return; }
  const [top, ...resto] = R.ranking;
  const pf = R.perfil;

  const ejeNombres = { personas: 'Trato con personas', soledad: 'Trabajo en solitario', manual: 'Trabajo manual',
    digital: 'Digital', alimento: 'Alimentos', venta: 'Ventas', organizacion: 'Organización',
    ensenanza: 'Enseñanza', cuidado: 'Cuidado de otros', creatividad: 'Creatividad', movilidad: 'Movilidad',
    reparacion: 'Reparación', finanzas: 'Finanzas', comunicacion: 'Comunicación', escritura: 'Escritura',
    deporte: 'Deporte', belleza: 'Belleza', hogar: 'Hogar', animales: 'Animales', eventos: 'Eventos',
    espacio: 'Espacio físico', equipoDigital: 'Equipo digital', soloCelular: 'Solo celular',
    urgencia: 'Urgencia de ingreso', paciencia: 'Puede esperar', dependientes: 'Dependientes', mentor: 'Apoyo de alguien con experiencia' };

  const topEjes = Object.entries(R.eje).sort((a, b) => b[1] - a[1]).slice(0, 6);

  body.innerHTML = `
    <div class="res-hero">
      <div class="res-emoji">${top.cat.emoji}</div>
      <div class="res-rank">Tu mejor encaje</div>
      <div class="res-name">${esc(top.cat.nombre)}</div>
      <p class="txt-dim" style="max-width:470px;margin:0 auto">${esc(top.cat.definicion)}</p>
      <div class="res-score"><span class="badge b-ok">${top.pct}% de afinidad</span></div>
    </div>

    <div class="aviso info">
      <span class="aviso-i">🧭</span>
      <div><b>Esto es una categoría, no una idea de negocio.</b> ${esc(top.cat.ejemplosTipo)} Tu tarea es aterrizarla en tu zona: qué vendes exactamente, a quién y a qué precio.</div>
    </div>

    ${pf.esMenor ? `<div class="aviso warn"><span class="aviso-i">⚠️</span>
      <div><b>Eres menor de edad.</b> ${esc(D.REGLAS.menorEdad)} Un adulto responsable debe acompañar la parte legal y contractual.</div></div>` : ''}

    ${pf.urgencia ? `<div class="aviso warn"><span class="aviso-i">⏱️</span>
      <div><b>Necesitas ingresos pronto.</b> Prioriza las categorías marcadas como de ingreso rápido y evita las que tardan meses en dar el primero.</div></div>` : ''}

    ${pf.dependientes ? `<div class="aviso warn"><span class="aviso-i">👨‍👩‍👧</span>
      <div><b>Tienes personas que dependen de ti.</b> Conviene empezar con riesgo bajo y capital pequeño antes de comprometer dinero que necesitas.</div></div>` : ''}

    <div class="card card-acc">
      <div class="card-head"><h2>Por qué te salió esta</h2></div>
      ${top.motivos.length ? `<ul class="plist">${top.motivos.map(m => `
        <li><span class="pmark ${m.t === 'menos' ? 'c' : m.t === 'alerta' ? 'w' : 'p'}">${m.t === 'menos' ? '−' : m.t === 'alerta' ? '!' : '+'}</span>
        <span>${esc(m.txt)}</span></li>`).join('')}</ul>` : '<p class="txt-dim">Coincide con las afinidades, habilidades e intereses que marcaste.</p>'}
      <div class="sep"></div>
      <p class="txt-dim mb"><b style="color:var(--txt)">Competencia:</b> ${esc(top.cat.competencia)}</p>
      <p class="txt-dim mb"><b style="color:var(--txt)">Cómo se gana dinero:</b> ${esc(top.cat.margenTipo)}</p>
      <p class="txt-dim" style="margin-bottom:0"><b style="color:var(--txt)">Requisitos de permiso:</b>
        <span class="badge ${top.cat.requierePermiso === 'alto' ? 'b-bad' : top.cat.requierePermiso === 'medio' ? 'b-warn' : 'b-ok'}">${top.cat.requierePermiso}</span></p>
    </div>

    <div class="card">
      <div class="card-head"><h2>Tu perfil emprendedor</h2></div>
      <p class="txt-dim mb">Según lo que marcaste, estos son tus ejes más fuertes:</p>
      ${topEjes.map(([k, v]) => {
        const pct = Math.min(100, Math.round(v / (topEjes[0][1] || 1) * 100));
        return `<div class="bar-row">
          <div class="bar-lbl"><b>${esc(ejeNombres[k] || k)}</b><span>${pct}%</span></div>
          <div class="bar-bg"><div class="bar-fill${pct > 66 ? ' g' : ''}" style="width:${pct}%"></div></div>
        </div>`;
      }).join('')}
    </div>

    <div class="card">
      <div class="card-head"><h2>Ranking completo</h2></div>
      <p class="txt-dim mb">Toca cualquiera para ver la guía completa de esa categoría.</p>
      ${[top, ...resto].map((x, i) => `
        <div class="rank-item${i === 0 ? ' top' : ''}${x.aptoMenor ? '' : ' blocked'}" data-cat="${x.cat.id}">
          <span class="rank-pos">${i + 1}</span>
          <span class="rank-emoji">${x.cat.emoji}</span>
          <span class="rank-tx">
            <span class="rank-nm">${esc(x.cat.nombre)}</span>
            <span class="rank-meta">
              ${x.cat.requiereLocal ? 'Requiere local' : 'Sin local'} ·
              permiso ${esc(x.cat.requierePermiso)} ·
              ${x.cat.ingresoRapido ? 'ingreso rápido' : 'tarda en dar ingreso'}
              ${x.aptoMenor ? '' : ' · <b style="color:var(--bad)">no apta para menores</b>'}
            </span>
          </span>
          <span class="rank-pct">${x.pct}%</span>
        </div>`).join('')}
    </div>

    <div class="card card-ok">
      <div class="card-head"><h2>¿Y ahora qué?</h2></div>
      <p class="txt-dim mb">Elige <b>una sola</b> categoría para los próximos 90 días. La dispersión en varias ideas a la vez es la causa más común de no arrancar nunca.</p>
      <div class="row">
        <button class="btn btn-primary" data-elegir="${top.cat.id}">Elegir esta y empezar →</button>
        <button class="btn btn-ghost" data-go="categorias">Ver todas las categorías</button>
      </div>
    </div>`;

  $$('[data-cat]', body).forEach(e => e.onclick = () => verDetalle(e.dataset.cat));
  $$('[data-elegir]', body).forEach(e => e.onclick = () => elegir(e.dataset.elegir));
}

function elegir(id) {
  const c = D.CATEGORIAS.find(x => x.id === id);
  S.elegida = id; guardar();
  modal({
    titulo: `¿Elegir "${esc(c.nombre)}"?`,
    cuerpo: `<p>Vas a enfocarte en <b>una sola categoría durante 90 días</b>.</p>
             <p class="txt-dim">Puedes cambiarla cuando quieras desde el inicio. Tu plan y tu libreta se conservan.</p>`,
    acciones: [{ id: 'no', txt: 'Todavía no' },
      { id: 'si', txt: 'Sí, elegir', cls: 'btn-primary', fn: () => { toast('¡Elegida! Sigue los pasos.'); go('detalle'); } }]
  });
}

/* ==========================================================================
   CATEGORÍAS
   ========================================================================== */
function rCategorias() {
  $('#cat-nota').innerHTML = `
    <div class="aviso warn"><span class="aviso-i">⚠️</span>
      <div><b>Estas son categorías generales, no ideas concretas.</b> Cada una describe un <i>tipo</i> de negocio con sus requisitos típicos. Aterrizarla en tu zona es tu trabajo, y la app te guía para hacerlo.</div></div>`;
  $('#cat-list').innerHTML = D.CATEGORIAS.map(c => `
    <div class="card" style="cursor:pointer" data-cat="${c.id}">
      <div class="row" style="gap:13px;align-items:flex-start">
        <span style="font-size:30px">${c.emoji}</span>
        <div style="flex:1;min-width:0">
          <div style="font-weight:750;font-size:16px;letter-spacing:-.3px">${esc(c.nombre)}</div>
          <div class="txt-dim" style="margin-top:4px">${esc(c.definicion)}</div>
        </div>
      </div>
      <div class="row mt" style="gap:7px">
        <span class="badge ${c.requierePermiso === 'alto' ? 'b-bad' : c.requierePermiso === 'medio' ? 'b-warn' : 'b-ok'}">Permiso ${esc(c.requierePermiso)}</span>
        <span class="badge ${c.requiereLocal ? 'b-warn' : 'b-dim'}">${c.requiereLocal ? 'Requiere local' : 'Sin local'}</span>
        <span class="badge ${c.ingresoRapido ? 'b-ok' : 'b-dim'}">${c.ingresoRapido ? 'Ingreso rápido' : 'Tarda en dar ingreso'}</span>
        <span class="badge b-dim">${c.escalable ? 'Puede crecer' : 'Techo por horas'}</span>
        ${S.elegida === c.id ? '<span class="badge b-ok">✓ Tu elección</span>' : ''}
      </div>
    </div>`).join('');
  $$('[data-cat]', $('#cat-list')).forEach(e => e.onclick = () => verDetalle(e.dataset.cat));
}

function verDetalle(id) { S._detalle = id; go('detalle'); }

function rDetalle() {
  const c = D.CATEGORIAS.find(x => x.id === S._detalle) || D.CATEGORIAS.find(x => x.id === S.elegida);
  const body = $('#detalle-body');
  if (!c) { body.innerHTML = '<div class="empty">Elige una categoría primero.</div>'; return; }
  const R = S.resultado || calcularResultado();
  const enRanking = R.ranking.find(r => r.cat.id === c.id);
  const esElegida = S.elegida === c.id;
  const capTxt = ['Casi nada (menos de 100 USD)', 'Poco (100 a 500 USD)', 'Moderado (500 a 2 000 USD)', 'Amplio (más de 2 000 USD)'][c.capitalMin];

  body.innerHTML = `
    <div class="page-head">
      <button class="btn-back" data-go="categorias">←</button>
      <div style="flex:1">
        <h1>${c.emoji} ${esc(c.nombre)}</h1>
        <div class="row" style="gap:7px;margin-top:7px">
          <span class="badge ${c.requierePermiso === 'alto' ? 'b-bad' : c.requierePermiso === 'medio' ? 'b-warn' : 'b-ok'}">Permiso ${esc(c.requierePermiso)}</span>
          <span class="badge ${c.requiereLocal ? 'b-warn' : 'b-dim'}">${c.requiereLocal ? 'Requiere local' : 'Sin local'}</span>
          ${enRanking ? `<span class="badge b-acc">${enRanking.pct}% contigo</span>` : ''}
        </div>
      </div>
    </div>

    <div class="card card-acc">
      <p class="txt-dim mb">${esc(c.definicion)}</p>
      <div class="aviso info" style="margin-bottom:0"><span class="aviso-i">💡</span>
        <div><b>Cómo se aterriza:</b> ${esc(c.ejemplosTipo)}</div></div>
    </div>

    ${!esElegida ? `<button class="btn btn-primary btn-lg mb" data-elegir="${c.id}">Elegir esta categoría →</button>`
      : `<div class="aviso ok"><span class="aviso-i">✅</span><div><b>Esta es tu categoría elegida.</b> Sigue el plan de 90 días.</div></div>`}

    ${enRanking && enRanking.motivos.length ? `
    <div class="card">
      <div class="card-head"><h2>Ajustes según tu perfil</h2></div>
      <ul class="plist">${enRanking.motivos.map(m => `
        <li><span class="pmark ${m.t === 'menos' ? 'c' : m.t === 'alerta' ? 'w' : 'p'}">${m.t === 'menos' ? '−' : m.t === 'alerta' ? '!' : '+'}</span>
        <span>${esc(m.txt)}</span></li>`).join('')}</ul>
    </div>` : ''}

    <div class="card">
      <div class="card-head"><h2>Requisitos de arranque</h2></div>
      <div class="metrics">
        <div class="metric acc"><div class="metric-v">${esc(capTxt.split('(')[0].trim())}</div><div class="metric-l">Capital típico</div></div>
        <div class="metric ${c.requiereLocal ? 'warn' : 'ok'}"><div class="metric-v">${c.requiereLocal ? 'Sí' : 'No'}</div><div class="metric-l">Requiere local</div></div>
        <div class="metric ${c.requierePermiso === 'alto' ? 'bad' : c.requierePermiso === 'medio' ? 'warn' : 'ok'}">
          <div class="metric-v" style="font-size:17px;text-transform:capitalize">${esc(c.requierePermiso)}</div><div class="metric-l">Carga de permisos</div></div>
        <div class="metric ${c.escalable ? 'ok' : 'warn'}"><div class="metric-v" style="font-size:17px">${c.escalable ? 'Sí' : 'Limitado'}</div><div class="metric-l">Puede crecer</div></div>
      </div>
      <p class="txt-dim"><b style="color:var(--txt)">Cómo se gana dinero:</b> ${esc(c.margenTipo)}</p>
      <p class="txt-dim mt" style="margin-bottom:0"><b style="color:var(--txt)">Competencia:</b> ${esc(c.competencia)}</p>
    </div>

    <div class="card">
      <div class="card-head"><h2>⛔ Riesgos propios de esta categoría</h2></div>
      <ul class="plist">${c.riesgos.map(r => `<li><span class="pmark c">✕</span><span>${esc(r)}</span></li>`).join('')}</ul>
    </div>

    <div class="card">
      <div class="card-head"><h2>🧠 Lo que necesitas aprender</h2></div>
      ${c.aprender.map(a => `<div class="step"><div class="step-d" style="font-size:14.3px;color:var(--txt)">${esc(a)}</div></div>`).join('')}
    </div>

    <div class="card card-warn">
      <div class="card-head"><h2>📋 Lo que debes verificar antes de invertir</h2></div>
      <p class="txt-dim mb">Estos puntos varían por país, ciudad y actividad. <b>Confírmalos en tu localidad</b>; esta app no los certifica.</p>
      <ul class="plist">${c.verificar.map(v => `<li><span class="pmark w">!</span><span>${esc(v)}</span></li>`).join('')}</ul>
    </div>

    <div class="card">
      <div class="card-head"><h2>🗺️ Cómo aterrizarlo en tu zona</h2></div>
      <div class="step"><div class="step-t">1. Nombra 10 clientes posibles</div><div class="step-d">Personas o negocios reales que podrías atender esta semana. Si no llegas a 10, el mercado es más pequeño de lo que crees.</div></div>
      <div class="step"><div class="step-t">2. Observa qué se ofrece hoy</div><div class="step-d">Quién ya hace algo parecido, a qué precio y con qué calidad. Anótalo sin juzgar.</div></div>
      <div class="step"><div class="step-t">3. Define tu versión concreta</div><div class="step-d">Qué entregas exactamente, en cuánto tiempo y con qué te diferencias. Una frase que puedas decir en voz alta.</div></div>
      <div class="step"><div class="step-t">4. Levanta 3 precios reales</div><div class="step-d">Consulta 3 fuentes distintas y calcula la mediana. Ese es tu punto de partida, no un precio inventado.</div></div>
      <div class="step"><div class="step-t">5. Calcula tu punto de equilibrio</div><div class="step-d">Cuántas unidades o servicios necesitas para recuperar lo invertido. Si no puedes ponerle un número, todavía no compres nada.</div></div>
      <button class="btn btn-ghost btn-sm mt" data-go="cuentas">Abrir la calculadora →</button>
      <button class="btn btn-ghost btn-sm mt" data-go="precios">Abrir el comparador de 3 precios →</button>
    </div>`;

  $$('[data-elegir]', body).forEach(e => e.onclick = () => elegir(e.dataset.elegir));
}

/* ==========================================================================
   CUENTAS — los 6 pilares en números
   ========================================================================== */
function rCuentas() {
  const c = S.cuentas;
  const costo = parseFloat(c.costo) || 0, precio = parseFloat(c.precio) || 0, inv = parseFloat(c.inversion) || 0;
  const ganancia = precio - costo;
  const margen = precio > 0 ? (ganancia / precio) * 100 : 0;
  const eq = ganancia > 0 ? Math.ceil(inv / ganancia) : null;
  const listo = eq !== null && eq > 0;

  $('#cuentas-body').innerHTML = `
    <div class="aviso info"><span class="aviso-i">🧮</span>
      <div>Estos son los pilares 2, 4 y 6. Si no puedes llenar el punto de equilibrio con un número, todavía no estás listo para invertir.</div></div>

    <div class="card">
      <div class="card-head"><h2>Pilar 1 · ¿Qué vendes y a quién?</h2></div>
      <div class="field">
        <label>¿Qué vendes exactamente? <span class="hint">Concreto, en una frase</span></label>
        <input class="inp" id="c-que" placeholder="Ej: servicio de limpieza profunda de casas" value="${esc(c.que)}">
      </div>
      <div class="field" style="margin-bottom:0">
        <label>¿A quién se lo vendes? <span class="hint">Personas concretas, no "a todos"</span></label>
        <input class="inp" id="c-quien" placeholder="Ej: familias con casa propia en mi barrio" value="${esc(c.quien)}">
      </div>
    </div>

    <div class="card">
      <div class="card-head"><h2>Pilar 2 · Costo, precio y ganancia</h2></div>
      <div class="grid2">
        <div class="field">
          <label>¿Cuánto te cuesta? <span class="hint">Por unidad o servicio, incluyendo insumos y flete</span></label>
          <input class="inp" id="c-costo" type="number" inputmode="decimal" step="0.01" min="0" placeholder="0.00" value="${esc(c.costo)}">
        </div>
        <div class="field">
          <label>¿A cuánto lo vendes?</label>
          <input class="inp" id="c-precio" type="number" inputmode="decimal" step="0.01" min="0" placeholder="0.00" value="${esc(c.precio)}">
        </div>
      </div>
      <div class="field" style="margin-bottom:0">
        <label>Pilar 4 · ¿Cuánto inviertes para arrancar? <span class="hint">Lo que gastas antes de la primera venta</span></label>
        <input class="inp" id="c-inversion" type="number" inputmode="decimal" step="0.01" min="0" placeholder="0.00" value="${esc(c.inversion)}">
      </div>
    </div>

    <div class="card ${listo ? 'card-ok' : 'card-warn'}">
      <div class="card-head"><h2>Tu punto de equilibrio</h2></div>
      <div class="metrics">
        <div class="metric ${ganancia > 0 ? 'ok' : 'bad'}"><div class="metric-v">${usd(ganancia)}</div><div class="metric-l">Ganas por unidad</div></div>
        <div class="metric ${margen >= 30 ? 'ok' : margen > 0 ? 'warn' : 'bad'}"><div class="metric-v">${margen.toFixed(1)}%</div><div class="metric-l">Margen sobre el precio</div></div>
        <div class="metric ${listo ? 'acc' : 'bad'}"><div class="metric-v">${listo ? eq : '—'}</div><div class="metric-l">Unidades para recuperar lo invertido</div></div>
      </div>
      ${ganancia <= 0
        ? `<div class="aviso bad" style="margin-bottom:0"><span class="aviso-i">🚨</span>
           <div><b>Estás vendiendo al costo o por debajo.</b> Si el precio no supera el costo, cada venta te hace perder dinero. Revisa el precio con 3 fuentes reales.</div></div>`
        : !listo
        ? `<div class="aviso warn" style="margin-bottom:0"><span class="aviso-i">⚠️</span>
           <div><b>Todavía no hay número para el pilar 6.</b> Falta la inversión total. Eso es información valiosa, no un fracaso.</div></div>`
        : `<div class="aviso ok" style="margin-bottom:0"><span class="aviso-i">✅</span>
           <div><b>Puedes ponerle número: ${eq} unidades.</b> Hasta vender ${eq} no recuperas lo invertido. Desde la ${eq + 1} empiezas a ganar.</div></div>`}
    </div>

    <div class="card card-warn">
      <div class="card-head"><h2>Pilar 4 · Regla de la reserva</h2></div>
      <p class="txt-dim">Nunca destines al arranque todo el dinero que tienes. La reserva es lo que evita que el negocio muera cuando aparece el primer problema: un cliente que no paga, un equipo que se daña, mercadería que no rota.</p>
      <div class="aviso warn mt" style="margin-bottom:0"><span class="aviso-i">💡</span>
        <div>Si tu inversión inicial es de ${usd(inv || 0)}, pregúntate: <b>¿qué pasa si pierdo esto completo?</b> Si la respuesta te deja sin dinero para lo esencial del mes, reduce la inversión antes de empezar.</div></div>
    </div>

    <div class="card">
      <div class="card-head"><h2>Pilar 6 · ¿Cómo sabrás si funcionó?</h2></div>
      <div class="field" style="margin-bottom:0">
        <label>Una meta medible y con fecha <span class="hint">Ej: 20 servicios prestados en 60 días</span></label>
        <input class="inp" id="c-meta" placeholder="¿Qué número te diría que funcionó?" value="${esc(c.meta)}">
      </div>
    </div>`;

  const bind = (sel, k, num) => { const el = $(sel); if (el) el.oninput = () => { S.cuentas[k] = el.value; guardar(); if (num) refreshCuentas(); }; };
  bind('#c-que', 'que'); bind('#c-quien', 'quien'); bind('#c-meta', 'meta');
  bind('#c-costo', 'costo', 1); bind('#c-precio', 'precio', 1); bind('#c-inversion', 'inversion', 1);
}
let cTimer = null;
function refreshCuentas() {
  clearTimeout(cTimer);
  cTimer = setTimeout(() => {
    const id = document.activeElement?.id, pos = document.activeElement?.selectionStart;
    rCuentas();
    if (id) { const el = document.getElementById(id); if (el) { el.focus(); try { el.setSelectionRange(pos, pos); } catch {} } }
  }, 420);
}

/* ==========================================================================
   COMPARADOR DE 3 PRECIOS
   ========================================================================== */
function mediana(nums) {
  const v = nums.filter(Number.isFinite).sort((a, b) => a - b);
  if (!v.length) return null;
  const m = Math.floor(v.length / 2);
  return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2;
}

function rPrecios() {
  const lista = Object.entries(S.fuentes).map(([id, f]) => ({ id, ...f }));
  const act = S._fa && S.fuentes[S._fa] ? S._fa : (lista[0]?.id || null);
  const f = act ? S.fuentes[act] : null;

  $('#precios-body').innerHTML = `
    <div class="aviso warn"><span class="aviso-i">⚠️</span>
      <div><b>Esta app no puede darte un precio.</b> El precio real depende de tu ciudad y cambia con el tiempo. Solo se obtiene consultando fuentes reales y calculando la mediana. Lo que sí hace esta herramienta es el cálculo y el registro.</div></div>

    <div class="card">
      <div class="card-head"><h2>Cómo se levanta un precio</h2></div>
      <ul class="plist">
        <li><span class="li-num">1</span><span>Consultar <b>3 fuentes distintas</b> (presenciales o en línea) del mismo producto o servicio.</span></li>
        <li><span class="li-num">2</span><span>Anotar: proveedor o competidor, referencia, fecha, presentación, precio, impuestos y flete.</span></li>
        <li><span class="li-num">3</span><span>Calcular la <b>mediana</b> de los 3 valores.</span></li>
        <li><span class="li-num">4</span><span>Comparar con tu costo real de compra o producción.</span></li>
        <li><span class="li-num">5</span><span>Recién entonces existe un precio defendible.</span></li>
      </ul>
    </div>

    <div class="card">
      <div class="card-head"><h2>Mis productos o servicios</h2></div>
      <div class="row">
        <input class="inp" id="nuevo-prod" placeholder="Nombre del producto o servicio" style="flex:1;min-width:180px">
        <button class="btn btn-primary" id="add-prod">+ Agregar</button>
      </div>
      ${lista.length ? `<div class="row mt" style="gap:7px">${lista.map(x => `
        <button class="badge ${x.id === act ? 'b-acc' : 'b-dim'}" data-prod="${x.id}" style="cursor:pointer;padding:8px 13px;font-size:12px">${esc(x.nombre)}</button>`).join('')}</div>` : ''}
    </div>

    ${f ? formFuente(act, f) : `<div class="empty"><div class="empty-ico">🔍</div><div>Agrega un producto o servicio para empezar a comparar.</div></div>`}`;

  $('#add-prod').onclick = () => {
    const n = $('#nuevo-prod').value.trim();
    if (!n) return toast('Escribe el nombre.');
    const id = 'f' + Date.now();
    S.fuentes[id] = { nombre: n, v: [{}, {}, {}], costoPropio: '' };
    S._fa = id; guardar(); rPrecios();
  };
  $$('[data-prod]').forEach(b => b.onclick = () => { S._fa = b.dataset.prod; rPrecios(); });

  if (f) {
    $$('[data-v]').forEach(inp => inp.oninput = () => {
      const [i, campo] = inp.dataset.v.split('.');
      S.fuentes[act].v[+i][campo] = inp.value; guardar(); updMediana(act);
    });
    const cp = $('#costo-propio'); if (cp) cp.oninput = () => { S.fuentes[act].costoPropio = cp.value; guardar(); updMediana(act); };
    const del = $('#del-prod'); if (del) del.onclick = () => modal({
      titulo: '¿Borrar este registro?', cuerpo: `<p>Se borrarán las 3 fuentes de <b>${esc(f.nombre)}</b>.</p>`,
      acciones: [{ id: 'no', txt: 'Cancelar' }, { id: 'si', txt: 'Borrar', cls: 'btn-danger', fn: () => { delete S.fuentes[act]; S._fa = null; guardar(); rPrecios(); } }]
    });
    const up = $('#usar-precio'); if (up) up.onclick = () => {
      const m = mediana(f.v.map(x => parseFloat(x.precio)));
      if (m == null) return toast('Completa al menos un precio.');
      S.cuentas.precio = m.toFixed(2); guardar(); toast('Precio aplicado: ' + usd(m));
    };
    const uc = $('#usar-costo'); if (uc) uc.onclick = () => {
      const c = parseFloat(f.costoPropio);
      if (!Number.isFinite(c)) return toast('Escribe tu costo.');
      S.cuentas.costo = c.toFixed(2); guardar(); toast('Costo aplicado: ' + usd(c));
    };
  }
}

function formFuente(id, f) {
  const precios = f.v.map(x => parseFloat(x.precio));
  const med = mediana(precios);
  const validos = precios.filter(Number.isFinite).length;
  const costo = parseFloat(f.costoPropio);
  const mu = Number.isFinite(med) && Number.isFinite(costo) ? med - costo : null;
  const mp = Number.isFinite(med) && med > 0 && mu != null ? (mu / med) * 100 : null;

  return `
    <div class="card card-acc">
      <div class="card-head"><h2>${esc(f.nombre)}</h2><button class="btn btn-danger btn-sm" id="del-prod">Borrar</button></div>
      <div class="aviso info"><span class="aviso-i">📝</span><div>Los 3 registros deben ser de <b>fuentes distintas</b>. Si repites la misma fuente, la mediana no vale.</div></div>
      ${f.v.map((v, i) => `
        <div class="card" style="background:var(--card2);margin-bottom:11px">
          <div style="font-weight:750;margin-bottom:11px;font-size:14px">Fuente ${i + 1}</div>
          <div class="grid2">
            <div class="field" style="margin-bottom:11px"><label>Fuente</label>
              <input class="inp" data-v="${i}.fuente" placeholder="Negocio o sitio" value="${esc(v.fuente || '')}"></div>
            <div class="field" style="margin-bottom:11px"><label>Referencia o enlace</label>
              <input class="inp" data-v="${i}.ref" placeholder="Enlace o dirección" value="${esc(v.ref || '')}"></div>
            <div class="field" style="margin-bottom:11px"><label>Fecha</label>
              <input class="inp" type="date" data-v="${i}.fecha" value="${esc(v.fecha || hoy())}"></div>
            <div class="field" style="margin-bottom:11px"><label>Presentación</label>
              <input class="inp" data-v="${i}.pres" placeholder="Tamaño o alcance" value="${esc(v.pres || '')}"></div>
            <div class="field" style="margin-bottom:11px"><label>Precio</label>
              <input class="inp" type="number" inputmode="decimal" step="0.01" data-v="${i}.precio" placeholder="0.00" value="${esc(v.precio || '')}"></div>
            <div class="field" style="margin-bottom:0"><label>Impuestos y flete</label>
              <input class="inp" type="number" inputmode="decimal" step="0.01" data-v="${i}.extra" placeholder="0.00" value="${esc(v.extra || '')}"></div>
          </div>
        </div>`).join('')}
      <div id="mediana-box">${htmlMed(med, validos, costo, mu, mp)}</div>
    </div>

    <div class="card">
      <div class="card-head"><h2>Tu costo propio</h2></div>
      <div class="field">
        <label>¿Cuánto te cuesta a ti producirlo o comprarlo? <span class="hint">Para comparar contra la mediana del mercado</span></label>
        <input class="inp" id="costo-propio" type="number" inputmode="decimal" step="0.01" placeholder="0.00" value="${esc(f.costoPropio || '')}">
      </div>
      <div class="row">
        <button class="btn btn-ok btn-sm" id="usar-precio">Usar la mediana como mi precio</button>
        <button class="btn btn-ghost btn-sm" id="usar-costo">Usar mi costo</button>
      </div>
    </div>`;
}

function htmlMed(med, validos, costo, mu, mp) {
  if (med == null) return `<div class="aviso warn" style="margin-bottom:0"><span class="aviso-i">⏳</span>
    <div>Faltan precios. Llevas <b>${validos} de 3</b>. Sin 3 fuentes no hay mediana.</div></div>`;
  return `
    <div class="metrics" style="margin-bottom:12px">
      <div class="metric ${validos >= 3 ? 'ok' : 'warn'}"><div class="metric-v">${usd(med)}</div><div class="metric-l">Mediana del mercado</div></div>
      <div class="metric ${validos >= 3 ? 'ok' : 'warn'}"><div class="metric-v">${validos}/3</div><div class="metric-l">Fuentes consultadas</div></div>
      ${mu != null ? `
        <div class="metric ${mu > 0 ? 'ok' : 'bad'}"><div class="metric-v">${usd(mu)}</div><div class="metric-l">Diferencia vs tu costo</div></div>
        <div class="metric ${mp >= 30 ? 'ok' : mp > 0 ? 'warn' : 'bad'}"><div class="metric-v">${mp.toFixed(1)}%</div><div class="metric-l">Margen estimado</div></div>` : ''}
    </div>
    ${validos >= 3
      ? `<div class="aviso ok" style="margin-bottom:0"><span class="aviso-i">✅</span><div><b>Tienes las 3 fuentes.</b> Mediana: ${usd(med)}. Este es un precio de referencia defendible.</div></div>`
      : `<div class="aviso warn" style="margin-bottom:0"><span class="aviso-i">⚠️</span><div><b>Mediana provisional.</b> Solo ${validos} fuente(s). Consulta ${3 - validos} más antes de fijar precio.</div></div>`}`;
}

function updMediana(id) {
  const f = S.fuentes[id]; if (!f) return;
  const box = $('#mediana-box'); if (!box) return;
  const precios = f.v.map(x => parseFloat(x.precio));
  const med = mediana(precios);
  const validos = precios.filter(Number.isFinite).length;
  const costo = parseFloat(f.costoPropio);
  const mu = Number.isFinite(med) && Number.isFinite(costo) ? med - costo : null;
  const mp = Number.isFinite(med) && med > 0 && mu != null ? (mu / med) * 100 : null;
  box.innerHTML = htmlMed(med, validos, costo, mu, mp);
}

/* ==========================================================================
   PLAN DE 90 DÍAS
   ========================================================================== */
function rPlan90() {
  const body = $('#plan90-body');
  const total = D.PLAN_90.etapas.reduce((a, e) => a + e.tareas.length, 0);
  const hechas = Object.values(S.plan).filter(Boolean).length;
  const pct = Math.round(hechas / total * 100);

  body.innerHTML = `
    ${S.elegida ? `<div class="aviso ok"><span class="aviso-i">🎯</span>
      <div>Tu categoría elegida: <b>${esc(D.CATEGORIAS.find(c => c.id === S.elegida)?.nombre)}</b></div></div>`
      : `<div class="aviso warn"><span class="aviso-i">⚠️</span>
      <div><b>Todavía no elegiste categoría.</b> El plan funciona mejor con una sola. <button class="btn btn-ghost btn-sm" data-go="perfil" style="margin-top:8px">Hacer el test</button></div></div>`}

    <div class="card">
      <div class="progress-wrap" style="margin-bottom:10px">
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
        <span class="progress-label">${pct}%</span>
      </div>
      <p class="txt-dim">${hechas} de ${total} tareas completadas.</p>
    </div>

    ${D.PLAN_90.etapas.map((e, idx) => {
      const th = e.tareas.filter((_, i) => S.plan[e.id + '_' + i]).length;
      const abierto = S._etapa === e.id || (S._etapa == null && idx === 0);
      return `<div class="etapa${abierto ? ' open' : ''}" data-etapa="${e.id}">
        <div class="etapa-h">
          <span class="etapa-e">${e.emoji}</span>
          <span class="etapa-tx">
            <span class="etapa-n">${esc(e.nombre)} <span style="color:var(--dim2);font-weight:600;font-size:13px">· Días ${esc(e.dias)}</span></span>
            <span class="etapa-d">${esc(e.objetivo)}</span>
          </span>
          <span class="etapa-pct">${th}/${e.tareas.length}</span><span class="chev">▼</span>
        </div>
        <div class="etapa-body" style="${abierto ? '' : 'display:none'}">
          <div class="aviso info" style="margin-bottom:12px"><span class="aviso-i">📦</span><div><b>Entregable:</b> ${esc(e.entregable)}</div></div>
          ${e.tareas.map((t, i) => {
            const k = e.id + '_' + i, done = !!S.plan[k];
            return `<div class="check${done ? ' done' : ''}" data-task="${k}"><span class="cbox">✓</span><span class="check-t">${esc(t)}</span></div>`;
          }).join('')}
        </div></div>`;
    }).join('')}

    <div class="card card-warn">
      <div class="card-head"><h2>⚖️ Criterio de decisión honesto</h2></div>
      <p class="txt-dim">${esc(D.PLAN_90.criterioHonesto)}</p>
    </div>`;

  $$('[data-etapa]').forEach(el => {
    el.querySelector('.etapa-h').onclick = () => {
      const b = el.querySelector('.etapa-body');
      const abrir = b.style.display === 'none';
      b.style.display = abrir ? '' : 'none';
      el.classList.toggle('open', abrir);
      S._etapa = abrir ? el.dataset.etapa : null;
    };
  });
  $$('[data-task]').forEach(el => el.onclick = () => {
    const k = el.dataset.task;
    S.plan[k] = !S.plan[k]; guardar();
    el.classList.toggle('done', !!S.plan[k]);
    const et = k.split('_')[0];
    const e = D.PLAN_90.etapas.find(x => x.id === et);
    const th = e.tareas.filter((_, i) => S.plan[et + '_' + i]).length;
    $(`[data-etapa="${et}"]`).querySelector('.etapa-pct').textContent = `${th}/${e.tareas.length}`;
    const tot = D.PLAN_90.etapas.reduce((a, x) => a + x.tareas.length, 0);
    const hh = Object.values(S.plan).filter(Boolean).length;
    const p = Math.round(hh / tot * 100);
    $('.progress-fill', body).style.width = p + '%';
    $('.progress-label', body).textContent = p + '%';
    $('.card .txt-dim', body).textContent = `${hh} de ${tot} tareas completadas.`;
  });
}

/* ==========================================================================
   LIBRETA
   ========================================================================== */
function rLibreta() {
  const movs = S.libreta;
  const ing = movs.filter(m => m.tipo === 'ingreso').reduce((a, m) => a + m.monto, 0);
  const gas = movs.filter(m => m.tipo === 'gasto').reduce((a, m) => a + m.monto, 0);
  const saldo = ing - gas;
  const porDia = {};
  movs.forEach(m => { porDia[m.fecha] = porDia[m.fecha] || { i: 0, g: 0 }; porDia[m.fecha][m.tipo === 'ingreso' ? 'i' : 'g'] += m.monto; });
  const dias = Object.keys(porDia).sort().reverse();

  $('#libreta-body').innerHTML = `
    <div class="aviso info"><span class="aviso-i">📒</span>
      <div>Este es el pilar 5. Fecha, qué, cuánto y saldo. La constancia diaria vale más que la herramienta que uses.</div></div>

    <div class="metrics">
      <div class="metric ok"><div class="metric-v">${usd(ing)}</div><div class="metric-l">Ingresos</div></div>
      <div class="metric bad"><div class="metric-v">${usd(gas)}</div><div class="metric-l">Gastos</div></div>
      <div class="metric ${saldo >= 0 ? 'acc' : 'bad'}"><div class="metric-v">${usd(saldo)}</div><div class="metric-l">Resultado real</div></div>
      <div class="metric"><div class="metric-v">${movs.length}</div><div class="metric-l">Movimientos</div></div>
    </div>

    <div class="card card-acc">
      <div class="card-head"><h2>Registrar movimiento</h2></div>
      <div class="grid2">
        <div class="field"><label>Tipo</label>
          <select class="inp" id="l-tipo">
            <option value="ingreso">💵 Entró dinero</option>
            <option value="gasto">💸 Salió dinero</option>
          </select></div>
        <div class="field"><label>Monto</label>
          <input class="inp" id="l-monto" type="number" inputmode="decimal" step="0.01" min="0" placeholder="0.00"></div>
      </div>
      <div class="field"><label>¿Qué pasó? <span class="hint">Describe el movimiento</span></label>
        <input class="inp" id="l-desc" placeholder="Ej: cobré el primer servicio"></div>
      <div class="grid2">
        <div class="field"><label>Fecha</label><input class="inp" id="l-fecha" type="date" value="${hoy()}"></div>
        <div class="field"><label>Nota <span class="hint">Opcional</span></label><input class="inp" id="l-nota" placeholder="Cliente, detalle"></div>
      </div>
      <button class="btn btn-primary btn-lg" id="l-add">+ Registrar</button>
    </div>

    <div class="card">
      <div class="card-head"><h2>Mis movimientos</h2>
        ${movs.length ? '<button class="btn btn-danger btn-sm" id="l-csv">Exportar</button>' : ''}</div>
      ${!movs.length ? `<div class="empty"><div class="empty-ico">📒</div><div>Tu libreta está vacía. Registra el primer movimiento.</div></div>`
        : dias.map(d => `
          <div style="margin-bottom:15px">
            <div class="row" style="justify-content:space-between;margin-bottom:8px">
              <b style="font-size:13px;color:var(--dim)">${fmtFecha(d)}</b>
              <span class="txt-dim" style="font-size:12px">${porDia[d].i ? '+' + usd(porDia[d].i) : ''}${porDia[d].i && porDia[d].g ? ' · ' : ''}${porDia[d].g ? '−' + usd(porDia[d].g) : ''}</span>
            </div>
            ${movs.filter(m => m.fecha === d).map(m => `
              <div class="mov">
                <span class="mov-ico">${m.tipo === 'ingreso' ? '💵' : '💸'}</span>
                <span class="mov-tx"><span class="mov-d">${esc(m.desc)}</span>
                <span class="mov-m">${m.tipo === 'ingreso' ? 'Ingreso' : 'Gasto'}${m.nota ? ' · ' + esc(m.nota) : ''}</span></span>
                <span class="mov-v ${m.tipo === 'ingreso' ? 'in' : 'out'}">${m.tipo === 'ingreso' ? '+' : '−'}${usd(m.monto)}</span>
                <button class="mov-x" data-del="${m.id}">✕</button>
              </div>`).join('')}
          </div>`).join('')}
    </div>

    ${movs.length ? '<button class="btn btn-danger btn-lg" id="l-borrar">Borrar toda la libreta</button>' : ''}`;

  $('#l-add').onclick = () => {
    const monto = parseFloat($('#l-monto').value);
    if (!Number.isFinite(monto) || monto <= 0) return toast('Escribe un monto mayor que cero.');
    const desc = $('#l-desc').value.trim();
    if (!desc) return toast('Escribe qué pasó.');
    S.libreta.push({ id: 'm' + Date.now(), tipo: $('#l-tipo').value, monto, desc,
      fecha: $('#l-fecha').value || hoy(), nota: $('#l-nota').value.trim() });
    guardar(); rLibreta(); toast('Movimiento registrado ✓');
  };
  $$('[data-del]').forEach(b => b.onclick = () => { S.libreta = S.libreta.filter(m => m.id !== b.dataset.del); guardar(); rLibreta(); });
  const bc = $('#l-borrar'); if (bc) bc.onclick = () => modal({
    titulo: '¿Borrar toda la libreta?', cuerpo: `<p>Se borrarán los <b>${movs.length}</b> movimientos.</p>`,
    acciones: [{ id: 'no', txt: 'Cancelar' }, { id: 'si', txt: 'Borrar todo', cls: 'btn-danger', fn: () => { S.libreta = []; guardar(); rLibreta(); } }]
  });
  const csv = $('#l-csv'); if (csv) csv.onclick = () => {
    const filas = [['Fecha', 'Tipo', 'Descripcion', 'Monto', 'Nota']];
    [...movs].sort((a, b) => a.fecha.localeCompare(b.fecha)).forEach(m =>
      filas.push([m.fecha, m.tipo, '"' + (m.desc || '').replace(/"/g, '""') + '"', m.monto.toFixed(2), '"' + (m.nota || '').replace(/"/g, '""') + '"']));
    filas.push([], ['Ingresos', '', '', ing.toFixed(2)], ['Gastos', '', '', gas.toFixed(2)], ['Resultado', '', '', saldo.toFixed(2)]);
    const blob = new Blob(['\ufeff' + filas.map(f => f.join(',')).join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = `libreta-${hoy()}.csv`; a.click();
    URL.revokeObjectURL(a.href); toast('Libreta exportada.');
  };
}

/* ==========================================================================
   PILARES Y HERRAMIENTAS
   ========================================================================== */
function rPilares() {
  $('#pilares-body').innerHTML = `
    <div class="card card-acc">
      <div class="card-head"><h2>Los 6 pilares antes de invertir</h2></div>
      <p class="txt-dim mb">Si no puedes responder los seis, todavía no estás listo para poner dinero. Eso no es un fracaso: es información.</p>
      ${D.PILARES.map(p => `
        <div class="step" style="border-left-color:${p.estrella ? 'var(--ok)' : 'var(--acc)'}">
          <div class="row" style="justify-content:space-between;margin-bottom:6px">
            <b style="font-size:15px;color:${p.estrella ? '#8ff0b5' : '#cfe0ff'}">${p.n}. ${esc(p.t)}</b>
            ${p.estrella ? '<span class="badge b-ok">El más saltado</span>' : ''}
          </div>
          <div class="step-d">${esc(p.d)}</div>
        </div>`).join('')}
      <div class="aviso ok" style="margin-bottom:0"><span class="aviso-i">💡</span><div>${esc(D.NOTA_PILAR_1)}</div></div>
    </div>

    <div class="card card-warn">
      <div class="card-head"><h2>${esc(D.HERRAMIENTAS.reglaIA.titulo)}</h2></div>
      <p class="txt-dim">${esc(D.HERRAMIENTAS.reglaIA.texto)}</p>
    </div>

    ${D.HERRAMIENTAS.categorias.map(c => `
      <div class="card">
        <div class="card-head"><h2>${esc(c.t)}</h2></div>
        <ul class="plist">${c.items.map(i => `<li><span class="pmark p">›</span><span>${esc(i)}</span></li>`).join('')}</ul>
      </div>`).join('')}

    <div class="aviso warn"><span class="aviso-i">📅</span><div>${esc(D.HERRAMIENTAS.notaVigencia)}</div></div>`;
}

/* ==========================================================================
   PRIVACIDAD
   ========================================================================== */
function rPrivacidad() {
  $('#privacidad-body').innerHTML = `
    <div class="card card-ok">
      <div class="card-head"><h2>🔐 ${esc(D.PRIVACIDAD.titulo)}</h2></div>
      <ul class="plist">${D.PRIVACIDAD.puntos.map(p => `<li><span class="pmark p">✓</span><span>${esc(p)}</span></li>`).join('')}</ul>
    </div>

    <div class="card card-warn">
      <div class="card-head"><h2>⚠️ Descargos</h2></div>
      <ul class="plist">${D.DESCARGOS.map(d => `<li><span class="pmark w">!</span><span>${esc(d)}</span></li>`).join('')}</ul>
    </div>

    <div class="card">
      <div class="card-head"><h2>Qué se guarda y dónde</h2></div>
      <p class="txt-dim mb">Todo se guarda en el almacenamiento local de este navegador, en este dispositivo. Nada viaja por internet.</p>
      <div class="scroll-x">
        <table class="tbl">
          <thead><tr><th>Se guarda</th><th>Para qué</th></tr></thead>
          <tbody>
            <tr><td>Rango de edad</td><td>Ajustar la orientación legal y de riesgo</td></tr>
            <tr><td>Tipo y tamaño de zona</td><td>Ajustar según tamaño de mercado</td></tr>
            <tr><td>Género (opcional)</td><td>Ajuste de orientación; puedes omitirlo</td></tr>
            <tr><td>Capital y tiempo disponibles</td><td>Filtrar categorías viables</td></tr>
            <tr><td>Afinidades, habilidades e intereses</td><td>Calcular la afinidad con cada categoría</td></tr>
            <tr><td>Plan, cuentas y libreta</td><td>Tu seguimiento personal</td></tr>
          </tbody>
        </table>
      </div>
      <p class="txt-dim mt"><b style="color:var(--txt)">No se guarda:</b> nombre, documento, dirección, teléfono, correo, ubicación exacta ni fecha de nacimiento.</p>
    </div>

    <div class="card">
      <div class="card-head"><h2>Gestionar mis datos</h2></div>
      <div class="row">
        <button class="btn btn-ghost btn-sm" id="exp-todo">Exportar todo (JSON)</button>
        <button class="btn btn-danger btn-sm" id="borrar-todo">Borrar todos mis datos</button>
      </div>
    </div>`;

  $('#exp-todo').onclick = () => {
    const blob = new Blob([JSON.stringify({ app: D.META.app, version: D.META.version, exportado: new Date().toISOString(), datos: S }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = `brujula-${hoy()}.json`; a.click();
    URL.revokeObjectURL(a.href); toast('Datos exportados.');
  };
  $('#borrar-todo').onclick = () => modal({
    titulo: '¿Borrar todos los datos?',
    cuerpo: '<p>Se borrará todo: perfil, resultado, categoría elegida, cuentas, precios, plan y libreta. <b>No se puede deshacer.</b></p><p class="txt-dim">Exporta primero si quieres conservar una copia.</p>',
    acciones: [{ id: 'no', txt: 'Cancelar' },
      { id: 'si', txt: 'Borrar todo', cls: 'btn-danger', fn: () => { S = vacio(); guardar(); toast('Datos borrados.'); go('inicio'); } }]
  });
}

/* ==========================================================================
   INICIO
   ========================================================================== */
function rInicio() {
  const card = $('#home-resume'), box = $('#home-resume-card');
  if (S.elegida) {
    const c = D.CATEGORIAS.find(x => x.id === S.elegida);
    const tot = D.PLAN_90.etapas.reduce((a, e) => a + e.tareas.length, 0);
    const hh = Object.values(S.plan).filter(Boolean).length;
    const pct = Math.round(hh / tot * 100);
    const ing = S.libreta.filter(m => m.tipo === 'ingreso').reduce((a, m) => a + m.monto, 0);
    const gas = S.libreta.filter(m => m.tipo === 'gasto').reduce((a, m) => a + m.monto, 0);
    card.style.display = '';
    box.innerHTML = `
      <div class="row" style="gap:13px;align-items:flex-start;margin-bottom:14px">
        <span style="font-size:34px">${c.emoji}</span>
        <div style="flex:1;min-width:0">
          <div style="font-weight:750;font-size:16px;line-height:1.3">${esc(c.nombre)}</div>
          <div class="txt-dim" style="font-size:12.5px;margin-top:3px">Permiso ${esc(c.requierePermiso)} · ${c.escalable ? 'puede crecer' : 'techo por horas'}</div>
        </div>
      </div>
      <div class="bar-lbl"><b>Avance del plan</b><span>${hh}/${tot}</span></div>
      <div class="bar-bg mb"><div class="bar-fill g" style="width:${pct}%"></div></div>
      <div class="row">
        <button class="btn btn-primary btn-sm" data-go="detalle">Ver mi guía →</button>
        <button class="btn btn-ghost btn-sm" data-go="plan90">Plan de 90 días</button>
        ${S.libreta.length ? `<span class="badge ${ing - gas >= 0 ? 'b-ok' : 'b-bad'}">Resultado: ${usd(ing - gas)}</span>` : ''}
      </div>
      <button class="btn btn-ghost btn-sm mt" id="cambiar-cat">Cambiar de categoría</button>`;
    $('#cambiar-cat').onclick = () => modal({
      titulo: '¿Cambiar de categoría?',
      cuerpo: '<p>Cambiar está bien si lo haces con datos, no por impaciencia. Tus cuentas, plan y libreta se conservan.</p>',
      acciones: [{ id: 'no', txt: 'Mejor no' },
        { id: 'si', txt: 'Cambiar', cls: 'btn-danger', fn: () => { S.elegida = null; guardar(); go('categorias'); } }]
    });
  } else card.style.display = 'none';

  $('#home-aviso').innerHTML = `
    <div class="aviso info"><span class="aviso-i">🧭</span>
      <div><b>${esc(D.AVISO_CENTRAL.titulo)}</b></div></div>
    ${D.AVISO_CENTRAL.noEs.map(n => `<div class="aviso warn"><span class="aviso-i">⚠️</span><div>${esc(n)}</div></div>`).join('')}
    <div class="aviso bad" style="margin-bottom:0"><span class="aviso-i">🚨</span><div><b>Regla de oro:</b> ${esc(D.AVISO_CENTRAL.reglaOro)}</div></div>`;
}

/* ==========================================================================
   PWA
   ========================================================================== */
function initPWA() {
  const banner = $('#offline-banner');
  const upd = on => banner.classList.toggle('hidden', !on);
  upd(!navigator.onLine);
  window.addEventListener('online', () => upd(false));
  window.addEventListener('offline', () => upd(true));
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;

  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('./sw.js', { scope: './' });
      const mostrar = w => {
        const t = $('#update-toast');
        t.classList.remove('hidden');
        t.onclick = () => { w.postMessage({ type: 'SKIP_WAITING' }); t.textContent = 'Actualizando…'; };
      };
      if (reg.waiting && navigator.serviceWorker.controller) mostrar(reg.waiting);
      reg.addEventListener('updatefound', () => {
        const nw = reg.installing; if (!nw) return;
        nw.addEventListener('statechange', () => { if (nw.state === 'installed' && navigator.serviceWorker.controller) mostrar(nw); });
      });
      let rec = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => { if (rec) return; rec = true; location.reload(); });
      document.addEventListener('visibilitychange', () => { if (!document.hidden) reg.update().catch(() => {}); });
      setInterval(() => reg.update().catch(() => {}), 3600000);
    } catch (e) { console.warn('SW no registrado:', e); }
  });
}

/* ---------------- arranque ---------------- */
function init() {
  const h = location.hash.replace('#', '');
  const ok = ['inicio', 'perfil', 'categorias', 'cuentas', 'precios', 'plan90', 'libreta', 'pilares', 'privacidad'];
  go(ok.includes(h) ? h : 'inicio');
  initPWA();
}
init();
