/**
 * Constantes de configuración del aplicativo.
 * Centralizar estos valores evita repetirlos en las vistas y en los servicios.
 */

export const CLAVE_ALMACENAMIENTO = "pawhome-datos-v1";

export const CATEGORIAS = [
  "Salud", "Vacunación", "Limpieza y estética", "Relajación", "Entrenamiento", "Funerario"
];

export const ESPECIES = ["Perro", "Gato", "Ave", "Roedor", "Reptil", "Otro"];

export const HORAS_ATENCION = [
  "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "14:00", "15:00", "16:00", "17:00", "18:00"
];

export const ESTADOS_CITA = {
  PENDIENTE: "Pendiente",
  CONFIRMADA: "Confirmada",
  EN_CAMINO: "En camino",
  COMPLETADA: "Completada",
  CANCELADA: "Cancelada"
};

/** Estados en los que una cita ya no admite cambios. */
export const ESTADOS_CERRADOS = [ESTADOS_CITA.COMPLETADA, ESTADOS_CITA.CANCELADA];

export const ROLES = {
  admin: "Administrador",
  cliente: "Cliente",
  profesional: "Profesional"
};

/** Secciones del menú disponibles para cada rol: [clave de la vista, texto del menú]. */
export const MENUS = {
  admin: [
    ["inicio", "Inicio"], ["planes", "Planes y servicios"], ["clientes", "Clientes y mascotas"],
    ["citas", "Citas"], ["tratamientos", "Tratamientos"], ["personal", "Personal"]
  ],
  cliente: [
    ["inicio", "Inicio"], ["planes", "Planes"], ["clientes", "Mis mascotas"],
    ["citas", "Mis citas"], ["tratamientos", "Historial"]
  ],
  profesional: [
    ["inicio", "Inicio"], ["citas", "Mi agenda"], ["tratamientos", "Tratamientos"]
  ]
};
