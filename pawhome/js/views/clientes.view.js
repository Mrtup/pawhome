/**
 * Clientes y mascotas. El administrador inscribe clientes y registra mascotas
 * de cualquier cliente; el cliente solo registra y ve las suyas.
 */
import { ESPECIES } from "../config/constants.js";
import { esc, pesos, edad, hoy } from "../utils/format.js";
import { valor } from "../utils/dom.js";
import { encabezado, opciones, vacio } from "../ui/components.js";
import { alEnviar } from "../ui/forms.js";
import { listarPlanes, obtenerPlan } from "../services/planes.service.js";
import {
  listarClientes, obtenerCliente, mascotasVisibles, mascotasDeCliente, crearCliente, crearMascota
} from "../services/clientes.service.js";

function fichaMascota(mascota, mostrarDueno) {
  const dueno = obtenerCliente(mascota.clienteId) || {};
  return `
    <div class="ficha">
      <div class="placa">${esc(mascota.nombre[0] || "?")}</div>
      <div>
        <b>${esc(mascota.nombre)}</b>
        <small>${esc(mascota.especie)} · ${esc(mascota.raza || "Sin raza")}</small>
        <small>${edad(mascota.nacimiento)} · ${mascota.peso ? esc(mascota.peso) + " kg" : "Peso sin dato"}</small>
        ${mostrarDueno ? `<small>Dueño: ${esc(dueno.nombre)}</small>` : ""}
        ${mascota.notas ? `<small>Nota: ${esc(mascota.notas)}</small>` : ""}
      </div>
    </div>`;
}

function formularioMascota(esAdmin) {
  return `
    <form class="bloque" id="formMascota"><h3>Registrar mascota</h3>
      ${esAdmin ? `<label for="maCliente">Dueño</label>
        <select id="maCliente">${opciones(listarClientes(), (c) => c.id, (c) => c.nombre)}</select>` : ""}
      <label for="maNombre">Nombre</label><input id="maNombre" required>
      <div class="fila">
        <div><label for="maEspecie">Especie</label><select id="maEspecie">${opciones(ESPECIES, (e) => e, (e) => e)}</select></div>
        <div><label for="maRaza">Raza</label><input id="maRaza"></div>
      </div>
      <div class="fila">
        <div><label for="maNac">Fecha de nacimiento</label><input id="maNac" type="date" max="${hoy()}"></div>
        <div><label for="maPeso">Peso (kg)</label><input id="maPeso" type="number" step="0.1" min="0"></div>
      </div>
      <label for="maNotas">Observaciones para el profesional</label>
      <textarea id="maNotas" placeholder="Alergias, comportamiento, cuidados especiales"></textarea>
      <button class="btn">Registrar mascota</button><div class="mensaje"></div>
    </form>`;
}

function seccionClientes() {
  const filas = listarClientes().map((c) => `
    <tr>
      <td>${esc(c.nombre)}<br><small>${esc(c.direccion)}</small></td>
      <td>${esc(c.correo)}<br><small>${esc(c.telefono)}</small></td>
      <td>${esc(obtenerPlan(c.planId)?.nombre || "Sin plan")}</td>
      <td>${mascotasDeCliente(c.id).length}</td>
    </tr>`).join("");
  return `
    <div class="columnas">
      <form class="bloque" id="formCliente"><h3>Inscribir cliente</h3>
        <label for="clNombre">Nombre completo</label><input id="clNombre" required>
        <label for="clCorreo">Correo electrónico</label><input id="clCorreo" type="email" required>
        <label for="clTel">Teléfono</label><input id="clTel" required>
        <label for="clDir">Dirección del domicilio</label><input id="clDir" required>
        <label for="clPlan">Plan contratado</label>
        <select id="clPlan">${opciones(listarPlanes(), (p) => p.id, (p) => `${p.nombre} (${pesos(p.precio)})`)}</select>
        <button class="btn">Inscribir cliente</button><div class="mensaje"></div>
      </form>
      <div class="bloque"><h3>Clientes inscritos</h3>
        <div class="tabla-env"><table>
          <thead><tr><th>Nombre</th><th>Contacto</th><th>Plan</th><th>Mascotas</th></tr></thead>
          <tbody>${filas}</tbody>
        </table></div>
      </div>
    </div>`;
}

export default {
  render(usuario) {
    const esAdmin = usuario.rol === "admin";
    const fichas = mascotasVisibles(usuario).map((m) => fichaMascota(m, esAdmin)).join("")
      || vacio("Todavía no hay mascotas registradas.");
    return `
      ${encabezado(esAdmin ? "Clientes y mascotas" : "Mis mascotas",
        esAdmin ? "Inscriba clientes y registre sus mascotas." : "Registre a sus mascotas para poder pedirles citas.")}
      ${esAdmin ? seccionClientes() : ""}
      <div class="columnas">
        ${formularioMascota(esAdmin)}
        <div class="bloque"><h3>Mascotas registradas</h3><div class="fichas">${fichas}</div></div>
      </div>`;
  },

  montar(raiz, usuario) {
    alEnviar(raiz.querySelector("#formCliente"), () => crearCliente({
      nombre: valor("clNombre"), correo: valor("clCorreo"), telefono: valor("clTel"),
      direccion: valor("clDir"), planId: valor("clPlan")
    }), "Cliente inscrito");

    alEnviar(raiz.querySelector("#formMascota"), () => crearMascota({
      clienteId: usuario.rol === "cliente" ? usuario.ref : valor("maCliente"),
      nombre: valor("maNombre"), especie: valor("maEspecie"), raza: valor("maRaza"),
      nacimiento: valor("maNac"), peso: valor("maPeso"), notas: valor("maNotas")
    }), "Mascota registrada");

    raiz.onclick = null;
  }
};
