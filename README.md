# Proyecto: **Kanteritas - Registro de Interrupciones de Energía Eléctrica**

## Descripción

Este proyecto es una **aplicación web** para gestionar **horarios de interrupción del servicio eléctrico**. Se implementaron dos roles principales: **Administrador** y **Cliente**.

- **Administrador**: Puede gestionar clientes y horarios de interrupción.
- **Cliente**: Puede visualizar horarios y sectores afectados mediante un mapa interactivo.

La solución utiliza NextJS en su totalidad para optimización de tiempo y carga de trabajo debido a las condiciones dadas.

## Tecnologías Utilizadas

- **Framework**: Next.js
- **ORM**: Prisma
- **Base de datos**: PostgreSQL (implementada en **Neon** para facilitar la gestión remota)
- **Mapas**: Leaflet (para visualización de polígonos y coordenadas)
- **Correos**: EmailJS (para envío de credenciales por email)
- **Autenticación**: NextAuth
- **Estilos**: MUI - css


## Flujo de navegación

Desde home a Login, 
en login podemos iniciar sesión, el administrador fué ingresado por bd directa,
el login redirige según el rol del usuario,
los clientes son creados, listados, eliminados o editados desde el dashboard del administrador, 
al momento de ser creados, reciben un correo con su usario y contraseña, los mismos que son 
creados en este momento, el usuario con el nombre + apellido + 3 últimos dígitos de su cédula, la constraseña con asignación aleatoria alfanumérica.

Los horarios son creados, listados, eliminados o editados desde el dashboard del administrador,

Los clientes al ingresar con sus credenciales pueden ver que, según la latitud y longitud ingresados 
si este punto está dentro de un polígono de coordenadas ingresados previamente en un Horario, 
se le muestra la hora de inicio y de fin del corte, a más del mapa mostrando el polígono de su sector y el marcador con su ubicación.
Si su marcador de ubicación no está dentro de un Horario ingresado, se le indica que no hay horario programado para su sector,
a más de listar todos los Horarios ingresados hasta el momento.

### Descripción Técnica del Flujo de la Aplicación

#### **Flujo de Navegación**

1. **Página Principal (`Home`)**:
   - Sirve como punto de entrada para los usuarios.
   - Incluye un botón o enlace para redirigir a la página de inicio de sesión.

2. **Página de Login (`/login`)**:
   - Permite a los usuarios autenticarse mediante sus credenciales.
   - Validación:
     - El administrador es creado directamente en la base de datos.
     - Los clientes son creados por el administrador desde el dashboard.
   - Redirección:
     - Según el rol del usuario autenticado:
       - **Administrador:** Redirigido al dashboard administrativo (`/admin/dashboard`).
       - **Cliente:** Redirigido al dashboard del cliente (`/client/dashboard`).

---

#### **Administración de Usuarios y Horarios**

##### **Dashboard del Administrador (`/admin/dashboard`)**

1. **Gestión de Clientes**:
   - Funcionalidades:
     - Crear, listar, editar y eliminar clientes.
   - Proceso de Creación:
     - Al registrar un cliente, se genera:
       - **Usuario:** Combinación de nombre, apellido y los últimos 3 dígitos de la cédula.
       - **Contraseña:** Generada aleatoriamente con caracteres alfanuméricos.
     - El cliente recibe un correo con su usuario y contraseña.
   - Persistencia:
     - Los datos del cliente se almacenan en la base de datos relacional con un esquema bien definido.

2. **Gestión de Horarios**:
   - Funcionalidades:
     - Crear, listar, editar y eliminar horarios de interrupción eléctrica.
   - Proceso de Creación:
     - Los horarios incluyen:
       - Nombre del sector.
       - Hora de inicio y fin del corte.
       - Coordenadas de un polígono que delimita el sector.
   - Persistencia:
     - Los horarios se registran en la base de datos y se utilizan para consultas geoespaciales.

---

#### **Interacción del Cliente**

##### **Dashboard del Cliente (`/client/dashboard`)**

1. **Detección de Sector**:
   - Al ingresar, se consulta si las coordenadas registradas del cliente están dentro de algún polígono asociado a un horario.
   - Proceso:
     - Las coordenadas del cliente son enviadas al backend.
     - Una función geoespacial verifica si el punto está dentro de un polígono.

2. **Visualización de Información**:
   - Si el cliente está dentro de un polígono:
     - Se muestra:
       - **Hora de inicio y fin del corte.**
       - **Mapa interactivo**:
         - Polígono del sector.
         - Marcador indicando la ubicación del cliente.
   - Si el cliente no está dentro de un polígono:
     - Se muestra un mensaje indicando que no hay cortes programados.
     - También se listan todos los horarios registrados.

---

#### **Esquema Técnico**

1. **Base de Datos**:
   - **Tablas Principales**:
     - `Usuario`: Almacena la información de los usuarios (clientes y administrador).
     - `Cliente`: Contiene información específica de los clientes, como coordenadas.
     - `Horario`: Define los cortes programados con un polígono que delimita el sector.

2. **API**:
   - **Autenticación**:
     - Implementada con `NextAuth`.
     - Incluye roles para administrador y cliente.
   - **Gestión de Datos**:
     - Endpoints para CRUD de clientes y horarios.
   - **Consultas Geoespaciales**:
     - Validación de si un punto (coordenadas del cliente) está dentro de un polígono.

3. **Frontend**:
     - **Tecnologías**:
     - `Next.js` .
     - `MUI` como librería de UI.
   - **Administrador**:
     - Interfaces dinámicas para gestionar usuarios y horarios.
   - **Cliente**:
     - Mapa interactivo con visualización de sectores y cortes programados.

4. **Backend**:
   - **Tecnologías**:
     - `Next.js` para el servidor y API.
     - `Prisma` como ORM para la base de datos.
   - **Lógica Geoespacial**:
     - Algoritmos para verificar si un punto está dentro de un polígono.

---

#### **Características Técnicas Destacadas** 🚀

1. **Generación de Credenciales**:
   - Usuario y contraseña generados automáticamente al registrar un cliente.
   - Correo de notificación enviado al cliente con sus credenciales.

2. **Validación Geoespacial**:
   - Verificación eficiente de pertenencia de un punto a un polígono para determinar el sector del cliente.

3. **Experiencia de Usuario**:
   - Mapas interactivos que ofrecen una visualización clara de los sectores y cortes programados.

4. **Seguridad**:
   - Autenticación robusta con gestión de sesiones y roles.

5. **Escalabilidad**:
   - Arquitectura modular que facilita la extensión de funcionalidades.
 