/**
 * Tratamientos. El profesional y el administrador registran lo realizado en cada cita;
 * el cliente consulta el historial de sus mascotas. Todos pueden filtrar por tipo de servicio.
 */
import { CATEGORIAS } from "../config/constants.js";
import { esc, fechaTexto } from "../utils/format.js";
import { valor } from "../utils/dom.js";
import { encabezado, opciones, vacio } from "../ui/components.js";
import { alEnviar } from "../ui/forms.js";
import { refrescar } from "../ui/router.js";
import { detalleCita, ordenarPorFecha } from "../services/citas.service.js";
import { tratamientosVisibles, citasPorTratar, registrarTratamiento } from "../services/tratamientos.service.js";

let filtroCategoria = "";

const detalleExtra = (etiqueta, texto) => texto ? `<br><small><b>${etiqueta}:</b> ${esc(texto)}</small>` : "";

function tablaTratamientos(usuario) {
  const lista = tratamientosVisibles(usuario, filtroCategoria);
  if (!lista.length) return vacio("No hay tratamientos registrados con este filtro.");
  const filas = lista.map(({ tratamiento: t, mascota, servicio, profesional }) => `
    <tr>
      <td>${fechaTexto(t.fecha)}</td>
      <td><b>${esc(mascota.nombre)}</b></td>
      <td>${esc(servicio.nombre)}<br><small>${esc(servicio.categoria)}</small></td>
      <td>${esc(profesional.nombre)}</td>
      <td>${esc(t.descripcion)}${detalleExtra("Productos", t.productos)}${detalleExtra("Observaciones", t.observaciones)}${detalleExtra("Recomendaciones", t.recomendaciones)}</td>
    </tr>`).join("");
  return `<div class="tabla-env"><table>
    <thead><tr><th>Fecha</th><th>Mascota</th><th>Servicio</th><th>Responsable</th><th>Detalle</th></tr></thead>
    <tbody>${filas}</tbody></table></div>`;
}

function formularioTratamiento(usuario, citaPreseleccionada) {
  const pendientes = ordenarPorFecha(citasPorTratar(usuario));
  if (!pendientes.length) {
    return `<form class="bloque" id="formTrat"><h3>Registrar tratamiento</h3>${vacio("No hay citas pendientes por atender.")}</form>`;
  }
  const texto = (c) => {
    const { mascota, servicio } = detalleCita(c);
    return `${fechaTexto(c.fecha)} ${c.hora} · ${mascota.nombre} · ${servicio.nombre}`;
  };
  return `
    <form class="bloque" id="formTrat"><h3>Registrar tratamiento</h3>
      <label for="trCita">Cita atendida</label>
      <select id="trCita">${opciones(pendientes, (c) => c.id, texto, citaPreseleccionada)}</select>
      <label for="trDesc">Procedimiento realizado</label><textarea id="trDesc" required></textarea>
      <label for="trProd">Productos o medicamentos usados</label><input id="trProd">
      <label for="trObs">Observaciones</label><input id="trObs">
      <label for="trRec">Recomendaciones para el dueño</label><input id="trRec">
      <button class="btn">Guardar tratamiento</button>
      <p class="ayuda">Al guardar, la cita queda como completada.</p>
      <div class="mensaje"></div>
    </form>`;
}

export default {
  render(usuario, parametros) {
    const esCliente = usuario.rol === "cliente";
    const filtro = `
      <div style="min-width:220px">
        <label for="filtroTipo">Filtrar por tipo de servicio</label>
        <select id="filtroTipo"><option value="">Todos</option>${opciones(CATEGORIAS, (c) => c, (c) => c, filtroCategoria)}</select>
      </div>`;
    const tabla = tablaTratamientos(usuario);
    const cuerpo = esCliente
      ? `<div class="bloque">${tabla}</div>`
      : `<div class="columnas">${formularioTratamiento(usuario, parametros.citaId)}
           <div class="bloque"><h3>Tratamientos registrados</h3>${tabla}</div></div>`;
    return `${encabezado(esCliente ? "Historial de tratamientos" : "Tratamientos",
      "Registro de lo que se hizo en cada servicio, por tipo de servicio.", filtro)}${cuerpo}`;
  },

  montar(raiz) {
    raiz.querySelector("#filtroTipo").addEventListener("change", (evento) => {
      filtroCategoria = evento.target.value;
      refrescar();
    });
    alEnviar(raiz.querySelector("#formTrat"), () => registrarTratamiento({
      citaId: valor("trCita"), descripcion: valor("trDesc"), productos: valor("trProd"),
      observaciones: valor("trObs"), recomendaciones: valor("trRec")
    }), "Tratamiento guardado. La cita quedó completada");
    raiz.onclick = null;
  }
};
