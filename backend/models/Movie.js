const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 150 },
  genre: { type: [String], default: [] },
  releaseYear: { type: Number, required: true, min: 1888, max: 2100 },
  director: { type: String, required: true, trim: true },
  cast: { type: [String], default: [] },
  rating: { type: Number, min: 0, max: 10, default: null },
  language: { type: String, trim: true, default: "Not specified" },
  poster: { type: String, trim: true, default: "" },
  description: { type: String, trim: true, default: "", maxlength: 3000 }
}, { timestamps: true });

movieSchema.index({ title: "text", director: "text", description: "text" }, { language_override: "_textLanguage" });
module.exports = mongoose.model("Movie", movieSchema);
