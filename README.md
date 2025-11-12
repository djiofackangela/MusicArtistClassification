In Phase 3, I connected the existing MusicArtistClassification backend to MongoDB Atlas using Mongoose and completed the modular architecture:

### Database & Connection

- Created a new database **MusicArtistClassification** and an **artists** collection inside the existing Atlas cluster `CPAN212-AngelaDjiofack`.
- Configured a `.env` file with `DB_URL` and `PORT`.
- Implemented a reusable MongoDB connection middleware:
  - `modules/artists/middlewares/connect-db.js` (uses Mongoose and dotenv).
  - Middleware is applied in `server.js` so it runs for all API routes.

### Mongoose Models & CRUD Logic

- Created a Mongoose schema/model for artists in:
  - `modules/artists/models/artists.model.js`
- The model schema matches the Phase 2 JSON structure:
  - `name`, `genres`, `country`, `debut_year`, `years_active`, `popularity_score`, `popularity_level`, `label`, `avg_tempo`, `bio`, `imageUrl`, `createdAt`.
- Implemented CRUD + query functions:
  - `getAllArtists(filters, options)` – supports search/filter, sort, and pagination.
  - `getArtistById(id)`
  - `createArtist(data)`
  - `updateArtist(id, data)`
  - `deleteArtist(id)`

### Routes & Modular Architecture

- Artists module routes:
  - `modules/artists/routes/artists.routes.js`
- Endpoints:
  - `GET /artists` – list with optional filters: `genre`, `country`, `minPopularity`, plus `sortBy`, `order`, `page`, and `limit`.
  - `GET /artists/:id` – get a single artist by MongoDB `_id`.
  - `POST /artists` – create a new artist.
  - `PUT /artists/:id` – update an existing artist.
  - `DELETE /artists/:id` – delete an artist.
- All business logic is handled inside the model functions (no business logic in routes).

### Validation & Error Handling

- Route-level validation with `express-validator`:
  - `modules/artists/middlewares/artists.validation.js`
  - `modules/artists/middlewares/handleValidation.js`
- Validations:
  - `name` is required.
  - `genres` must be a non-empty array.
  - `country` is required.
  - `popularity_score` must be between 0 and 100 (if provided).
- Application-level middlewares (in `middlewares/`):
  - `notFound.js` – returns 404 JSON when a route does not exist.
  - `errorHandler.js` – logs errors and returns a 500 JSON response.

### Testing

- All routes were tested using Postman:
  - `GET /artists`
  - `GET /artists?genre=R&B&minPopularity=60`
  - `POST /artists` (valid & invalid data to confirm validation).
  - `PUT /artists/:id`
  - `DELETE /artists/:id`
- Verified correct HTTP status codes for success, validation errors, missing resources, and server errors.
