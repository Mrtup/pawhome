/**
 * Personal que presta los servicios a domicilio (solo administrador).
 */
import { CATEGORIAS } from "../config/constants.js";
import { esc } from "../utils/format.js";
import { valor, confirmar, notificar } from "../utils/dom.js";
import { encabezado, opciones, etiquetaEstado } from "../ui/components.js";
import { alEnviar, ejecutar } from "../ui/forms.js";
import { refrescar } from "../ui/router.js";
import { store } from "../data/store.js";
import { listarPersonal, citasPorAtender, crearProfesional, alternarEstado } from "../services/personal.service.js";

function filaProfesional(p) {
  return `
    <tr>
      <td><b>${esc(p.nombre)}</b></td>
      <td>${esc(p.especialidad)}</td>
      <td>${esc(p.telefono)}</td>
      <td>${esc(p.vehiculo)}</td>
      <td>${citasPorAtender(p.id)}</td>
      <td>${etiquetaEstado(p.activo ? "Activo" : "Inactivo", p.activo ? "Completada" : "Cancelada")}</td>
      <td><button class="btn-sec" data-alternar="${p.id}">${p.activo ? "Desactivar" : "Activar"}</button></td>
    </tr>`;
}

export default {
  render() {
    return `
      ${encabezado("Personal", "Profesionales que prestan los servicios a domicilio.")}
      <div class="columnas">
        <form class="bloque" id="formPersonal"><h3>Agregar profesional</h3>
          <label for="peNombre">Nombre completo</label><input id="peNombre" required>
          <label for="peEsp">Especialidad</label><select id="peEsp">${opciones(CATEGORIAS, (c) => c, (c) => c)}</select>
          <label for="peTel">Teléfono</label><input id="peTel" required>
          <label for="peVeh">¿Tiene vehículo para domicilios?</label>
          <select id="peVeh"><option>Sí</option><option>No</option></select>
          <button class="btn">Agregar profesional</button><div class="mensaje"></div>
        </form>
        <div class="bloque"><h3>Equipo</h3>
          <div class="tabla-env"><table>
            <thead><tr><th>Nombre</th><th>Especialidad</th><th>Teléfono</th><th>Vehículo</th><th>Citas por atender</th><th>Estado</th><th></th></tr></thead>
            <tbody>${listarPersonal().map(filaProfesional).join("")}</tbody>
          </table></div>
          <p class="ayuda">Un profesional inactivo no aparece al programar nuevas citas.</p>
          <button class="btn-sec peligro" id="btnReiniciar" style="margin-top:1rem">Restablecer datos de demostración</button>
        </div>
      </div>`;
  },

  montar(raiz) {
    alEnviar(raiz.querySelector("#formPersonal"), () => crearProfesional({
      nombre: valor("peNombre"), especialidad: valor("peEsp"), telefono: valor("peTel"), vehiculo: valor("peVeh")
    }), "Profesional agregado");

    raiz.onclick = (evento) => {
      const boton = evento.target.closest("button");
      if (!boton) return;
      if (boton.dataset.alternar) {
        ejecutar(() => alternarEstado(boton.dataset.alternar),
          (p) => p.activo ? "Profesional activado" : "Profesional desactivado");
      }
      if (boton.id === "btnReiniciar" &&
          confirmar("Se borrarán los cambios y se cargarán los datos de ejemplo. ¿Continuar?")) {
        store.reiniciar();
        refrescar();
        notificar("Datos de demostración restablecidos");
      }
    };
  }
};
