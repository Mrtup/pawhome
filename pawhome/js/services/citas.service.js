/**
 * Reglas de negocio de las citas: qué puede programar cada cliente,
 * con qué profesional y en qué condiciones.
 */
import { store } from "../data/store.js";
import { ESTADOS_CITA, ESTADOS_CERRADOS } from "../config/constants.js";
import { hoy } from "../utils/format.js";
import { exigir } from "./validacion.js";
import { obtenerPlan, obtenerServicio, serviciosDelPlan } from "./planes.service.js";
import { obtenerCliente, obtenerMascota, mascotasDeCliente, mascotasVisibles } from "./clientes.service.js";
import { obtenerProfesional } from "./personal.service.js";

/** Reúne en un solo objeto la cita con su mascota, cliente, servicio y profesional. */
export function detalleCita(cita) {
  const mascota = obtenerMascota(cita.mascotaId) || {};
  return {
    cita,
    mascota,
    cliente: obtenerCliente(mascota.clienteId) || {},
    servicio: obtenerServicio(cita.servicioId) || {},
    profesional: obtenerProfesional(cita.personalId) || {}
  };
}

export function ordenarPorFecha(citas) {
  return [...citas].sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));
}

/** Citas que puede ver el usuario según su rol. */
export function citasVisibles(usuario) {
  if (usuario.rol === "cliente") {
    const ids = mascotasVisibles(usuario).map((m) => m.id);
    return store.filtrar("citas", (c) => ids.includes(c.mascotaId));
  }
  if (usuario.rol === "profesional") {
    return store.filtrar("citas", (c) => c.personalId === usuario.ref);
  }
  return store.todos("citas");
}

export const estaAbierta = (cita) => !ESTADOS_CERRADOS.includes(cita.estado);

export function proximasCitas(usuario) {
  return citasVisibles(usuario).filter((c) => c.fecha >= hoy() && estaAbierta(c));
}

/** Citas no canceladas de todas las mascotas de un cliente en el mes de la fecha dada. */
export function citasDelMes(clienteId, fecha) {
  const mes = fecha.slice(0, 7);
  const ids = mascotasDeCliente(clienteId).map((m) => m.id);
  return store.filtrar("citas", (c) =>
    ids.includes(c.mascotaId) && c.fecha.slice(0, 7) === mes && c.estado !== ESTADOS_CITA.CANCELADA
  ).length;
}

/** Plan y servicios disponibles para una mascota, según el plan de su dueño. */
export function opcionesParaMascota(mascotaId) {
  const mascota = obtenerMascota(mascotaId);
  const cliente = obtenerCliente(mascota.clienteId);
  const plan = obtenerPlan(cliente.planId);
  return { mascota, cliente, plan, servicios: serviciosDelPlan(plan) };
}

export function programarCita({ mascotaId, servicioId, personalId, fecha, hora, direccion, notas }) {
  const { cliente, plan } = opcionesParaMascota(mascotaId);

  exigir(plan, "El cliente no tiene un plan activo. Asigne un plan antes de programar.");
  exigir(servicioId && plan.servicios.includes(servicioId), "El servicio elegido no está incluido en el plan del cliente.");
  exigir(personalId, "No hay un profesional activo para ese servicio.");
  exigir(fecha, "Seleccione la fecha de la cita.");
  exigir(fecha >= hoy(), "La fecha no puede ser anterior a hoy.");
  exigir(direccion, "Escriba la dirección donde se prestará el servicio.");

  exigir(
    citasDelMes(cliente.id, fecha) < plan.citasMes,
    `El plan ${plan.nombre} permite ${plan.citasMes} citas al mes y ya están usadas. Elija otro mes o cambie de plan.`
  );

  const profesionalOcupado = store.todos("citas").some((c) =>
    c.personalId === personalId && c.fecha === fecha && c.hora === hora && c.estado !== ESTADOS_CITA.CANCELADA
  );
  exigir(!profesionalOcupado, "Ese profesional ya tiene una cita a esa hora. Elija otra hora.");

  return store.agregar("citas", "ci", {
    mascotaId, servicioId, personalId, fecha, hora, direccion, notas,
    estado: ESTADOS_CITA.PENDIENTE
  });
}

export function cambiarEstado(citaId, estado) {
  const cita = store.buscar("citas", citaId);
  exigir(cita && estaAbierta(cita), "Esta cita ya no admite cambios.");
  return store.actualizar("citas", citaId, { estado });
}
