/**
 * Reglas de negocio del registro de tratamientos.
 */
import { store } from "../data/store.js";
import { ESTADOS_CITA } from "../config/constants.js";
import { hoy } from "../utils/format.js";
import { exigir } from "./validacion.js";
import { citasVisibles, detalleCita, estaAbierta } from "./citas.service.js";

/** Tratamientos visibles para el usuario, filtrados opcionalmente por tipo de servicio. */
export function tratamientosVisibles(usuario, categoria = "") {
  const idsCitas = citasVisibles(usuario).map((c) => c.id);
  return store
    .filtrar("tratamientos", (t) => idsCitas.includes(t.citaId))
    .map((t) => ({ tratamiento: t, ...detalleCita(store.buscar("citas", t.citaId)) }))
    .filter((d) => !categoria || d.servicio.categoria === categoria)
    .sort((a, b) => b.tratamiento.fecha.localeCompare(a.tratamiento.fecha));
}

/** Citas a las que todavía se les puede registrar un tratamiento. */
export function citasPorTratar(usuario) {
  return citasVisibles(usuario).filter(estaAbierta);
}

/** Guarda el tratamiento y deja la cita como completada. */
export function registrarTratamiento({ citaId, descripcion, productos, observaciones, recomendaciones }) {
  const cita = store.buscar("citas", citaId);
  exigir(cita && estaAbierta(cita), "La cita seleccionada ya fue cerrada.");
  exigir(descripcion, "Describa el procedimiento realizado.");
  const tratamiento = store.agregar("tratamientos", "t", {
    citaId, descripcion, productos, observaciones, recomendaciones, fecha: hoy()
  });
  store.actualizar("citas", citaId, { estado: ESTADOS_CITA.COMPLETADA });
  return tratamiento;
}
