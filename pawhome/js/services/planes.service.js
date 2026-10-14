/**
 * Reglas de negocio de planes y servicios.
 */
import { store } from "../data/store.js";
import { exigir } from "./validacion.js";

export const listarPlanes = () => store.todos("planes");
export const listarServicios = () => store.todos("servicios");
export const obtenerPlan = (id) => store.buscar("planes", id);
export const obtenerServicio = (id) => store.buscar("servicios", id);

/** Servicios que cubre un plan, en el orden en que fueron asignados. */
export function serviciosDelPlan(plan) {
  if (!plan) return [];
  return plan.servicios.map(obtenerServicio).filter(Boolean);
}

export function crearPlan({ nombre, precio, citasMes, descripcion, servicios }) {
  exigir(nombre && precio && citasMes, "Complete nombre, precio y citas al mes.");
  exigir(Number(precio) >= 0, "El precio no puede ser negativo.");
  exigir(Number(citasMes) >= 1, "El plan debe incluir al menos una cita al mes.");
  exigir(servicios.length > 0, "Seleccione al menos un servicio para el plan.");
  return store.agregar("planes", "pl", {
    nombre, descripcion, servicios,
    precio: Number(precio),
    citasMes: Number(citasMes)
  });
}

export function eliminarPlan(planId) {
  const enUso = store.todos("clientes").some((c) => c.planId === planId);
  exigir(!enUso, "No se puede eliminar: hay clientes con este plan.");
  store.eliminar("planes", planId);
}

export function crearServicio({ nombre, categoria, duracion, precio }) {
  exigir(nombre && duracion && precio, "Complete todos los campos del servicio.");
  exigir(Number(duracion) >= 10, "La duración mínima es de 10 minutos.");
  return store.agregar("servicios", "s", {
    nombre, categoria,
    duracion: Number(duracion),
    precio: Number(precio)
  });
}

export function cambiarPlanCliente(clienteId, planId) {
  exigir(obtenerPlan(planId), "El plan seleccionado no existe.");
  return store.actualizar("clientes", clienteId, { planId });
}
