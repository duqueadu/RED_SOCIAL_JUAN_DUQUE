# DOCUMENTACIÓN - Red_Social_ADUSOFT

## Resumen
Proyecto Full Stack con microservicios (Node.js) y frontend en React (Vite). Minimalista UI.

## Componentes
- auth-service (3001): register, login (JWT)
- user-service (3002): profile (GET /profile)
- post-service (3003): posts listing, create, like
- postgres (5432): base de datos
- frontend (5173): React app (Feed, Login, Profile)

## Comandos rápidos (desarrollo usando Docker Compose)
1. Copiar .env según servicios si necesitas cambiar secretos.
2. Levantar stack:
   docker compose up --build
3. Ejecutar el script SQL manual (si no se ejecutó):
   docker exec -i <postgres_container> psql -U postgres -d red_social_db < sql/init.sql

## Notas técnicas
- JWT para autenticación.
- Passwords hashed con bcrypt.
- Likes implementados con tabla likes y UNIQUE(post_id,user_id).
- Servicios diseñados para escalar de forma independiente.
