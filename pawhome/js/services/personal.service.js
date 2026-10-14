/**
 * Reglas de negocio del personal que presta los servicios.
 */
import { store } from "../data/store.js";
import { ESTADOS_CERRADOS } from "../config/constants.js";
import { exigir } from "./validacion.js";

export const listarPersonal = () => store.todos("personal");
export const obtenerProfesional = (id) => store.buscar("personal", id);

/** Profesionales activos cuya especialidad coincide con el tipo de servicio. */
export function profesionalesDisponibles(categoria) {
  return store.filtrar("personal", (p) => p.activo && p.especialidad === categoria);
}

export function citasPorAtender(profesionalId) {
  return store.filtrar("citas", (c) => c.personalId === profesionalId && !ESTADOS_CERRADOS.includes(c.estado)).length;
}

export function crearProfesional({ nombre, especialidad, telefono, vehiculo }) {
  exigir(nombre && telefono, "Complete nombre y teléfono.");
  return store.agregar("personal", "p", { nombre, especialidad, telefono, vehiculo, activo: true });
}

/** Activa o desactiva un profesional. Devuelve el registro actualizado. */
export function alternarEstado(profesionalId) {
  const profesional = obtenerProfesional(profesionalId);
  return store.actualizar("personal", profesionalId, { activo: !profesional.activo });
}
