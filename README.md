# Lumina Office (clon mejorado)

Recreacion de [luminaoffice.com.ar](https://luminaoffice.com.ar/) con arquitectura moderna:
**React (frontend) + Node.js/Express en MVC (backend) + MySQL (Sequelize)**.

## Estructura

```
backend/    API REST en Express, patron MVC (models/controllers/routes), Sequelize + MySQL
frontend/   SPA en React (Vite) + React Router
```

## Funcionalidad

- Sitio publico: Home, Institucional, Edificios (Finalizados/Proyectos), detalle de edificio,
  Sustentabilidad, Contacto (formulario que guarda consultas en MySQL).
- Panel de administracion (`/admin/login`) protegido con JWT:
  - CRUD de edificios (nombre, categoria, m², direccion, descripcion, imagen de portada).
  - Edicion de contenido de las paginas Institucional y Sustentabilidad.
  - Listado y gestion de consultas de contacto (leads).

## Requisitos

- Node.js 18+
- MySQL / MariaDB corriendo (se probo con MariaDB de XAMPP)

## Puesta en marcha

### 1. Base de datos

Crear la base de datos (si no existe):

```sql
CREATE DATABASE luminaoffice CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend

```bash
cd backend
cp .env.example .env   # ajustar credenciales de MySQL si hace falta
npm install
npm run seed            # crea las tablas y carga datos iniciales (10 edificios, textos, admin)
npm run dev              # o "npm start" (http://localhost:4000)
```

Credenciales de admin creadas por el seed (definidas en `.env`):
`ADMIN_EMAIL` / `ADMIN_PASSWORD` (por defecto `admin@luminaoffice.com.ar` / `Admin123!`).

### 3. Frontend

```bash
cd frontend
cp .env.example .env    # VITE_API_URL debe apuntar al backend
npm install
npm run dev              # http://localhost:5173 (o el puerto que asigne Vite)
```

Si Vite levanta en un puerto distinto de 5173 (por estar ocupado), actualizar
`CORS_ORIGIN` en `backend/.env` con ese puerto y reiniciar el backend.

## Notas sobre el contenido

Los datos de los 10 edificios (nombre, m², categoria Finalizados/Proyectos) y los textos
institucionales/de sustentabilidad fueron tomados del sitio original publico. No hay
direcciones, imagenes ni fichas tecnicas publicas por edificio en el sitio original: esos
campos quedan vacios/placeholder y se pueden completar desde el panel admin.
