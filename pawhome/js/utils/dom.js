/**
 * Utilidades para trabajar con el DOM.
 */

export const $ = (selector, raiz = document) => raiz.querySelector(selector);

/** Valor de un campo por su id, sin espacios al inicio ni al final. */
export function valor(id) {
  const campo = document.getElementById(id);
  return campo ? campo.value.trim() : "";
}

/** Muestra un mensaje temporal en la esquina inferior de la pantalla. */
export function notificar(mensaje) {
  const toast = $("#toast");
  toast.textContent = mensaje;
  toast.classList.add("ver");
  clearTimeout(toast.temporizador);
  toast.temporizador = setTimeout(() => toast.classList.remove("ver"), 2600);
}

/** Muestra un mensaje de error o de éxito dentro de un formulario. */
export function mensajeFormulario(formulario, texto, exito = false) {
  const caja = formulario.querySelector(".mensaje");
  if (!caja) return;
  caja.className = "mensaje aviso " + (exito ? "bien" : "error");
  caja.textContent = texto;
}

export function confirmar(pregunta) {
  return window.confirm(pregunta);
}
