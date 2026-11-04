const express = require("express");
const mongoose = require("mongoose");
const Movie = require("../models/Movie");
const router = express.Router();

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// GET /api/movies?search=space&genre=Sci-Fi&year=2014
router.get("/", async (req, res) => {
  try {
    const { search, genre, year } = req.query;
    const filter = {};
    if (search && String(search).trim()) {
      const q = escapeRegex(String(search).trim());
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { director: { $regex: q, $options: "i" } },
        { cast: { $regex: q, $options: "i" } }
      ];
    }
    if (genre && String(genre).trim()) {
      filter.genre = { $regex: `^${escapeRegex(String(genre).trim())}$`, $options: "i" };
    }
    if (year && Number.isInteger(Number(year))) filter.releaseYear = Number(year);
    const movies = await Movie.find(filter).sort({ releaseYear: -1, title: 1 }).lean();
    res.json({ count: movies.length, movies });
  } catch (error) {
    console.error("Fetch movies error:", error);
    res.status(500).json({ message: "Unable to fetch movies." });
  }
});

// GET /api/movies/search/:title
router.get("/search/:title", async (req, res) => {
  try {
    const title = String(req.params.title || "").trim();
    const movies = await Movie.find({ title: { $regex: escapeRegex(title), $options: "i" } }).sort({ releaseYear: -1 }).lean();
    res.json({ count: movies.length, movies });
  } catch (error) {
    res.status(500).json({ message: "Unable to search movies." });
  }
});

// GET /api/movies/:id
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid movie ID." });
    const movie = await Movie.findById(req.params.id).lean();
    if (!movie) return res.status(404).json({ message: "Movie not found." });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch movie details." });
  }
});

// Demo CRUD routes. Protect POST/PUT/DELETE with admin authentication before public deployment.
router.post("/", async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json({ message: "Movie added successfully.", movie });
  } catch (error) {
    res.status(400).json({ message: error.message || "Unable to add movie." });
  }
});

router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid movie ID." });
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!movie) return res.status(404).json({ message: "Movie not found." });
    res.json({ message: "Movie updated successfully.", movie });
  } catch (error) {
    res.status(400).json({ message: error.message || "Unable to update movie." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid movie ID." });
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found." });
    res.json({ message: "Movie deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Unable to delete movie." });
  }
});

module.exports = router;
