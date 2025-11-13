

# Guía Paso a Paso - Red Social ADUSOFT

Esta guía explica cómo levantar cada parte del proyecto de manera individual y también cómo levantar todo junto. Está pensada para que cualquier desarrollador pueda seguirla desde cero.

---

## Paso 1: Clonar el repositorio

Primero, hay que clonar el repositorio desde GitHub usando el comando `git clone` seguido de la URL del repositorio. Luego, entrar a la carpeta del proyecto con `cd Red_Social_ADUSOFT`.

---

## Paso 2: Preparar la Base de Datos

Se utiliza PostgreSQL con usuario postgres, contraseña 123456 y base de datos llamada apipruebadb. Se recomienda levantarla con Docker Compose ejecutando `docker compose up -d`. El archivo init.sql contiene las tablas y datos de prueba que se cargarán automáticamente al iniciar PostgreSQL.

---

## Paso 3: Levantar Auth-service

Auth-service se encarga de la autenticación y autorización de los usuarios.

Para levantarlo, primero entrar a la carpeta del servicio con `cd backend/auth-service`. Luego instalar las dependencias con `npm install`. Después levantar el servicio en modo desarrollo con `npm run dev`. Este servicio corre en el puerto 3001. Asegurarse de que las variables de entorno estén configuradas correctamente, incluyendo la URL de la base de datos y la clave secreta de los JWT.

---

## Paso 4: Levantar User-service

User-service gestiona la información de los usuarios, sus perfiles y roles.

Para levantarlo, entrar a la carpeta con `cd backend/user-service`. Instalar las dependencias con `npm install`. Si se desea usar Swagger para documentación de endpoints, instalar las dependencias con `npm install swagger-jsdoc swagger-ui-express`. Luego levantar el servicio en modo desarrollo con `npm run dev`. Este servicio corre en el puerto 3002.

---

## Paso 5: Levantar Post-service

Post-service gestiona las publicaciones, incluyendo crear, editar, eliminar y dar “like”.

Para levantarlo, entrar a la carpeta con `cd backend/post-service`. Instalar las dependencias con `npm install`. Levantar el servicio en modo desarrollo con `npm run dev`. Este servicio corre en el puerto 3003. Si aparece un error indicando que el puerto está ocupado, hay que liberar el puerto primero usando los comandos `netstat -ano | findstr :3003` para ver el PID y `taskkill /PID <PID> /F` para cerrar el proceso.

---

## Paso 6: Levantar Frontend

El frontend es la interfaz de usuario y consume los microservicios.

Para levantarlo, entrar a la carpeta con `cd frontend`. Instalar las dependencias con `npm install`. Levantar el frontend en modo desarrollo con `npm run dev`. Luego abrir el navegador en la dirección `http://localhost:5173`. Asegurarse de que las variables de entorno estén definidas con las URLs correctas de los microservicios: Auth-service en 3001, User-service en 3002 y Post-service en 3003.

---

## Paso 7: Levantar todo junto con Docker Compose

Si se desea iniciar todos los servicios al mismo tiempo, se puede usar Docker Compose. Esto levantará PostgreSQL, Auth-service, User-service, Post-service y Frontend de forma coordinada y lista para usar. El comando es `docker compose up -d`.

