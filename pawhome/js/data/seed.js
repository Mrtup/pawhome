/**
 * Datos de ejemplo con los que arranca el aplicativo.
 * La estructura sigue las entidades del modelo entidad-relación del proyecto
 * (plan, servicio, profesional, cliente, mascota, cita y tratamiento).
 * Las fechas de las citas se calculan respecto al día actual para que
 * siempre haya citas pasadas y próximas.
 */
import { fechaRelativa } from "../utils/format.js";

export function datosIniciales() {
  return {
    secuencia: 100,

    servicios: [
      { id: "s1", nombre: "Consulta veterinaria general", categoria: "Salud", duracion: 45, precio: 70000 },
      { id: "s2", nombre: "Vacunación", categoria: "Vacunación", duracion: 30, precio: 55000 },
      { id: "s3", nombre: "Baño y corte", categoria: "Limpieza y estética", duracion: 90, precio: 60000 },
      { id: "s4", nombre: "Limpieza dental y de oídos", categoria: "Limpieza y estética", duracion: 40, precio: 50000 },
      { id: "s5", nombre: "Masaje de relajación", categoria: "Relajación", duracion: 40, precio: 45000 },
      { id: "s6", nombre: "Sesión de entrenamiento", categoria: "Entrenamiento", duracion: 60, precio: 65000 },
      { id: "s7", nombre: "Acompañamiento funerario", categoria: "Funerario", duracion: 120, precio: 250000 }
    ],

    planes: [
      { id: "pl1", nombre: "Básico", precio: 59900, citasMes: 2, servicios: ["s1", "s2", "s3"],
        descripcion: "Lo esencial para mantener a tu mascota sana y limpia." },
      { id: "pl2", nombre: "Bienestar", precio: 119900, citasMes: 4, servicios: ["s1", "s2", "s3", "s4", "s5"],
        descripcion: "Salud, higiene y relajación en casa todos los meses." },
      { id: "pl3", nombre: "Integral", precio: 189900, citasMes: 8, servicios: ["s1", "s2", "s3", "s4", "s5", "s6", "s7"],
        descripcion: "Todos los servicios, incluidos entrenamiento y acompañamiento funerario." }
    ],

    personal: [
      { id: "p1", nombre: "Laura Méndez", especialidad: "Salud", telefono: "3104567890", vehiculo: "Sí", activo: true },
      { id: "p2", nombre: "Andrés Rojas", especialidad: "Vacunación", telefono: "3157894561", vehiculo: "Sí", activo: true },
      { id: "p3", nombre: "Camila Torres", especialidad: "Limpieza y estética", telefono: "3001237896", vehiculo: "Sí", activo: true },
      { id: "p4", nombre: "Sofía Ríos", especialidad: "Relajación", telefono: "3209876543", vehiculo: "No", activo: true },
      { id: "p5", nombre: "Julián Pardo", especialidad: "Entrenamiento", telefono: "3112223344", vehiculo: "Sí", activo: true },
      { id: "p6", nombre: "Hernán Castillo", especialidad: "Funerario", telefono: "3185556677", vehiculo: "Sí", activo: true }
    ],

    clientes: [
      { id: "c1", nombre: "María Fernanda López", correo: "maria@correo.com", telefono: "3014445566",
        direccion: "Calle 134 # 19-25, Bogotá", planId: "pl2" },
      { id: "c2", nombre: "Carlos Gómez", correo: "carlos@correo.com", telefono: "3126667788",
        direccion: "Carrera 50 # 80-12, Bogotá", planId: "pl1" }
    ],

    mascotas: [
      { id: "m1", clienteId: "c1", nombre: "Luna", especie: "Perro", raza: "Criolla", nacimiento: "2021-03-14", peso: 12.5,
        notas: "Le dan miedo los ruidos fuertes." },
      { id: "m2", clienteId: "c1", nombre: "Michi", especie: "Gato", raza: "Siamés", nacimiento: "2019-08-02", peso: 4.2, notas: "" },
      { id: "m3", clienteId: "c2", nombre: "Rocky", especie: "Perro", raza: "Bulldog francés", nacimiento: "2022-11-20", peso: 11,
        notas: "Alergia al pollo." }
    ],

    citas: [
      { id: "ci1", mascotaId: "m1", servicioId: "s1", personalId: "p1", fecha: fechaRelativa(-12), hora: "09:00",
        direccion: "Calle 134 # 19-25, Bogotá", estado: "Completada", notas: "" },
      { id: "ci2", mascotaId: "m2", servicioId: "s4", personalId: "p3", fecha: fechaRelativa(-5), hora: "15:00",
        direccion: "Calle 134 # 19-25, Bogotá", estado: "Completada", notas: "" },
      { id: "ci3", mascotaId: "m1", servicioId: "s2", personalId: "p2", fecha: fechaRelativa(2), hora: "10:00",
        direccion: "Calle 134 # 19-25, Bogotá", estado: "Confirmada", notas: "Tocar el timbre dos veces." },
      { id: "ci4", mascotaId: "m3", servicioId: "s1", personalId: "p1", fecha: fechaRelativa(1), hora: "11:00",
        direccion: "Carrera 50 # 80-12, Bogotá", estado: "Pendiente", notas: "" },
      { id: "ci5", mascotaId: "m2", servicioId: "s1", personalId: "p1", fecha: fechaRelativa(0), hora: "16:00",
        direccion: "Calle 134 # 19-25, Bogotá", estado: "Confirmada", notas: "" }
    ],

    tratamientos: [
      { id: "t1", citaId: "ci1", fecha: fechaRelativa(-12),
        descripcion: "Revisión general: auscultación, temperatura y palpación abdominal. Estado de salud bueno.",
        productos: "Desparasitante oral (1 tableta)", observaciones: "Peso estable, buena hidratación.",
        recomendaciones: "Repetir desparasitación en 3 meses." },
      { id: "t2", citaId: "ci2", fecha: fechaRelativa(-5),
        descripcion: "Limpieza dental superficial y limpieza de ambos oídos.",
        productos: "Gel dental enzimático, solución ótica", observaciones: "Leve acumulación de sarro en molares.",
        recomendaciones: "Cepillado tres veces por semana." }
    ],

    usuarios: [
      { correo: "admin@pawhome.co", clave: "demo123", rol: "admin", nombre: "Administración PawHome" },
      { correo: "maria@correo.com", clave: "demo123", rol: "cliente", nombre: "María Fernanda López", ref: "c1" },
      { correo: "laura@pawhome.co", clave: "demo123", rol: "profesional", nombre: "Laura Méndez", ref: "p1" }
    ]
  };
}
