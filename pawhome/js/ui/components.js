/**
 * Componentes de interfaz reutilizados por varias vistas.
 * Cada función devuelve un fragmento de HTML como texto.
 */
import { esc, fechaTexto, claseEstado } from "../utils/format.js";
import { detalleCita, ordenarPorFecha } from "../services/citas.service.js";

export function encabezado(titulo, descripcion, extra = "") {
  return `
    <div class="encabezado">
      <div><h2>${esc(titulo)}</h2><p>${esc(descripcion)}</p></div>
      ${extra}
    </div>`;
}

export const vacio = (mensaje) => `<p class="vacio">${esc(mensaje)}</p>`;

export const etiquetaEstado = (estado, clase = claseEstado(estado)) =>
  `<span class="estado ${clase}">${esc(estado)}</span>`;

export const opciones = (lista, valorDe, textoDe, seleccionado = "") =>
  lista.map((item) => {
    const v = valorDe(item);
    return `<option value="${esc(v)}" ${v === seleccionado ? "selected" : ""}>${esc(textoDe(item))}</option>`;
  }).join("");

/**
 * Tabla de citas. `acciones` es una función opcional que recibe la cita
 * y devuelve los botones que se muestran en la última columna.
 */
export function tablaCitas(citas, acciones = null) {
  if (!citas.length) return vacio("No hay citas para mostrar.");
  const filas = ordenarPorFecha(citas).map((cita) => {
    const { mascota, cliente, servicio, profesional } = detalleCita(cita);
    return `
      <tr>
        <td>${fechaTexto(cita.fecha)}</td>
        <td>${esc(cita.hora)}</td>
        <td><b>${esc(mascota.nombre)}</b><br><small>${esc(cliente.nombre)}</small></td>
        <td>${esc(servicio.nombre)}</td>
        <td>${esc(profesional.nombre)}</td>
        <td>${etiquetaEstado(cita.estado)}</td>
        ${acciones ? `<td>${acciones(cita)}</td>` : ""}
      </tr>`;
  }).join("");
  return `
    <div class="tabla-env"><table>
      <thead><tr><th>Fecha</th><th>Hora</th><th>Mascota</th><th>Servicio</th><th>Responsable</th><th>Estado</th>${acciones ? "<th>Acciones</th>" : ""}</tr></thead>
      <tbody>${filas}</tbody>
    </table></div>`;
}
