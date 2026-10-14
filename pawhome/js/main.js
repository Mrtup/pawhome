/**
 * Punto de entrada del aplicativo PawHome.
 * Conecta la pantalla de ingreso con la sesión y arranca la navegación.
 */
import { ROLES } from "./config/constants.js";
import { $, valor } from "./utils/dom.js";
import { ErrorValidacion } from "./services/validacion.js";
import { iniciarSesion, cerrarSesion } from "./services/auth.service.js";
import { iniciarRouter, navegar } from "./ui/router.js";

function mostrarAplicacion(usuario) {
  $("#nombreUsuario").textContent = usuario.nombre;
  $("#correoUsuario").textContent = usuario.correo;
  $("#rolTexto").textContent = ROLES[usuario.rol];
  $("#vistaIngreso").classList.add("oculto");
  $("#vistaApp").classList.remove("oculto");
  navegar("inicio");
}

function mostrarIngreso() {
  $("#formIngreso").reset();
  $("#vistaApp").classList.add("oculto");
  $("#vistaIngreso").classList.remove("oculto");
}

$("#formIngreso").addEventListener("submit", (evento) => {
  evento.preventDefault();
  const error = $("#errorIngreso");
  try {
    const usuario = iniciarSesion(valor("correo"), $("#clave").value);
    error.classList.add("oculto");
    mostrarAplicacion(usuario);
  } catch (e) {
    if (!(e instanceof ErrorValidacion)) throw e;
    error.textContent = e.message;
    error.classList.remove("oculto");
  }
});

// Las cuentas de prueba llenan el formulario con un toque.
document.querySelectorAll("[data-demo]").forEach((boton) => {
  boton.addEventListener("click", () => {
    $("#correo").value = boton.dataset.demo;
    $("#clave").value = "demo123";
    $("#clave").focus();
  });
});

$("#btnSalir").addEventListener("click", () => {
  cerrarSesion();
  mostrarIngreso();
});

iniciarRouter();
