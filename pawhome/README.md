# PawHome

Aplicativo web para la gestión de servicios integrales para mascotas a domicilio: planes, registro de mascotas, programación de citas, registro de tratamientos y personal responsable.

Proyecto del módulo Gerencia de Proyectos Informáticos, Politécnico Grancolombiano.

## Funciones

| Necesidad | Sección del aplicativo |
|---|---|
| Planes según los servicios que el cliente desea contratar | Planes y servicios |
| Inscripción y registro de mascotas | Clientes y mascotas |
| Programación de citas acorde con el plan y el servicio | Citas |
| Registro de tratamientos por tipo de servicio | Tratamientos |
| Personal responsable de realizar el servicio | Personal |

El aplicativo maneja tres perfiles (administrador, cliente y profesional), cada uno con su propio menú.

## Estructura del proyecto

```
pawhome/
├── index.html              Pantalla de ingreso y estructura general
├── css/
│   ├── base.css            Colores, tipografía y estilos base
│   ├── components.css      Formularios, tablas, tarjetas, estados y avisos
│   └── layout.css          Estructura de la página y diseño adaptable
├── js/
│   ├── main.js             Punto de entrada
│   ├── config/
│   │   └── constants.js    Tipos de servicio, horarios, estados, roles y menús
│   ├── data/
│   │   ├── seed.js         Datos de ejemplo
│   │   └── store.js        Acceso a datos (localStorage)
│   ├── services/           Reglas de negocio
│   │   ├── validacion.js
│   │   ├── auth.service.js
│   │   ├── planes.service.js
│   │   ├── clientes.service.js
│   │   ├── citas.service.js
│   │   ├── tratamientos.service.js
│   │   └── personal.service.js
│   ├── views/              Una vista por sección del menú
│   │   ├── inicio.view.js
│   │   ├── planes.view.js
│   │   ├── clientes.view.js
│   │   ├── citas.view.js
│   │   ├── tratamientos.view.js
│   │   └── personal.view.js
│   ├── ui/
│   │   ├── router.js       Navegación entre secciones
│   │   ├── components.js   Componentes reutilizables
│   │   └── forms.js        Manejo común de formularios
│   └── utils/
│       ├── format.js       Fechas, moneda y texto
│       └── dom.js          Utilidades de la página
└── assets/img/             Logotipo
```

### Cómo se relacionan las capas

```
views  ──>  services  ──>  data/store
  │            │
  └── ui ──────┘ (las vistas usan componentes y el router; los servicios aplican las reglas)
```

- **views**: construyen cada pantalla y reciben las acciones del usuario. No contienen reglas de negocio.
- **services**: validan y aplican las reglas, por ejemplo que el servicio esté incluido en el plan, que no se supere el límite de citas al mes o que el profesional no tenga otra cita a la misma hora. Cuando una regla no se cumple lanzan un `ErrorValidacion`, cuyo mensaje se muestra al usuario.
- **data/store.js**: único módulo que lee y escribe los datos. Para conectar el aplicativo con una API y una base de datos solo se reemplaza este archivo.

## Ejecutar en un computador

El proyecto usa módulos de JavaScript, por lo que debe abrirse a través de un servidor local (no con doble clic sobre `index.html`). Cualquiera de estas opciones sirve:

- Visual Studio Code con la extensión **Live Server**: clic derecho sobre `index.html` y *Open with Live Server*.
- Python: dentro de la carpeta `pawhome`, ejecutar `python -m http.server 8000` y abrir `http://localhost:8000`.
- Node.js: dentro de la carpeta `pawhome`, ejecutar `npx serve` y abrir la dirección que aparece.

## Publicar en GitHub Pages

1. Crear un repositorio público llamado `pawhome`.
2. Subir todo el contenido de esta carpeta (Add file > Upload files) y confirmar con *Commit changes*.
3. En *Settings > Pages*, elegir *Deploy from a branch*, rama `main`, carpeta `/ (root)` y guardar.
4. Después de uno o dos minutos el aplicativo queda disponible en `https://SU-USUARIO.github.io/pawhome/`.

Alternativa: arrastrar la carpeta `pawhome` en https://app.netlify.com/drop.

## Cuentas de prueba

Contraseña para todas: `demo123`

| Perfil | Correo |
|---|---|
| Administrador | admin@pawhome.co |
| Cliente | maria@correo.com |
| Profesional | laura@pawhome.co |

Los datos se guardan en el navegador del equipo. En la sección **Personal** (perfil administrador) el botón *Restablecer datos de demostración* vuelve a cargar los datos de ejemplo.

## Tecnologías

HTML5, CSS3 y JavaScript con módulos ES, sin librerías externas ni proceso de compilación.
