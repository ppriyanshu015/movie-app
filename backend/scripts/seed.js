require("dotenv").config();
const mongoose = require("mongoose");
const Movie = require("../models/Movie");

// Starter records for testing. Replace or expand these with your own data.
const sampleMovies = [
  { title: "Interstellar", genre: ["Sci-Fi", "Adventure", "Drama"], releaseYear: 2014, director: "Christopher Nolan", cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"], rating: 8.7, language: "English", poster: "", description: "A team of explorers travels beyond this galaxy to discover whether mankind has a future among the stars." },
  { title: "Inception", genre: ["Sci-Fi", "Action", "Thriller"], releaseYear: 2010, director: "Christopher Nolan", cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"], rating: 8.8, language: "English", poster: "", description: "A skilled thief who steals information through dream-sharing technology is offered a chance to have his criminal history erased." },
  { title: "Spirited Away", genre: ["Animation", "Fantasy", "Adventure"], releaseYear: 2001, director: "Hayao Miyazaki", cast: ["Rumi Hiiragi", "Miyu Irino", "Mari Natsuki"], rating: 8.6, language: "Japanese", poster: "", description: "A young girl enters a mysterious world of spirits and works to find a way to return to her family." },
  { title: "The Dark Knight", genre: ["Action", "Crime", "Drama"], releaseYear: 2008, director: "Christopher Nolan", cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"], rating: 9.0, language: "English", poster: "", description: "Batman faces a criminal mastermind who seeks to plunge Gotham City into chaos." },
  { title: "3 Idiots", genre: ["Comedy", "Drama"], releaseYear: 2009, director: "Rajkumar Hirani", cast: ["Aamir Khan", "R. Madhavan", "Sharman Joshi"], rating: 8.4, language: "Hindi", poster: "", description: "Two friends look back on their college years and the influence of an unconventional classmate." }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const indexes = await Movie.collection.indexes();
    const legacyTextIndex = indexes.find(index =>
      index.name === "title_text_director_text_description_text" &&
      index.language_override === "language"
    );
    if (legacyTextIndex) {
      await Movie.collection.dropIndex(legacyTextIndex.name);
      await Movie.createIndexes();
    }
    const result = await Movie.bulkWrite(sampleMovies.map(movie => ({
      updateOne: {
        filter: { title: movie.title },
        update: { $setOnInsert: movie },
        upsert: true
      }
    })));
    console.log(`Added ${result.upsertedCount} sample movies; existing titles were left unchanged.`);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}
seedDatabase();
