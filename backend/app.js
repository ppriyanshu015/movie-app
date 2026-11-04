require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const movieRoutes = require("./routes/movieRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is missing. Create a .env file using .env.example.");
  process.exit(1);
}
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));
app.get("/api/health", (req, res) => res.json({ status: "ok", message: "Movie API is running." }));
app.use("/api/movies", movieRoutes);
app.use((req, res) => res.status(404).json({ message: "API route not found." }));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => app.listen(PORT, () => console.log(`Movie API running at http://localhost:${PORT}`)))
  .catch(error => { console.error("MongoDB connection failed:", error.message); process.exit(1); });
