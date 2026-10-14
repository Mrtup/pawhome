/**
 * Pantalla de inicio: resumen con cifras según el rol y próximas citas.
 */
import { esc, fechaTexto, hoy } from "../utils/format.js";
import { encabezado, tablaCitas } from "../ui/components.js";
import { store } from "../data/store.js";
import { citasVisibles, proximasCitas, citasDelMes } from "../services/citas.service.js";
import { obtenerCliente } from "../services/clientes.service.js";
import { obtenerPlan } from "../services/planes.service.js";
import { tratamientosVisibles } from "../services/tratamientos.service.js";

const cifra = (valor, texto) => `<div class="cifra"><b>${esc(valor)}</b><span>${esc(texto)}</span></div>`;

function cifrasDelRol(usuario, proximas) {
  if (usuario.rol === "admin") {
    return [
      cifra(store.todos("clientes").length, "Clientes"),
      cifra(store.todos("mascotas").length, "Mascotas registradas"),
      cifra(proximas.length, "Citas por atender"),
      cifra(store.filtrar("personal", (p) => p.activo).length, "Profesionales activos")
    ];
  }
  if (usuario.rol === "cliente") {
    const cliente = obtenerCliente(usuario.ref);
    const plan = obtenerPlan(cliente.planId);
    return [
      cifra(store.filtrar("mascotas", (m) => m.clienteId === cliente.id).length, "Mis mascotas"),
      cifra(proximas.length, "Próximas citas"),
      cifra(plan ? plan.nombre : "Sin plan", "Plan actual"),
      cifra(`${citasDelMes(cliente.id, hoy())} / ${plan ? plan.citasMes : 0}`, "Citas usadas este mes")
    ];
  }
  const deHoy = citasVisibles(usuario).filter((c) => c.fecha === hoy() && c.estado !== "Cancelada");
  return [
    cifra(deHoy.length, "Citas para hoy"),
    cifra(proximas.length, "Citas por atender"),
    cifra(tratamientosVisibles(usuario).length, "Tratamientos registrados")
  ];
}

export default {
  render(usuario) {
    const proximas = proximasCitas(usuario);
    const nombre = usuario.nombre.split(" ")[0];
    return `
      ${encabezado(`Hola, ${nombre}`, `Este es el resumen de hoy, ${fechaTexto(hoy())}.`)}
      <div class="cifras">${cifrasDelRol(usuario, proximas).join("")}</div>
      <div class="bloque"><h3>Próximas citas</h3>${tablaCitas(proximas)}</div>`;
  },
  montar() {}
};
