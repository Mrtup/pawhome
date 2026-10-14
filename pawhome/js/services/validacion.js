/**
 * Error propio de las reglas de negocio. Las vistas lo capturan y muestran
 * su mensaje al usuario; cualquier otro tipo de error se trata como falla interna.
 */
export class ErrorValidacion extends Error {
  constructor(mensaje) {
    super(mensaje);
    this.name = "ErrorValidacion";
  }
}

/** Lanza un ErrorValidacion con el mensaje dado si la condición no se cumple. */
export function exigir(condicion, mensaje) {
  if (!condicion) throw new ErrorValidacion(mensaje);
}

export const correoValido = (correo) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(correo);
