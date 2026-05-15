# Estelar — Sistema de Gestión y Venta de Boletas 
Plataforma web progresiva para la venta, gestión y validación de boletas para eventos. Construida con una arquitectura de API centralizada usando ASP.NET Core, Laravel, React, PostgreSQL y MongoDB.

---

## Tabla de Contenidos

- [Visión General](#vision-general)
- [Arquitectura](#arquitectura)
- [Aplicaciones](#aplicaciones)
- [Backend](#backend)
- [Bases de Datos](#bases-de-datos)
- [Servicios de Soporte](#servicios-de-soporte)
- [Seguridad](#seguridad)
- [Comunicación entre Capas](#comunicacion-entre-capas)
- [Flujo de Compra Online](#flujo-de-compra-online)
- [Flujo de Venta en Taquilla](#flujo-de-venta-en-taquilla)
- [Flujo de Validación en Puerta](#flujo-de-validacion-en-puerta)
- [Tecnologías Utilizadas](#tecnologias-utilizadas)
- [Repositorios](#repositorios)
- [Equipo](#equipo)

---

## Visión General

Estelar es la plataforma propia para reemplazar servicios externos como TuBoleta, eliminando comisiones por terceros y dando control total sobre ventas, clientes y acceso al recinto.

El sistema está compuesto por cuatro aplicaciones web progresivas independientes, una API REST centralizada en ASP.NET Core que concentra toda la lógica de negocio, una base de datos PostgreSQL diseñada manualmente, MongoDB para logs operativos, y servicios externos para pagos, notificaciones y automatización de flujos.

---

## Arquitectura

El sistema sigue una arquitectura de API centralizada con múltiples frontends desacoplados. Cada frontend es una PWA independiente que consume la misma API REST según el dominio funcional de su usuario. La autenticación es transversal: la API emite tokens JWT que todas las aplicaciones utilizan para autenticar cada petición.

Laravel no se conecta a la base de datos ni contiene lógica de negocio. Su único rol es servir el HTML inicial con React montado. Toda la lógica, validaciones y acceso a datos ocurre en la API de ASP.NET Core.

---

## Aplicaciones

Cada aplicación es una PWA independiente con su propio branding, subdominio y Service Worker. Todas consumen la misma API REST con el token JWT en el header de autorización.

---

### PWA Publica — Taquilla Virtual del Público

**Usuarios:** Clientes finales **Rol:** customer

La cara principal en internet. Cualquier visitante puede explorar la cartelera, pero para comprar debe crear una cuenta.

|Funcionalidad|Módulo de API|
|---|---|
|Exploración de cartelera sin login|Events Module|
|Registro con correo y contraseña|Auth Module|
|Login con Google (OAuth 2.0)|Auth Module|
|Compra de boletas con Mercado Pago|Tickets Module|
|Mi Perfil — datos personales y foto|Auth Module|
|Mis Compras — historial de boletas pasadas y futuras|Tickets Module|
|Mis Entradas — descarga y visualización de QR|Tickets Module|
|Mis Favoritos — eventos guardados|Events Module|
|Notificación por correo al modificar evento favorito|Events Module via n8n|
|PQRS — envío y seguimiento de solicitudes|PQRS Module|
|Chatbot de asistencia|Chatbot Service|

---

### PWA Admin — Panel de Administración

**Usuarios:** Administradores  **Rol:** admin

Portal privado de gestión total del sistema. Acceso exclusivo mediante usuario y contraseña.

|Funcionalidad|Módulo de API|
|---|---|
|Login con usuario y contraseña|Auth Module|
|Crear y gestionar eventos completos|Events Module|
|Configurar fechas de apertura y cierre de venta|Events Module|
|Definir precios y categorías de boleta por evento|Events Module|
|Subir pósters e imágenes del evento|Events Module|
|Gestión de PQRS — leer, responder y gestionar solicitudes|PQRS Module|
|Crear y gestionar empleados|Auth Module|
|Asignar permisos por aplicación a cada empleado|Auth Module|
|Dashboard de métricas y estadísticas|Reports Module|
|Registro de auditoría del sistema|Reports Module|

El administrador puede asignarle acceso a un empleado únicamente a Taquilla, únicamente a Acceso, o a ambas. Un empleado con acceso a Taquilla no puede ingresar al portal de Acceso y viceversa, a menos que el administrador lo autorice explícitamente.

---

### PWA Taquilla — Punto de Venta Presencial

**Usuarios:** Empleados vendedores **Rol:** seller

Sistema para la venta presencial en la ventanilla física.

|Funcionalidad|Módulo de API|
|---|---|
|Login con usuario y contraseña|Auth Module|
|Buscar cliente por correo electrónico o cédula|Auth Module|
|Seleccionar evento y cantidad de boletas|Events Module|
|Registrar venta presencial|Tickets Module|
|Imprimir ticket físico con QR y código de barras|Tickets Module|
|Boleta cargada automáticamente en la cuenta del cliente|Automático por user_id|

Si el cliente no tiene cuenta, se registra su correo y nombre en la boleta. Si en el futuro ese cliente crea una cuenta con ese mismo correo, las boletas quedan asociadas automáticamente a su perfil.

---

### PWA Acceso — Control de Entrada al Teatro

**Usuarios:** Personal de portería **Rol:** scanner

Portal exclusivo para el control de ingreso el día del evento.

|Funcionalidad|Módulo de API|
|---|---|
|Login con usuario y contraseña|Auth Module|
|Escaneo de QR con cámara o lector físico|Tickets Module|
|Verificación de autenticidad del QR|Tickets Module|
|Verificación de estado del ticket|Tickets Module|
|Indicación inmediata de ubicación y puesto del cliente|Tickets Module|
|Alerta de boleta falsa o QR ya utilizado|Tickets Module|
|Conteo de ingresos en tiempo real|Reports Module|

---

## Backend

### ASP.NET Core 10 Web API

Único backend del sistema. Centraliza toda la lógica de negocio, autenticación, generación de QR, integración con Mercado Pago, publicación de eventos hacia n8n y escritura de logs en MongoDB.

---

#### Auth Module

Gestiona toda la identidad del sistema. Es el único módulo que emite tokens JWT y el único que tiene acceso a los datos de usuarios y empleados.

Responsabilidades: registro de usuarios con correo y contraseña, login con Google via OAuth 2.0, autenticación de empleados y administradores, emisión de JWT con rol y permisos del usuario, invalidación de tokens en logout, recuperación de contraseña via n8n, gestión de foto de perfil, creación y desactivación de empleados por parte del admin, y asignación granular de permisos por portal a cada empleado.

Roles manejados: customer, seller, scanner, admin.

---

#### Events Module

Gestiona toda la información de los eventos del teatro y el control de disponibilidad de boletas.

Responsabilidades: CRUD completo de eventos con nombre, descripción, fecha, lugar, imagen y estado, configuración de fecha y hora de apertura y cierre de venta, gestión de categorías de boleta por evento con precio y aforo por categoría, control de stock en tiempo real, gestión de favoritos por usuario, y notificación automática via n8n a los usuarios que tienen en favoritos un evento que fue modificado.

---

#### Tickets Module

Núcleo operativo del sistema. Gestiona todo el ciclo de vida de una boleta desde su creación hasta su uso en puerta.

Responsabilidades: compra de boletas con verificación de aforo disponible, integración con Mercado Pago para pagos online, asignación de puesto al momento de la compra, generación de QR firmado criptográficamente por boleta, generación de PDF del ticket físico para impresión en taquilla con QR y código de barras, venta presencial por empleados con registro del vendedor, y validación de QR en puerta con verificación de firma, estado del ticket e indicación del puesto asignado.

---

#### PQRS Module

Canal de comunicación entre los clientes y la administración del teatro.

Responsabilidades: creación de solicitudes por parte del cliente (Pregunta, Queja, Reclamo o Sugerencia), consulta del estado de la solicitud y lectura de respuestas desde la PWA Publica, gestión y respuesta de solicitudes desde el panel admin, y notificación al cliente via n8n cuando el admin responde.

Estados de una solicitud: pendiente, en gestión, resuelto, cerrado.

---

#### Reports Module

Módulo de inteligencia de negocio para el administrador del teatro.

Responsabilidades: ventas de boletas por semana o rango de fechas personalizado, usuarios registrados por período, índice de ocupación del teatro por evento (boletas vendidas vs aforo total), ventas por categoría de boleta y por evento, conteo de ingresos validados en tiempo real, y registro de auditoría completo de todas las operaciones críticas del sistema.

Las métricas se ampliarán en conjunto con el cliente conforme evolucione el proyecto.

---

#### Middleware Transversal

|Middleware|Función|
|---|---|
|JWT Validation|Valida firma y expiración del token en cada request|
|Permission Authorization|Verifica rol y permisos del JWT según el portal y endpoint solicitado|
|Rate Limiting|Limita intentos por IP en endpoints sensibles|
|Audit Logger|Registra automáticamente cada operación crítica en MongoDB|

---

## Bases de Datos

### PostgreSQL 16 — Base de Datos Principal

#### Justificación del Enfoque Database-First

Se optó por diseñar el esquema manualmente en PostgreSQL y generar los modelos C# mediante scaffold de Entity Framework Core. Este enfoque da control total sobre tipos de datos nativos, índices, constraints y relaciones sin depender de decisiones automáticas del ORM. Es el enfoque utilizado en equipos donde el diseño de base de datos es una responsabilidad separada del desarrollo de la aplicación.

#### Justificación de PostgreSQL

PostgreSQL no requiere licencia comercial, tiene soporte completo en Entity Framework Core, es ampliamente soportado en entornos de despliegue y su rendimiento es comparable al de SQL Server para este tipo de carga.

#### Tablas del Sistema

|Tabla|Descripción|
|---|---|
|users|Usuarios del sistema con email, contraseña hasheada, google_id, foto de perfil, rol y permisos|
|events|Información del evento: nombre, descripción, fecha, imagen, fechas de apertura y cierre de venta|
|ticket_categories|Tipos de boleta por evento (VIP, palco, general) con precio y aforo por categoría|
|seats|Asientos o ubicaciones por categoría con código de fila y número|
|tickets|Boletas emitidas con QR token, comprador, categoría, puesto asignado y estado|
|payments|Registro de pagos con referencia a Mercado Pago y estado de la transacción|
|favorites|Relación entre usuarios y eventos marcados como favoritos|
|pqrs|Solicitudes de clientes con tipo, mensaje y estado de gestión|
|pqrs_responses|Respuestas del administrador a cada solicitud PQRS|

#### Justificación de una Sola Base de Datos

Todos los dominios del sistema comparten los mismos datos. Separarlos generaría inconsistencia, duplicación de información y mayor complejidad operativa sin beneficio real para este tipo de sistema.

---

### MongoDB Atlas — Logs Operativos

Base de datos no relacional para el registro de actividad operativa del sistema. Se optó por MongoDB porque los logs tienen esquema variable según el tipo de evento, se escriben con alta frecuencia sin necesidad de actualizarse y nunca requieren joins con otras entidades. Los datos de negocio críticos permanecen en PostgreSQL con integridad referencial.

**Base de datos:** estelar_logs

|Colección|Descripción|
|---|---|
|logs_auth|Intentos de login, registros, cambios de contraseña, tokens invalidados|
|logs_tickets|Compras, cancelaciones, ventas presenciales, generación de QR|
|logs_validation|Escaneos realizados, resultado de cada validación, dispositivo y empleado|
|logs_system|Errores de la API, fallos en llamadas a Mercado Pago, timeouts hacia n8n|

---

## Servicios de Soporte

### Mercado Pago — Pasarela de Pagos

Integrado en el Tickets Module. El frontend nunca interactúa directamente con Mercado Pago; toda la comunicación ocurre desde el backend para proteger las credenciales y la lógica de verificación de pagos. El webhook recibido desde Mercado Pago se verifica criptográficamente antes de activar cualquier ticket.

### n8n — Orquestación de Notificaciones

Herramienta de automatización de flujos que desacopla las notificaciones del código de negocio. La API publica eventos hacia n8n y n8n arma las plantillas y envía los correos. Se ejecuta en Docker junto con el resto del proyecto.

|Evento disparador|Acción|
|---|---|
|usuario_registrado|Correo de bienvenida|
|ticket_comprado|Correo con QR adjunto e instrucciones de ingreso|
|ticket_vendido_presencial|Correo con QR al cliente sin cuenta|
|pago_rechazado|Correo con link para reintentar el pago|
|evento_actualizado|Correo a usuarios que tienen el evento en favoritos|
|evento_cancelado|Notificación masiva a todos los compradores|
|pqrs_respondida|Correo al cliente notificando respuesta del admin|
|contrasena_recuperada|Correo con enlace de restablecimiento|

### Chatbot — Asistencia Conversacional

Asistente integrado en la PWA Publica para atención al cliente. Consume la API de un modelo de lenguaje externo desde el backend para no exponer credenciales en el cliente. Puede responder preguntas sobre disponibilidad de eventos, estado de compras e instrucciones de uso de la plataforma.

---

## Seguridad

### QR Firmado Criptográficamente

Cada boleta genera un QR que contiene un token firmado con la clave privada del servidor. El contenido incluye el ID del ticket, el ID del evento, el puesto asignado y la fecha de expiración. El portal de Acceso verifica la firma localmente sin consultar la base de datos para autenticar el QR, y solo accede a la base de datos para verificar el estado y marcarlo como usado.

Este diseño hace imposible falsificar un QR sin conocer la clave privada del servidor, y reduce la carga en base de datos durante el ingreso masivo al evento.

### Permisos Granulares de Empleados

Los empleados no tienen un rol único. El JWT incluye un listado de permisos que especifica exactamente a qué portales tiene acceso cada empleado. El middleware verifica este listado en cada request. Un empleado puede tener acceso a Taquilla, a Acceso o a ambos, según lo que el administrador haya configurado.

### Rate Limiting

|Endpoint|Límite|
|---|---|
|Login|10 intentos por minuto por IP|
|Registro|5 registros por hora por IP|
|Webhook de Mercado Pago|Lista blanca de IPs autorizadas|

---

## Comunicación entre Capas

|Tipo|Descripción|
|---|---|
|HTTP REST|Toda comunicación entre frontends y la API|
|JWT|La API emite el token; el middleware lo valida en cada request|
|OAuth 2.0|Login con Google gestionado desde Auth Module|
|Webhook saliente|La API notifica a n8n los eventos de negocio para correos|
|Webhook entrante|Mercado Pago notifica a la API el resultado del pago|
|Service Worker|Cada PWA gestiona caché offline e instalación en dispositivo|
|MongoDB Driver|La API escribe logs operativos directamente en MongoDB Atlas|

---

## Flujo de Compra Online

1. El cliente entra a la plataforma y explora la cartelera sin necesidad de login.
2. Al intentar comprar, el sistema le solicita registro o login. Puede registrarse con correo y contraseña o con su cuenta de Google.
3. El cliente selecciona el evento, la categoría de boleta y la cantidad deseada.
4. La API verifica la disponibilidad de aforo y asigna el puesto correspondiente.
5. La API crea una preferencia de pago en Mercado Pago y retorna el enlace de pago al frontend.
6. El cliente completa el pago en la plataforma de Mercado Pago.
7. Mercado Pago notifica a la API mediante webhook. La API verifica la autenticidad de la notificación.
8. La API genera el QR firmado con los datos del ticket y el puesto asignado, y registra la boleta como activa en PostgreSQL.
9. La API notifica a n8n el evento de compra. n8n envía el correo con el QR adjunto al cliente.
10. El QR queda disponible en la sección Mis Entradas de la PWA para que el cliente lo lleve el día del evento.

---

## Flujo de Venta en Taquilla

1. El empleado inicia sesión en la PWA Taquilla. El middleware verifica que su JWT tenga permiso de seller.
2. El empleado busca al cliente por correo electrónico o número de cédula.
3. Si el cliente tiene cuenta, la boleta se asocia directamente a su perfil y el QR aparece automáticamente en su app.
4. Si el cliente no tiene cuenta, el empleado registra su nombre y correo para asociarlos a la boleta. Si en el futuro ese cliente crea una cuenta con ese correo, las boletas quedan vinculadas automáticamente.
5. El empleado selecciona el evento y la categoría. La API verifica disponibilidad y asigna el puesto.
6. La API genera la boleta con el QR firmado y registra al empleado como vendedor.
7. n8n envía el QR por correo al cliente.
8. La PWA genera el PDF del ticket físico con QR y código de barras. El empleado lo imprime desde el navegador.

---

## Flujo de Validación en Puerta

1. El empleado inicia sesión en la PWA Acceso. El middleware verifica que su JWT tenga permiso de scanner.
2. El empleado escanea el QR del cliente, ya sea el ticket físico impreso o el QR digital desde el celular, usando un lector físico o la cámara del dispositivo.
3. La PWA envía el token del QR a la API para su validación.
4. La API verifica la firma criptográfica del token.
5. Si la firma es inválida, la API responde con alerta de boleta falsificada. La PWA muestra pantalla roja.
6. Si la firma es válida y el ticket está activo, la API lo marca como usado y responde con el nombre del cliente y su puesto asignado. La PWA muestra pantalla verde y el empleado guía al cliente a su ubicación.
7. Si la firma es válida pero el ticket ya fue usado, la API responde con alerta de QR duplicado. La PWA muestra pantalla roja con advertencia de posible fraude.

---

## Tecnologías Utilizadas

| Capa                    | Tecnología                       | Versión |
| ----------------------- | -------------------------------- | ------- |
| Frontend                | React                            | 18      |
| Servidor de vistas      | Laravel                          | 11      |
| PWA                     | Vite Plugin PWA + Service Worker | —       |
| API Backend             | ASP.NET Core                     | 10      |
| ORM                     | Entity Framework Core + Npgsql   | —       |
| Base de datos principal | PostgreSQL                       | 16      |
| Base de datos de logs   | MongoDB Atlas                    | —       |
| Autenticación           | JWT + OAuth 2.0 (Google)         | —       |
| Generación de QR        | QRCoder (NuGet)                  | —       |
| Generación de PDF       | QuestPDF (NuGet)                 | —       |
| Pasarela de pagos       | Mercado Pago SDK .NET            | —       |
| Notificaciones          | n8n self-hosted en Docker        | —       |
| Caché                   | IMemoryCache .NET                | —       |
| Contenerización         | Docker + Docker Compose          | —       |

---

## Repositorios

| Repositorio           | Descripción                                                |
| --------------------- | ---------------------------------------------------------- |
| events_infrastructure | Documentación de arquitectura, esquema SQL, docker-compose |
| events_api            | API principal — ASP.NET Core 10                            |
| events_landing        | PWA Publica — Laravel + React                              |
| events_admin          | PWA Admin — Laravel + React                                |
| events_tickets        | PWA Taquilla — Laravel + React                             |
| events_access         | PWA Acceso — Laravel + React                               |
