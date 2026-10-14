/**
 * Inicio y cierre de sesión. Mantiene en memoria el usuario que ingresó.
 */
import { store } from "../data/store.js";
import { exigir } from "./validacion.js";

let usuarioActual = null;

export function iniciarSesion(correo, clave) {
  const usuario = store.todos("usuarios").find(
    (u) => u.correo.toLowerCase() === correo.toLowerCase() && u.clave === clave
  );
  exigir(usuario, "Correo o contraseña incorrectos. Revise los datos e intente de nuevo.");
  usuarioActual = usuario;
  return usuario;
}

export function cerrarSesion() {
  usuarioActual = null;
}

export function obtenerUsuario() {
  return usuarioActual;
}
