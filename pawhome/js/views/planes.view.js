/**
 * Planes y servicios. El administrador crea y elimina; el cliente consulta y cambia de plan.
 */
import { CATEGORIAS } from "../config/constants.js";
import { esc, pesos } from "../utils/format.js";
import { valor, confirmar } from "../utils/dom.js";
import { encabezado, opciones } from "../ui/components.js";
import { alEnviar, ejecutar } from "../ui/forms.js";
import { obtenerCliente } from "../services/clientes.service.js";
import {
  listarPlanes, listarServicios, serviciosDelPlan, crearPlan, eliminarPlan,
  crearServicio, cambiarPlanCliente, obtenerPlan
} from "../services/planes.service.js";

function tarjetaPlan(plan, usuario, planActual) {
  const esMio = plan.id === planActual;
  const servicios = serviciosDelPlan(plan).map((s) => `<li>${esc(s.nombre)}</li>`).join("");
  let botones = "";
  if (usuario.rol === "cliente" && !esMio) botones = `<button class="btn-sec" data-contratar="${plan.id}">Cambiarme a este plan</button>`;
  if (usuario.rol === "admin") botones = `<button class="btn-sec peligro" data-eliminar="${plan.id}">Eliminar</button>`;
  return `
    <div class="plan ${esMio ? "mio" : ""}">
      ${esMio ? '<span class="etiqueta">Tu plan</span>' : ""}
      <h3>${esc(plan.nombre)}</h3>
      <div class="precio">${pesos(plan.precio)} <small>al mes</small></div>
      <p>${esc(plan.descripcion)}</p>
      <b>Hasta ${plan.citasMes} citas al mes</b>
      <ul>${servicios}</ul>
      ${botones}
    </div>`;
}

function tablaServicios() {
  const filas = listarServicios().map((s) =>
    `<tr><td>${esc(s.nombre)}</td><td>${esc(s.categoria)}</td><td>${s.duracion} min</td><td>${pesos(s.precio)}</td></tr>`
  ).join("");
  return `<div class="tabla-env"><table>
    <thead><tr><th>Servicio</th><th>Tipo</th><th>Duración</th><th>Precio por cita</th></tr></thead>
    <tbody>${filas}</tbody></table></div>`;
}

function formulariosAdmin() {
  const chequeos = listarServicios().map((s) =>
    `<label><input type="checkbox" name="plServ" value="${s.id}">${esc(s.nombre)}</label>`).join("");
  return `
    <div class="columnas">
      <form class="bloque" id="formPlan"><h3>Crear plan</h3>
        <label for="plNombre">Nombre del plan</label><input id="plNombre" required>
        <div class="fila">
          <div><label for="plPrecio">Precio mensual (COP)</label><input id="plPrecio" type="number" min="0" required></div>
          <div><label for="plCitas">Citas al mes</label><input id="plCitas" type="number" min="1" required></div>
        </div>
        <label for="plDesc">Descripción</label><input id="plDesc">
        <label>Servicios incluidos</label><div class="chequeos">${chequeos}</div>
        <button class="btn">Guardar plan</button><div class="mensaje"></div>
      </form>
      <form class="bloque" id="formServicio"><h3>Crear servicio</h3>
        <label for="svNombre">Nombre del servicio</label><input id="svNombre" required>
        <label for="svCat">Tipo de servicio</label>
        <select id="svCat">${opciones(CATEGORIAS, (c) => c, (c) => c)}</select>
        <div class="fila">
          <div><label for="svDur">Duración (min)</label><input id="svDur" type="number" min="10" required></div>
          <div><label for="svPrecio">Precio (COP)</label><input id="svPrecio" type="number" min="0" required></div>
        </div>
        <button class="btn">Guardar servicio</button><div class="mensaje"></div>
      </form>
    </div>`;
}

export default {
  render(usuario) {
    const esCliente = usuario.rol === "cliente";
    const planActual = esCliente ? obtenerCliente(usuario.ref).planId : null;
    return `
      ${encabezado(esCliente ? "Planes" : "Planes y servicios",
        "Cada plan define qué servicios puede pedir el cliente y cuántas citas tiene al mes.")}
      <div class="planes" style="margin-bottom:1.25rem">
        ${listarPlanes().map((p) => tarjetaPlan(p, usuario, planActual)).join("")}
      </div>
      <div class="bloque"><h3>Servicios disponibles</h3>${tablaServicios()}</div>
      ${usuario.rol === "admin" ? formulariosAdmin() : ""}`;
  },

  montar(raiz, usuario) {
    alEnviar(raiz.querySelector("#formPlan"), (form) => crearPlan({
      nombre: valor("plNombre"),
      precio: valor("plPrecio"),
      citasMes: valor("plCitas"),
      descripcion: valor("plDesc"),
      servicios: [...form.querySelectorAll("input[name=plServ]:checked")].map((c) => c.value)
    }), "Plan guardado");

    alEnviar(raiz.querySelector("#formServicio"), () => crearServicio({
      nombre: valor("svNombre"), categoria: valor("svCat"), duracion: valor("svDur"), precio: valor("svPrecio")
    }), "Servicio guardado");

    raiz.onclick = (evento) => {
      const boton = evento.target.closest("button");
      if (!boton) return;
      if (boton.dataset.contratar) {
        ejecutar(() => cambiarPlanCliente(usuario.ref, boton.dataset.contratar),
          () => `Ahora tiene el plan ${obtenerPlan(boton.dataset.contratar).nombre}`);
      }
      if (boton.dataset.eliminar && confirmar("¿Eliminar este plan?")) {
        ejecutar(() => eliminarPlan(boton.dataset.eliminar), "Plan eliminado");
      }
    };
  }
};
