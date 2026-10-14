/**
 * Funciones de formato y manejo de fechas.
 * Las fechas se manejan como texto "AAAA-MM-DD" en la hora local del equipo.
 */

export function fechaLocal(fecha) {
  const dos = (n) => String(n).padStart(2, "0");
  return `${fecha.getFullYear()}-${dos(fecha.getMonth() + 1)}-${dos(fecha.getDate())}`;
}

export function hoy() {
  return fechaLocal(new Date());
}

/** Fecha desplazada un número de días respecto a hoy (negativo hacia atrás). */
export function fechaRelativa(dias) {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + dias);
  return fechaLocal(fecha);
}

/** "2026-10-14" -> "14/10/2026" */
export function fechaTexto(fecha) {
  const [anio, mes, dia] = fecha.split("-");
  return `${dia}/${mes}/${anio}`;
}

export function pesos(valor) {
  return "$ " + Number(valor).toLocaleString("es-CO");
}

export function edad(fechaNacimiento) {
  if (!fechaNacimiento) return "Sin dato";
  const nacimiento = new Date(fechaNacimiento);
  const actual = new Date();
  let anios = actual.getFullYear() - nacimiento.getFullYear();
  const cumpleEsteAnio = new Date(actual.getFullYear(), nacimiento.getMonth(), nacimiento.getDate());
  if (actual < cumpleEsteAnio) anios--;
  if (anios < 1) return "Menos de 1 año";
  return anios === 1 ? "1 año" : `${anios} años`;
}

/** Escapa texto para insertarlo de forma segura dentro de HTML. */
export function esc(valor) {
  const reemplazos = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return String(valor ?? "").replace(/[&<>"']/g, (c) => reemplazos[c]);
}

/** Convierte un estado ("En camino") en un nombre de clase CSS ("Encamino"). */
export function claseEstado(estado) {
  return estado.replace(/\s/g, "");
}
