// "Mi cuenta" de Patiolo: inicio de sesión de clientes y programa de fidelidad.
// Se empaqueta en js/cuenta.js (ver README: "Mi cuenta").
import { initializeApp } from "firebase/app";
import {
  getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword,
  signInWithCustomToken, signOut, browserLocalPersistence, setPersistence,
} from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";

const app = initializeApp({
  apiKey: "AIzaSyCiAJTJrSmcQHiMzLtCdywwoznOww7r3gg",
  authDomain: "patiolo-produccion.firebaseapp.com",
  projectId: "patiolo-produccion",
  appId: "1:918842699626:web:d0a4abceb1ae0cfbd0bf13",
});
const auth = getAuth(app);
const functions = getFunctions(app, "southamerica-west1");
setPersistence(auth, browserLocalPersistence).catch(() => {});

const $ = (id) => document.getElementById(id);
const esc = (t) => { const d = document.createElement("div"); d.textContent = t == null ? "" : String(t); return d.innerHTML; };
const clp = (n) => "$" + Math.round(n || 0).toLocaleString("es-CL");
const fecha = (t) => new Date(t).toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" });
const hora = (t) => new Date(t).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });
const fCorta = (f) => (f ? f.split("-").reverse().join("-") : "");
const LLAMA = '<svg viewBox="0 0 676 786" aria-hidden="true"><path fill="currentColor" d="M293 0 L292 11 L299 24 L308 69 L307 104 L289 187 L259 249 L220 297 L195 321 L180 325 L174 315 L167 260 L158 240 L146 222 L130 206 L121 206 L110 260 L98 285 L34 377 L13 418 L1 465 L0 528 L11 573 L22 601 L42 636 L60 660 L88 688 L119 709 L145 721 L170 720 L199 710 L238 690 L266 671 L283 654 L296 651 L328 629 L406 565 L468 496 L479 433 L489 409 L498 396 L522 375 L540 364 L585 346 L593 348 L598 356 L595 391 L588 418 L578 440 L547 471 L531 481 L506 492 L482 498 L469 523 L430 577 L334 676 L271 721 L210 759 L213 766 L221 769 L292 781 L338 785 L387 783 L445 771 L500 749 L536 729 L575 701 L606 669 L646 606 L657 583 L667 551 L675 496 L669 424 L658 377 L638 326 L588 239 L583 235 L576 236 L569 254 L551 284 L525 309 L514 311 L510 305 L507 259 L496 217 L477 172 L445 121 L416 86 L384 56 L328 15Z"/></svg>';

async function llamar(nombre, data) {
  try { return (await httpsCallable(functions, nombre)(data || {})).data; }
  catch (e) {
    const code = String(e?.code || "").replace(/^functions\//, "");
    if (navigator.onLine === false) throw new Error("Sin conexión a internet.");
    if (code === "internal" && (!e.message || /^internal$/i.test(e.message))) throw new Error("El servicio no respondió. Intenta de nuevo en unos minutos.");
    throw new Error(e.message || "Ocurrió un error.");
  }
}
function errAuth(e) {
  const c = String(e?.code || "");
  if (/popup-closed|cancelled-popup/.test(c)) return "";
  if (/popup-blocked/.test(c)) return "El navegador bloqueó la ventana de Google. Permite las ventanas emergentes o usa otra opción.";
  if (/invalid-credential|wrong-password|user-not-found|invalid-login/.test(c)) return "Correo o contraseña incorrectos. Si no tienes contraseña, entra con un código al correo.";
  if (/too-many-requests/.test(c)) return "Demasiados intentos. Espera unos minutos o entra con un código al correo.";
  if (/unauthorized-domain|operation-not-allowed/.test(c)) return "Este inicio de sesión aún no está habilitado. Usa otra opción.";
  return e?.message || "No se pudo iniciar sesión.";
}

/* ---------------- Inicio de sesión ---------------- */

const L = { paso: "inicio", email: "", enviado: false, busy: false, err: "" };
function pintarLogin() {
  const v = $("vista");
  const correo = `<label class="campo"><span>Correo</span><input id="l-email" type="email" autocomplete="email" value="${esc(L.email)}" placeholder="tu@correo.cl"></label>`;
  const codigo = (txt, extra = "") => !L.enviado
    ? `${correo}<button class="btn btn-primary" id="l-enviar" ${L.busy ? "disabled" : ""}>${L.busy ? "Enviando…" : "Enviarme un código"}</button>`
    : `${correo}<p class="suave">Te enviamos un código de 6 dígitos a <b>${esc(L.email)}</b>. Revisa también la carpeta de spam.</p>
       <label class="campo"><span>Código</span><input id="l-codigo" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="123456"></label>${extra}
       <button class="btn btn-primary" id="l-ok" ${L.busy ? "disabled" : ""}>${L.busy ? "Entrando…" : txt}</button>
       <button class="btn-link" id="l-enviar">Reenviar código</button>`;
  let cuerpo = "";
  if (L.paso === "inicio") cuerpo = `
      <button class="btn btn-google" id="l-google" ${L.busy ? "disabled" : ""}><svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>Continuar con Google</button>
      <button class="btn btn-ghost" data-paso="codigo">Recibir un código en mi correo</button>
      <button class="btn btn-ghost" data-paso="clave">Entrar con correo y contraseña</button>`;
  if (L.paso === "codigo") cuerpo = codigo("Entrar");
  if (L.paso === "clave") cuerpo = `${correo}<label class="campo"><span>Contraseña</span><input id="l-clave" type="password" autocomplete="current-password"></label>
      <button class="btn btn-primary" id="l-entrar" ${L.busy ? "disabled" : ""}>${L.busy ? "Entrando…" : "Entrar"}</button>
      <button class="btn-link" data-paso="nueva">Crear cuenta u olvidé mi contraseña</button>`;
  if (L.paso === "nueva") cuerpo = codigo("Guardar y entrar", `<label class="campo"><span>Tu nombre</span><input id="l-nombre" autocomplete="name"></label>
      <label class="campo"><span>Contraseña nueva (mínimo 8)</span><input id="l-nueva" type="password" autocomplete="new-password"></label>`);
  v.innerHTML = `<section class="login">
    <div class="login-txt"><span class="label">Club Patiolo</span><h1>Mi cuenta</h1>
      <p>Suma tus compras, gana premios, revisa tus pedidos y usa tus cupones. En caja solo di tu RUT o teléfono.</p>
      <ul class="beneficios"><li>Premios cada cierto número de compras</li><li>Misiones con recompensas</li><li>Cupones de descuento en tu boleta</li><li>Historial de todos tus pedidos</li></ul></div>
    <div class="caja login-caja"><h2>${L.paso === "inicio" ? "Inicia sesión o crea tu cuenta" : L.paso === "codigo" ? "Entrar con un código" : L.paso === "clave" ? "Entrar con contraseña" : "Crear cuenta o nueva contraseña"}</h2>
      ${cuerpo}
      ${L.paso !== "inicio" ? '<button class="btn-link" data-paso="inicio">← Otras opciones</button>' : ""}
      ${L.err ? `<p class="error" role="alert">${esc(L.err)}</p>` : ""}
      <p class="suave chico">Al crear tu cuenta aceptas que Patiolo guarde tus compras para el programa de fidelidad.</p></div>
  </section>`;
  v.querySelectorAll("[data-paso]").forEach((b) => b.onclick = () => { Object.assign(L, { paso: b.dataset.paso, enviado: false, err: "" }); pintarLogin(); });
  const em = $("l-email"); if (em) em.oninput = () => { L.email = em.value.trim(); };
  const hacer = async (f) => { L.err = ""; L.busy = true; pintarLogin(); try { await f(); } catch (e) { L.err = errAuth(e); } L.busy = false; if (!auth.currentUser || auth.currentUser.isAnonymous) pintarLogin(); };
  if ($("l-google")) $("l-google").onclick = () => hacer(() => signInWithPopup(auth, new GoogleAuthProvider()));
  if ($("l-enviar")) $("l-enviar").onclick = () => hacer(async () => { if (!L.email.includes("@")) throw new Error("Escribe tu correo."); await llamar("codigoEnviar", { email: L.email }); L.enviado = true; });
  if ($("l-entrar")) $("l-entrar").onclick = () => { const clave = $("l-clave").value; hacer(() => signInWithEmailAndPassword(auth, L.email, clave)); };
  if ($("l-clave")) $("l-clave").onkeydown = (e) => { if (e.key === "Enter") $("l-entrar").click(); };
  if ($("l-ok")) $("l-ok").onclick = () => {
    const codigo = $("l-codigo").value.replace(/\D/g, "");
    if (L.paso === "codigo") return hacer(async () => { const r = await llamar("codigoEntrar", { email: L.email, codigo }); await signInWithCustomToken(auth, r.token); });
    const clave = $("l-nueva").value, nombre = $("l-nombre").value.trim();
    hacer(async () => { if (clave.length < 8) throw new Error("La contraseña debe tener al menos 8 caracteres."); const r = await llamar("codigoClave", { email: L.email, codigo, clave, nombre }); await signInWithCustomToken(auth, r.token); });
  };
}

/* ---------------- Cuenta ---------------- */

let D = null, pedidos = [], hayMas = false, cargandoMas = false;

function tarjeta(s) {
  if (!s) return "";
  const falta = s.cada - s.tengo;
  const casillas = Array.from({ length: s.cada }, (_, i) => `<span class="sello${i < s.tengo ? " lleno" : ""}${i === s.cada - 1 ? " premio" : ""}">${i < s.tengo ? LLAMA : i === s.cada - 1 ? "🎁" : i + 1}</span>`).join("");
  return `<section class="caja"><div class="caja-h"><h2>Tu tarjeta</h2><span class="suave">${s.tengo} de ${s.cada}</span></div>
    <div class="sellos" style="--n:${Math.min(s.cada, 10)}">${casillas}</div>
    <p>${falta === s.cada && s.tengo === 0 ? `Con <b>${s.cada} compras</b> ganas <b>${esc(s.premio)}</b>.` : `Te ${falta === 1 ? "falta <b>1 compra</b>" : `faltan <b>${falta} compras</b>`} para ganar <b>${esc(s.premio)}</b>.`}${s.minimo ? ` Cuentan las compras desde ${clp(s.minimo)}.` : ""}</p></section>`;
}
const MOV = { compra: "Por tu compra", canje: "Canje", regaloEnviado: "Regalo enviado", regaloRecibido: "Regalo recibido" };
function puntos(p) {
  if (!p) return "";
  const vale = p.saldo * p.valor;
  const catalogo = p.catalogo.length ? `<div class="pts-premios">${p.catalogo.map((x) => `
      <div class="pts-premio${p.saldo >= x.costo ? " puedo" : ""}"><div><b>${esc(x.nombre)}</b>${x.texto && x.texto !== x.nombre ? `<span class="suave">${esc(x.texto)}</span>` : ""}</div>
        <button class="btn btn-ghost chico" data-premio="${esc(x.id)}" ${p.saldo >= x.costo ? "" : "disabled"}>${x.costo} pts</button></div>`).join("")}</div>` : "";
  const libre = `<div class="pts-acc"><label class="campo"><span>Canjear puntos por descuento</span>
      <input id="pts-canje" type="number" inputmode="numeric" min="${p.minimo}" step="1" placeholder="Mínimo ${p.minimo}"></label>
    <button class="btn btn-primary" id="pts-canjear" ${p.saldo >= p.minimo ? "" : "disabled"}>Canjear</button></div>`;
  const regalo = p.regalo ? `<details class="pts-regalo"><summary>Regalar puntos a alguien</summary>
    <p class="suave chico">Tiene que tener cuenta en Patiolo, con ese mismo correo. Los puntos salen de tu saldo al instante.</p>
    <div class="pts-acc"><label class="campo"><span>Correo de quien los recibe</span><input id="pts-mail" type="email" autocomplete="off" placeholder="amigo@correo.cl"></label>
      <label class="campo"><span>Puntos</span><input id="pts-regalo" type="number" inputmode="numeric" min="${p.minRegalo}" step="1" placeholder="Mínimo ${p.minRegalo}"></label>
      <button class="btn btn-ghost" id="pts-regalar">Regalar</button></div></details>` : "";
  const movs = p.movimientos.length ? `<details class="pts-movs"><summary>Tus movimientos</summary><div class="movs">${p.movimientos.map((m) => `
      <div class="mov"><span>${esc(MOV[m.tipo] || "Movimiento")}${m.de ? " de " + esc(m.de) : ""}${m.para ? " a " + esc(m.para) : ""}<span class="suave"> · ${fecha(m.t)}</span></span>
        <b class="${m.puntos < 0 ? "resta" : "suma"}">${m.puntos > 0 ? "+" : ""}${m.puntos}</b></div>`).join("")}</div></details>` : "";
  return `<section class="caja" id="puntos"><div class="caja-h"><h2>Tus puntos</h2><span class="suave">1 punto por cada ${clp(p.cada)}</span></div>
    <div class="pts-saldo"><b>${p.saldo}</b><span>${p.saldo === 1 ? "punto" : "puntos"}${vale ? ` · equivalen a ${clp(vale)}` : ""}</span></div>
    <p id="pts-msg" role="status" class="chico"></p>
    ${catalogo}${libre}${regalo}${movs}</section>`;
}
function cupones(cs) {
  if (!cs.length) return `<section class="caja"><div class="caja-h"><h2>Tus cupones</h2></div><p class="suave">Aún no tienes cupones. Los ganas con tu tarjeta, cumpliendo misiones o en promociones.</p></section>`;
  return `<section class="caja"><div class="caja-h"><h2>Tus cupones</h2><span class="suave">${cs.length}</span></div><div class="cupones">${cs.map((c) => `
    <div class="cupon"><div><b>${esc(c.nombre || c.texto)}</b><span>${esc(c.texto)}${c.minimo ? ` · compra mínima ${clp(c.minimo)}` : ""}</span>
      <span class="suave">${c.hasta ? "Vence el " + fCorta(c.hasta) : "Sin vencimiento"}</span></div><div class="codigo" aria-label="Código">${esc(c.codigo)}</div></div>`).join("")}</div>
    <p class="suave chico">En caja di tu RUT o teléfono y pide usar el cupón: se descuenta de tu boleta. Un cupón por compra.</p></section>`;
}
function misiones(ms) {
  if (!ms.length) return "";
  return `<section class="caja"><div class="caja-h"><h2>Misiones</h2></div><div class="misiones">${ms.map((m) => {
    const pct = Math.min(100, Math.round((m.valor / m.meta) * 100));
    const avance = m.tipo === "gasto" ? `${clp(m.valor)} de ${clp(m.meta)}` : `${m.valor} de ${m.meta}`;
    return `<div class="mision${m.completada ? " lista" : ""}"><div class="mision-h"><b>${esc(m.nombre)}</b><span>${m.completada ? "¡Cumplida!" : avance}</span></div>
      ${m.descripcion ? `<p class="suave">${esc(m.descripcion)}</p>` : ""}
      <div class="barra" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><span style="width:${m.completada ? 100 : pct}%"></span></div>
      <p class="chico">Premio: <b>${esc(m.premio)}</b>${m.hasta ? ` · hasta el ${fCorta(m.hasta)}` : ""}${m.repetible ? " · se puede repetir" : ""}${m.veces ? ` · la cumpliste ${m.veces} ${m.veces === 1 ? "vez" : "veces"}` : ""}</p></div>`;
  }).join("")}</div></section>`;
}
function pedidoHtml(p) {
  return `<details class="pedido"><summary><span><b>${fecha(p.fecha)}</b> <span class="suave">${hora(p.fecha)} · ${esc(p.mesa)}</span></span><span class="monto">${clp(p.total + p.propina)}</span></summary>
    <div class="pedido-b">${p.items.map((i) => `<div class="linea"><span>${i.cant}× ${esc(i.nombre)} <span class="suave">· ${esc(i.local)}</span></span><span>${clp(i.precio * i.cant)}</span></div>`).join("")}
    ${p.descuento ? `<div class="linea desc"><span>Cupón: ${esc(p.descuento.nombre)}</span><span>−${clp(p.descuento.monto)}</span></div>` : ""}
    ${p.propina ? `<div class="linea suave"><span>Propina</span><span>${clp(p.propina)}</span></div>` : ""}
    <div class="linea total"><span>${p.doc}${p.folio ? " N° " + esc(p.folio) : ""}</span><span>${clp(p.total + p.propina)}</span></div></div></details>`;
}
function historial() {
  return `<section class="caja" id="historial"><div class="caja-h"><h2>Tus pedidos</h2></div>
    ${pedidos.length ? `<div class="pedidos">${pedidos.map(pedidoHtml).join("")}</div>` : `<p class="suave">Aún no hay pedidos en tu cuenta. En tu próxima visita da tu RUT o teléfono al pagar, o pide desde el QR de la mesa con tu sesión iniciada.</p>`}
    ${hayMas ? `<button class="btn btn-ghost" id="mas" ${cargandoMas ? "disabled" : ""}>${cargandoMas ? "Cargando…" : "Ver pedidos anteriores"}</button>` : ""}</section>`;
}
function datos(p) {
  const falta = !p.telefono && !p.rut;
  return `<section class="caja${falta ? " destacar" : ""}" id="datos"><div class="caja-h"><h2>Tus datos</h2></div>
    ${falta ? `<p><b>Agrega tu teléfono o RUT</b>: con ellos te identificamos en caja para sumar tus compras.</p>` : ""}
    <form id="f-datos" class="form-datos">
      <label class="campo"><span>Nombre</span><input name="nombre" autocomplete="name" value="${esc(p.nombre)}" required></label>
      <label class="campo"><span>Teléfono</span><input name="telefono" type="tel" autocomplete="tel" value="${esc(p.telefono)}" placeholder="+56 9 1234 5678"></label>
      <label class="campo"><span>RUT</span><input name="rut" value="${esc(p.rut)}" placeholder="12.345.678-9"></label>
      <label class="campo"><span>Correo</span><input value="${esc(p.email)}" disabled></label>
      <div class="acciones"><button class="btn btn-primary" type="submit">Guardar</button><span id="datos-msg" role="status"></span></div>
    </form></section>`;
}
function pintarCuenta() {
  const p = D.perfil, primer = (p.nombre || "").split(" ")[0];
  $("vista").innerHTML = `<section class="saludo"><div><span class="label">${esc(D.programa)}</span><h1>Hola${primer ? ", " + esc(primer) : ""}</h1>
      <p class="suave">${D.stats.compras ? `${D.stats.compras} ${D.stats.compras === 1 ? "compra" : "compras"} en Patiolo` : "Bienvenido a Patiolo"}${D.nuevo && D.cupones.length ? " · ¡te regalamos un cupón de bienvenida!" : ""}</p></div>
      <button class="btn btn-ghost" id="salir">Cerrar sesión</button></section>
    ${!p.telefono && !p.rut ? datos(p) : ""}
    <div class="grilla">
      <div class="col">${D.activo ? puntos(D.puntos) + tarjeta(D.sellos) + cupones(D.cupones) + misiones(D.misiones) : `<section class="caja"><p>Pronto lanzaremos premios para clientes. Mientras, aquí ves tus pedidos.</p></section>`}</div>
      <div class="col">${historial()}${p.telefono || p.rut ? datos(p) : ""}</div>
    </div>`;
  $("salir").onclick = () => signOut(auth);
  wirePuntos();
  const f = $("f-datos");
  f.onsubmit = async (e) => {
    e.preventDefault();
    const msg = $("datos-msg"), btn = f.querySelector("button"); msg.className = ""; msg.textContent = "Guardando…"; btn.disabled = true;
    try {
      const r = await llamar("miPerfil", { nombre: f.nombre.value, telefono: f.telefono.value, rut: f.rut.value });
      const antes = !D.perfil.telefono && !D.perfil.rut;
      Object.assign(D.perfil, r);
      if (antes) pintarCuenta(); else { msg.textContent = "Guardado"; f.telefono.value = r.telefono; f.rut.value = r.rut; }
    } catch (x) { msg.className = "error"; msg.textContent = x.message; }
    btn.disabled = false;
  };
  const mas = $("mas");
  if (mas) mas.onclick = async () => {
    cargandoMas = true; mas.disabled = true; mas.textContent = "Cargando…";
    try { const r = await llamar("misPedidos", { antes: pedidos[pedidos.length - 1].cursor }); pedidos = pedidos.concat(r.pedidos); hayMas = r.mas; } catch { /* reintentar */ }
    cargandoMas = false; pintarCuenta();
  };
}

/* Canje y regalo de puntos. Tras cada acción se recarga la cuenta para que el saldo y los cupones queden al día. */
function wirePuntos() {
  const caja = $("puntos");
  if (!caja) return;
  const msg = $("pts-msg");
  const aviso = (t, mal) => { msg.textContent = t; msg.className = "chico " + (mal ? "error" : "ok"); };

  async function accion(btn, fnNombre, datos, exito) {
    const botones = caja.querySelectorAll("button");
    botones.forEach((b) => (b.disabled = true));
    aviso("Un momento…", false);
    try {
      const r = await llamar(fnNombre, datos);
      D = await llamar("miCuenta");
      pintarCuenta();
      const m = $("pts-msg"); if (m) { m.textContent = exito(r); m.className = "chico ok"; }
      const p = $("puntos"); if (p) p.scrollIntoView({ block: "nearest" });
    } catch (e) {
      botones.forEach((b) => (b.disabled = false));
      aviso(e.message, true);
    }
  }

  caja.querySelectorAll("[data-premio]").forEach((b) => {
    b.onclick = () => accion(b, "canjearPuntos", { premioId: b.dataset.premio },
      (r) => `¡Listo! Tu cupón es ${r.codigo}. Lo encuentras más abajo, en "Tus cupones".`);
  });

  const canjear = $("pts-canjear");
  if (canjear) canjear.onclick = () => {
    const n = parseInt($("pts-canje").value, 10);
    if (!n) return aviso("Escribe cuántos puntos quieres canjear.", true);
    accion(canjear, "canjearPuntos", { puntos: n }, (r) => `¡Listo! Tu cupón es ${r.codigo}. Lo encuentras más abajo, en "Tus cupones".`);
  };

  const regalar = $("pts-regalar");
  if (regalar) regalar.onclick = () => {
    const email = ($("pts-mail").value || "").trim(), n = parseInt($("pts-regalo").value, 10);
    if (!email.includes("@")) return aviso("Escribe el correo de quien recibe los puntos.", true);
    if (!n) return aviso("Escribe cuántos puntos quieres regalar.", true);
    accion(regalar, "regalarPuntos", { email, puntos: n }, (r) => `Le regalaste ${r.puntos} puntos a ${r.para}. Te quedan ${r.saldo}.`);
  };
}

async function cargarCuenta() {
  $("vista").innerHTML = '<div class="aviso"><p>Cargando tu cuenta…</p></div>';
  try {
    const [c, h] = await Promise.all([llamar("miCuenta"), llamar("misPedidos")]);
    D = c; pedidos = h.pedidos; hayMas = h.mas;
    pintarCuenta();
  } catch (e) {
    $("vista").innerHTML = `<div class="aviso"><h2>No pudimos abrir tu cuenta</h2><p>${esc(e.message)}</p><div class="fila"><button class="btn btn-primary" id="reint">Reintentar</button><button class="btn btn-ghost" id="salir">Cerrar sesión</button></div></div>`;
    $("reint").onclick = cargarCuenta; $("salir").onclick = () => signOut(auth);
  }
}

onAuthStateChanged(auth, (u) => {
  if (u && !u.isAnonymous) cargarCuenta();
  else { Object.assign(L, { paso: "inicio", enviado: false, err: "", busy: false }); pintarLogin(); }
});
