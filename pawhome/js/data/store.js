/**
 * Capa de acceso a datos.
 * Guarda la información en el localStorage del navegador. Si el navegador
 * no lo permite, los datos se conservan en memoria mientras la página esté abierta.
 * Ningún otro módulo toca localStorage directamente: todos pasan por aquí,
 * lo que permite cambiar más adelante este archivo por llamadas a una API
 * sin modificar los servicios ni las vistas.
 */
import { CLAVE_ALMACENAMIENTO } from "../config/constants.js";
import { datosIniciales } from "./seed.js";

let datos = cargar();

function cargar() {
  try {
    const guardado = localStorage.getItem(CLAVE_ALMACENAMIENTO);
    if (guardado) return JSON.parse(guardado);
  } catch (error) {
    console.warn("No fue posible leer los datos guardados:", error);
  }
  return datosIniciales();
}

function persistir() {
  try {
    localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(datos));
  } catch (error) {
    console.warn("No fue posible guardar los datos; se mantienen en memoria.", error);
  }
}

export const store = {
  /** Lista completa de una colección (planes, citas, mascotas...). */
  todos(coleccion) {
    return datos[coleccion];
  },

  buscar(coleccion, id) {
    return datos[coleccion].find((registro) => registro.id === id) || null;
  },

  filtrar(coleccion, condicion) {
    return datos[coleccion].filter(condicion);
  },

  /** Agrega un registro generando su identificador con el prefijo indicado. */
  agregar(coleccion, prefijo, registro) {
    datos.secuencia += 1;
    const nuevo = { id: prefijo + datos.secuencia, ...registro };
    datos[coleccion].push(nuevo);
    persistir();
    return nuevo;
  },

  /** Actualiza los campos indicados de un registro existente. */
  actualizar(coleccion, id, cambios) {
    const registro = this.buscar(coleccion, id);
    if (!registro) return null;
    Object.assign(registro, cambios);
    persistir();
    return registro;
  },

  eliminar(coleccion, id) {
    datos[coleccion] = datos[coleccion].filter((registro) => registro.id !== id);
    persistir();
  },

  /** Borra los cambios y vuelve a cargar los datos de ejemplo. */
  reiniciar() {
    datos = datosIniciales();
    persistir();
  }
};
