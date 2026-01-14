# UNO Challenge – Full Stack

Aplicación Full Stack desarrollada como parte del Challenge UNO.

El proyecto implementa un juego de memoria (Memory / Concentration), integrando frontend, backend y persistencia de datos en PostgreSQL.  
Todo el entorno se levanta mediante Docker Compose.

---

## Stack Tecnológico

### Backend

-   Node.js
-   NestJS
-   TypeScript
-   Arquitectura por capas (inspirada en Hexagonal)
-   API REST
-   PostgreSQL

### Frontend

-   React
-   TypeScript
-   Vite
-   Tailwind CSS

### Infraestructura

-   Docker
-   Docker Compose
-   PostgreSQL 16

---

## Requisitos

-   Docker
-   Docker Compose

---

## Levantar el Proyecto

Desde la raíz del proyecto ejecutar:

```bash
docker-compose up --build
```

Este comando levanta:

-   Base de datos PostgreSQL
-   Backend NestJS
-   Frontend React

---

## URLs del Proyecto

| Servicio   | URL                   |
| ---------- | --------------------- |
| Frontend   | http://localhost:5173 |
| Backend    | http://localhost:3000 |
| PostgreSQL | localhost:5433        |

---

## Variables de Entorno

### Backend

```env
NODE_ENV=development
DATABASE_HOST=db
DATABASE_PORT=5432
DATABASE_USER=memory_user
DATABASE_PASSWORD=memory_pass
DATABASE_NAME=memory_game
```

### Frontend

```env
VITE_API_URL=http://localhost:3000
```

---

## Endpoints Principales

### Obtener deck de cartas

```http
GET /game/deck
```

Respuesta de ejemplo:

```json
[
    {
        "id": "0-a",
        "image": {
            "url": "https://challenge-uno.vercel.app/images/bear.jpg",
            "uuid": "d7c1b5a4-8bfa-45a4-ba9a-de92a3e81300",
            "title": "bear",
            "content_type": "image/jpeg"
        },
        "flipped": false
    }
]
```

---

## Estructura del Proyecto

```text
uno-test-full-stack/
│
├── backend/
├── frontend/
├── docker-compose.yml
└── README.md
```

---

## Ejecución sin Docker (Opcional)

### Backend

```bash
cd backend
npm install
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Notas Finales

-   El proyecto está orientado a entorno de desarrollo.
-   El backend utiliza una arquitectura desacoplada inspirada en Hexagonal.
-   El foco del challenge es la integración Full Stack y buenas prácticas.
-   Existen oportunidades de mejora en organización del frontend y cobertura de tests.
