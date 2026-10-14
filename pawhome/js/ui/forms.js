/**
 * Manejo común de formularios: evita repetir en cada vista el mismo
 * patrón de validar, guardar, refrescar la pantalla y avisar al usuario.
 */
import { ErrorValidacion } from "../services/validacion.js";
import { mensajeFormulario, notificar } from "../utils/dom.js";
import { refrescar } from "./router.js";

export function alEnviar(formulario, accion, mensajeExito) {
  if (!formulario) return;
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    ejecutar(() => accion(formulario), mensajeExito, formulario);
  });
}

/** Ejecuta una acción y muestra el resultado; los errores de validación se muestran al usuario. */
export function ejecutar(accion, mensajeExito, formulario = null) {
  try {
    const resultado = accion();
    refrescar();
    notificar(typeof mensajeExito === "function" ? mensajeExito(resultado) : mensajeExito);
  } catch (error) {
    if (!(error instanceof ErrorValidacion)) throw error;
    if (formulario) mensajeFormulario(formulario, error.message);
    else notificar(error.message);
  }
}
