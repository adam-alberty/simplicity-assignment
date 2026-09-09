# Simplicity assignment


## Web client

Web client is located at [./client-web](./client-web).

Technologies used:
- **Vite + React + TypeScript**
- **TanStack Router** for routing
- **TanStack Query** for querying the API server
- **TanStack Form** for form handling
- **TanStack Table** for table handling
- **Shadcn ui** for styling
- **Zod** for data validation


## REST API server

REST API server is located at [./api](./api).


Technologies used:
- **Hono + TypeScript**
- **Drizzle** with node-postgres for database access
- **Drizzle Kit** for database schema migrations
- **Zod** for data validation
- **Faker** for dummy data



## How to run

```sh
docker compose up
```

The above command builds both API and web client for production and starts the services.

On first startup, the API service will push the database schema and seed dummy data.

The web client will be on [http://localhost:3000](http://localhost:3000).
API server will be on [http://localhost:8080](http://localhost:8080).


## Routes

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/v1/announcements` | List all announcements |
| `GET` | `/api/v1/announcements/:id` | Get individual announcement by ID |

TODO add more endpoints


## Database

PostgreSQL database is used for data storage.

### Database diagram

![Database diagram](./docs/database-diagram.png)

### ORM

Drizzle is used as an ORM/Query builder.