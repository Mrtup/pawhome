/**
 * Reglas de negocio de clientes y mascotas.
 */
import { store } from "../data/store.js";
import { exigir, correoValido } from "./validacion.js";

export const listarClientes = () => store.todos("clientes");
export const obtenerCliente = (id) => store.buscar("clientes", id);
export const obtenerMascota = (id) => store.buscar("mascotas", id);
export const mascotasDeCliente = (clienteId) => store.filtrar("mascotas", (m) => m.clienteId === clienteId);

/** El cliente solo ve sus mascotas; el administrador y el profesional ven todas. */
export function mascotasVisibles(usuario) {
  return usuario.rol === "cliente" ? mascotasDeCliente(usuario.ref) : store.todos("mascotas");
}

export function crearCliente({ nombre, correo, telefono, direccion, planId }) {
  exigir(nombre && correo && telefono && direccion, "Complete todos los datos del cliente.");
  exigir(correoValido(correo), "El correo no tiene un formato válido.");
  const repetido = listarClientes().some((c) => c.correo.toLowerCase() === correo.toLowerCase());
  exigir(!repetido, "Ya existe un cliente con ese correo.");
  return store.agregar("clientes", "c", { nombre, correo, telefono, direccion, planId });
}

export function crearMascota({ clienteId, nombre, especie, raza, nacimiento, peso, notas }) {
  exigir(nombre, "Escriba el nombre de la mascota.");
  exigir(obtenerCliente(clienteId), "Seleccione el dueño de la mascota.");
  if (peso) exigir(Number(peso) > 0 && Number(peso) <= 150, "El peso debe estar entre 0,1 y 150 kg.");
  return store.agregar("mascotas", "m", {
    clienteId, nombre, especie, raza, nacimiento, notas,
    peso: peso ? Number(peso) : ""
  });
}
