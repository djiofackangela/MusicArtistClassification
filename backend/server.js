// server.js
require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");

const connectDb = require("./modules/artists/middlewares/connect-db");
const artistRoutes = require("./modules/artists/routes/artists.routes");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

const PORT = process.env.PORT || 3000;

// Parse JSON bodies
app.use(cors());
app.use(express.json());

// Connect to MongoDB for every request (lazy singleton inside the middleware)
app.use(connectDb);

// Mount artists module
app.use("/artists", artistRoutes);

// 404 + error handlers
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
