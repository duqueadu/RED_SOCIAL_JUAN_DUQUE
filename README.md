¡Perfecto! Te voy a preparar una versión **optimizada para tu `README.md`**, con estilo claro, limpio y listo para copiar. He mejorado títulos, instrucciones y advertencias para que sea muy amigable para quien clone tu repo.

---

# Red Social ADUSOFT - Guía de Desarrollo

Repositorio profesional de **red social minimalista**, organizado en microservicios con frontend en React y backend en Node.js + Express.

Incluye **Docker Compose** para levantar la base de datos PostgreSQL.

---

## **📦 Microservicios y Frontend**

### **1️⃣ Auth-service**

**Función:** Autenticación y autorización (login, registro y tokens JWT).
**Carpeta:** `backend/auth-service`
**Puerto por defecto:** `3001`
**Swagger:** `http://localhost:3001/api-docs`

**Ejecutar en desarrollo:**

```bash
cd backend/auth-service
npm install
npm run dev
```

**Variables importantes en `.env`:**

```
PORT=3001
DATABASE_URL=postgresql://postgres:123456@localhost:5432/apipruebadb
JWT_SECRET=ReplaceWithAStrongSecret
```

---

### **2️⃣ User-service**

**Función:** Gestión de usuarios, perfiles y roles.
**Carpeta:** `backend/user-service`
**Puerto por defecto:** `3002`
**Swagger:** `http://localhost:3002/api-docs`

**Ejecutar en desarrollo:**

```bash
cd backend/user-service
npm install
npm run dev
```

> ⚠️ Instalar dependencias de Swagger si faltan:

```bash
npm install swagger-jsdoc swagger-ui-express
```

**Variables importantes en `.env`:**

```
PORT=3002
DATABASE_URL=postgresql://postgres:123456@localhost:5432/apipruebadb
JWT_SECRET=ReplaceWithAStrongSecret
```

---

### **3️⃣ Post-service**

**Función:** Gestión de publicaciones (crear, editar, eliminar, like).
**Carpeta:** `backend/post-service`
**Puerto por defecto:** `3003`
**Swagger:** `http://localhost:3003/api-docs`

**Ejecutar en desarrollo:**

```bash
cd backend/post-service
npm install
npm run dev
```

> ⚠️ Si aparece `EADDRINUSE` (puerto ocupado):

```bash
netstat -ano | findstr :3003
taskkill /PID <PID> /F
```

**Variables importantes en `.env`:**

```
PORT=3003
DATABASE_URL=postgresql://postgres:123456@localhost:5432/apipruebadb
JWT_SECRET=ReplaceWithAStrongSecret
```

---

### **4️⃣ Frontend**

**Función:** Interfaz de usuario en React + Vite + Tailwind. Consume los microservicios.
**Carpeta:** `frontend`
**Puerto por defecto:** `5173`

**Ejecutar en desarrollo:**

```bash
cd frontend
npm install
npm run dev
```

**Variables importantes en `.env` (si aplica):**

```
VITE_API_AUTH=http://localhost:3001
VITE_API_USER=http://localhost:3002
VITE_API_POST=http://localhost:3003
```

**Abrir en navegador:** `http://localhost:5173`

---

### **5️⃣ Base de datos (PostgreSQL)**

**Función:** Almacena usuarios, posts y datos relacionados.
**Inicialización:** `sql/init.sql`

**Levantar con Docker Compose:**

```bash
docker compose up -d
```

**Variables de conexión:**

```
version: '3.8'
services:

  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: 123456
      POSTGRES_DB: apipruebadb
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"
  auth-service:
    build: ./backend/auth-service
    env_file: ./backend/auth-service/.env
    depends_on:
      - postgres
    ports:
      - "3001:3001"
  user-service:
    build: ./backend/user-service
    env_file: ./backend/user-service/.env
    depends_on:
      - postgres
    ports:
      - "3002:3002"
  post-service:
    build: ./backend/post-service
    env_file: ./backend/post-service/.env
    depends_on:
      - postgres
    ports:
      - "3003:3003"
  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    depends_on:
      - auth-service
      - user-service
      - post-service

volumes:
  pgdata:

```

---

## **💻 Resumen de comandos `npm run dev`**

| Microservicio | Carpeta                | Comando       | Puerto |
| ------------- | ---------------------- | ------------- | ------ |
| Auth-service  | `backend/auth-service` | `npm run dev` | 3001   |
| User-service  | `backend/user-service` | `npm run dev` | 3002   |
| Post-service  | `backend/post-service` | `npm run dev` | 3003   |
| Frontend      | `frontend`             | `npm run dev` | 5173   |

---

Si quieres, puedo hacer también una **versión visual tipo diagrama**, mostrando **cada microservicio, frontend y base de datos, con puertos y flujo de datos**, para que tu README quede **mucho más claro y profesional**.

¿Quieres que haga ese diagrama para el README?
