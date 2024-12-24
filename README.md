# Proyecto: **Kanteritas - Registro de Interrupciones de Energía Eléctrica**

## Credenciales:

### Credenciales admin:

Usuario admin: chitorlando
Contraseña admin: admin123

### Credenciales clientes:

Usuario: antho.perez.925
Contraseña: fi9cx7vu

Usuario: patricia.andrade.938
Contraseña: pyizeni9

Usuario: luisito.salazar.932
Contraseña: 6v08rm6b
 
### Se pueden crear mas usuarios con un correo al que se tenga acceso para obtener las credenciales.

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

    En este proyecto se decidió no implementar Swagger OpenAPI para la documentación del backend por los siguientes motivos:

    Naturaleza del Backend:

    El backend está diseñado como un servicio interno para soportar la funcionalidad de la aplicación Next.js. No se planea exponer los endpoints a servicios externos ni integrarlos con terceros.
    Simplicidad de la API:

    Los endpoints del backend son relativamente sencillos y están bien organizados en el **sistema de archivos** de Next.js, lo que facilita su comprensión y mantenimiento sin necesidad de una capa adicional de documentación.
    Ecosistema Controlado:

    Tanto el frontend como el backend forman parte del mismo proyecto, y los desarrolladores tienen acceso completo al código fuente. Esto elimina la necesidad de herramientas externas como Swagger para explorar la API.
    Priorización de Recursos:

    Se priorizó la implementación de funcionalidades principales sobre la generación de documentación formal. El tiempo y los recursos se dedicaron a mejorar la experiencia del usuario y las características críticas del sistema.
    
    Alternativas de Documentación:

    En lugar de Swagger, se optó por utilizar comentarios descriptivos en el código fuente y este documento de soporte, lo cual es suficiente dado el alcance del proyecto.

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

### **Actualización de Deploy** 🚀

#### **Infraestructura**

1. **Servidor**:
   - **Proveedor:** DigitalOcean.
   - **Instancia:** Droplet con SO Ubuntu.
   - **Proxy Inverso:** Configuración de Nginx como proxy inverso para enrutar el tráfico hacia la aplicación.
   - **DNS Personalizado:** Configuración del dominio personalizado **chitorlando.com** para acceder a la aplicación.

2. **Software Instalado en el Servidor**:
   - **Node.js:** Entorno de ejecución para JavaScript necesario para ejecutar la aplicación.
   - **Yarn:** Gestor de paquetes para manejar dependencias y scripts.
   - **PM2:** Administrador de procesos para ejecutar la aplicación en modo de producción y asegurar reinicios automáticos en caso de fallos.
   - **Nginx:** Proxy inverso utilizado para manejar las solicitudes HTTP y servir archivos estáticos.
   - **Certbot (Let's Encrypt):** Herramienta para generar y renovar automáticamente certificados SSL/TLS, proporcionando seguridad HTTPS.

---

#### **Gestión de Cambios**

1. **Repositorio de Código Fuente**:
   - **Plataforma:** GitHub.
   - **Acceso:** Configuración de autenticación mediante claves SSH para garantizar una conexión segura al repositorio remoto.

2. **Estrategia de Despliegue**:
   - Sin integración con **GitHub Actions**, ya que no se espera un flujo constante de cambios.
   - Los cambios se implementan manualmente mediante **pull** desde el repositorio remoto en el servidor de producción.

---

#### **Seguridad**

1. **Certificados SSL**:
   - **Proveedor:** Let's Encrypt.
   - **Herramienta de Gestión:** Certbot.
   - **Implementación:** 
     - Generación inicial de certificados para el dominio.
     - Configuración de renovación automática para garantizar la disponibilidad continua de HTTPS.

---

#### **Consideraciones Adicionales**

1. **Escalabilidad**:
   - La configuración actual permite migrar fácilmente a instancias adicionales o servicios de balanceo de carga si la demanda aumenta.

2. **Monitoreo y Logs**:
   - PM2 se utiliza para registrar errores y métricas de rendimiento, facilitando el monitoreo y la solución de problemas en producción.

3. **Documentación y Soporte**:
   - El despliegue sigue buenas prácticas para entornos de producción, con pasos claros para mantenimiento y actualizaciones futuras.

 