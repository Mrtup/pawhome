/**
 * Navegación entre secciones. Pinta el menú según el rol del usuario
 * y delega en cada vista el contenido de la pantalla.
 */
import { MENUS } from "../config/constants.js";
import { $ } from "../utils/dom.js";
import { obtenerUsuario } from "../services/auth.service.js";

import inicio from "../views/inicio.view.js";
import planes from "../views/planes.view.js";
import clientes from "../views/clientes.view.js";
import citas from "../views/citas.view.js";
import tratamientos from "../views/tratamientos.view.js";
import personal from "../views/personal.view.js";

const VISTAS = { inicio, planes, clientes, citas, tratamientos, personal };

const estado = { vista: "inicio", parametros: {} };

function pintarMenu() {
  const usuario = obtenerUsuario();
  $("#menu").innerHTML = MENUS[usuario.rol]
    .map(([clave, texto]) =>
      `<button type="button" data-ir="${clave}" class="${clave === estado.vista ? "activo" : ""}">${texto}</button>`)
    .join("");
}

/** Vuelve a dibujar la vista actual con los datos más recientes. */
export function refrescar() {
  const usuario = obtenerUsuario();
  const raiz = $("#contenido");
  const vista = VISTAS[estado.vista];
  raiz.onclick = null;
  raiz.innerHTML = vista.render(usuario, estado.parametros);
  vista.montar(raiz, usuario, estado.parametros);
  estado.parametros = {};
}

export function navegar(vista, parametros = {}) {
  const permitidas = MENUS[obtenerUsuario().rol].map(([clave]) => clave);
  estado.vista = permitidas.includes(vista) ? vista : "inicio";
  estado.parametros = parametros;
  pintarMenu();
  refrescar();
  $("#contenido").focus({ preventScroll: true });
}

export function iniciarRouter() {
  $("#menu").addEventListener("click", (evento) => {
    const boton = evento.target.closest("[data-ir]");
    if (boton) navegar(boton.dataset.ir);
  });
}
