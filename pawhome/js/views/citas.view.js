/**
 * Citas. El administrador y el cliente programan y cancelan;
 * el profesional ve su agenda, avisa que va en camino y pasa a registrar el tratamiento.
 */
import { HORAS_ATENCION, ESTADOS_CITA } from "../config/constants.js";
import { hoy } from "../utils/format.js";
import { valor, confirmar, $ } from "../utils/dom.js";
import { encabezado, opciones, tablaCitas, vacio } from "../ui/components.js";
import { alEnviar, ejecutar } from "../ui/forms.js";
import { navegar } from "../ui/router.js";
import { mascotasVisibles, obtenerCliente } from "../services/clientes.service.js";
import { profesionalesDisponibles } from "../services/personal.service.js";
import { obtenerServicio } from "../services/planes.service.js";
import {
  citasVisibles, estaAbierta, opcionesParaMascota, citasDelMes, programarCita, cambiarEstado
} from "../services/citas.service.js";

function botonesAccion(usuario) {
  return (cita) => {
    if (!estaAbierta(cita)) return "";
    const b = [];
    if (usuario.rol === "admin" && cita.estado === ESTADOS_CITA.PENDIENTE)
      b.push(`<button class="btn-sec" data-estado="${ESTADOS_CITA.CONFIRMADA}" data-cita="${cita.id}">Confirmar</button>`);
    if (usuario.rol === "profesional" && cita.estado !== ESTADOS_CITA.EN_CAMINO)
      b.push(`<button class="btn-sec" data-estado="${ESTADOS_CITA.EN_CAMINO}" data-cita="${cita.id}">Voy en camino</button>`);
    if (usuario.rol === "profesional")
      b.push(`<button class="btn-sec" data-tratar="${cita.id}">Registrar tratamiento</button>`);
    if (usuario.rol !== "profesional")
      b.push(`<button class="btn-sec peligro" data-estado="${ESTADOS_CITA.CANCELADA}" data-cita="${cita.id}">Cancelar</button>`);
    return b.join("");
  };
}

function formularioCita(usuario) {
  const mascotas = mascotasVisibles(usuario);
  if (!mascotas.length) {
    return `<form class="bloque" id="formCita"><h3>Programar cita</h3>
      ${vacio("Primero registre una mascota en la sección de mascotas.")}</form>`;
  }
  const texto = (m) => usuario.rol === "admin" ? `${m.nombre} (${obtenerCliente(m.clienteId)?.nombre})` : m.nombre;
  return `
    <form class="bloque" id="formCita"><h3>Programar cita</h3>
      <label for="ciMascota">Mascota</label>
      <select id="ciMascota">${opciones(mascotas, (m) => m.id, texto)}</select>
      <p class="ayuda" id="ciPlanInfo"></p>
      <label for="ciServicio">Servicio</label><select id="ciServicio"></select>
      <label for="ciPersonal">Profesional responsable</label><select id="ciPersonal"></select>
      <div class="fila">
        <div><label for="ciFecha">Fecha</label><input id="ciFecha" type="date" min="${hoy()}" required></div>
        <div><label for="ciHora">Hora</label><select id="ciHora">${opciones(HORAS_ATENCION, (h) => h, (h) => h)}</select></div>
      </div>
      <label for="ciDir">Dirección del servicio</label><input id="ciDir" required>
      <label for="ciNotas">Indicaciones para el profesional</label><input id="ciNotas" placeholder="Opcional">
      <button class="btn">Programar cita</button><div class="mensaje"></div>
    </form>`;
}

/** Ajusta servicios, profesionales y dirección cuando cambia la mascota elegida. */
function actualizarSegunMascota() {
  const { cliente, plan, servicios } = opcionesParaMascota(valor("ciMascota"));
  $("#ciPlanInfo").textContent = plan
    ? `Plan ${plan.nombre}: ${citasDelMes(cliente.id, hoy())} de ${plan.citasMes} citas usadas este mes.`
    : "El cliente no tiene un plan activo.";
  const anterior = valor("ciServicio");
  $("#ciServicio").innerHTML = opciones(servicios, (s) => s.id, (s) => `${s.nombre} (${s.categoria})`, anterior);
  $("#ciDir").value = cliente.direccion;
  actualizarProfesionales();
}

function actualizarProfesionales() {
  const servicio = obtenerServicio(valor("ciServicio"));
  const lista = servicio ? profesionalesDisponibles(servicio.categoria) : [];
  $("#ciPersonal").innerHTML = lista.length
    ? opciones(lista, (p) => p.id, (p) => `${p.nombre} (${p.especialidad})`)
    : `<option value="">No hay personal disponible para este servicio</option>`;
}

export default {
  render(usuario) {
    const tabla = tablaCitas(citasVisibles(usuario), botonesAccion(usuario));
    if (usuario.rol === "profesional") {
      return `${encabezado("Mi agenda", "Citas asignadas a usted, ordenadas por fecha.")}
        <div class="bloque">${tabla}</div>`;
    }
    return `
      ${encabezado(usuario.rol === "cliente" ? "Mis citas" : "Citas",
        "Solo aparecen los servicios que cubre el plan del cliente y el personal de esa especialidad.")}
      <div class="columnas">
        ${formularioCita(usuario)}
        <div class="bloque"><h3>Citas programadas</h3>${tabla}</div>
      </div>`;
  },

  montar(raiz) {
    if (raiz.querySelector("#ciMascota")) {
      actualizarSegunMascota();
      $("#ciMascota").addEventListener("change", actualizarSegunMascota);
      $("#ciServicio").addEventListener("change", actualizarProfesionales);
      alEnviar(raiz.querySelector("#formCita"), () => programarCita({
        mascotaId: valor("ciMascota"), servicioId: valor("ciServicio"), personalId: valor("ciPersonal"),
        fecha: valor("ciFecha"), hora: valor("ciHora"), direccion: valor("ciDir"), notas: valor("ciNotas")
      }), "Cita programada");
    }

    raiz.onclick = (evento) => {
      const boton = evento.target.closest("button");
      if (!boton) return;
      if (boton.dataset.tratar) return navegar("tratamientos", { citaId: boton.dataset.tratar });
      if (boton.dataset.estado) {
        const nuevo = boton.dataset.estado;
        if (nuevo === ESTADOS_CITA.CANCELADA && !confirmar("¿Cancelar esta cita?")) return;
        ejecutar(() => cambiarEstado(boton.dataset.cita, nuevo), `Cita ${nuevo.toLowerCase()}`);
      }
    };
  }
};
