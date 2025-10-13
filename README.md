# Music Artist Classification — Phase 2 (Modular Express Backend)

**Due:** Oct 15, 2025  
**Owner:** Angela Lauraine Djiofack Kuemene

## Objective
Design data structures, add sample data, and implement a modular Express.js backend with CRUD models, modular routes, route-level validation, and app-level middlewares. (Continuation of Phase 1 proposal.)

## What’s Implemented
- **Feature-based modules**: `modules/artists/`
  - `models/` → All CRUD/business logic using JSON file as data source
  - `routes/` → Express Router with independent endpoints
  - `middlewares/` → `express-validator` rules per feature
- **Data source**: `data/artists.json` with 15 seed records
- **App-level middlewares**:
  - `express.json()` and `express.urlencoded()`
  - `middlewares/notFound.js` → 404 handler
  - `middlewares/errorHandler.js` → central error handler (500)
- **Validation** with `express-validator`:
  - `POST /api/artists` and `PUT /api/artists/:id`
  - Required fields, types, and constraints (score 0–100, imageUrl URL, etc.)
- **HTTP responses**:
  - `200 OK` → GET/PUT/DELETE
  - `201 Created` → POST
  - `400 Bad Request` → validation errors
  - `404 Not Found` → missing resource
  - `500 Internal Server Error` → server errors
- **Testing**: curl commands + compatible with Postman/Insomnia
- **Tech**: Node 22.x (CommonJS), Express 4, express-validator, uuid, nodemon

## Endpoints
- `GET /api/artists?genre=&country=&q=`
- `GET /api/artists/:id`
- `POST /api/artists`
- `PUT /api/artists/:id`
- `DELETE /api/artists/:id`

## How to Run
```bash
npm install
npm run dev
# open http://localhost:3000
