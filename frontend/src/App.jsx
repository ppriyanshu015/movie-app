import { useEffect, useMemo, useState } from "react";
import MovieList from "./components/MovieList.jsx";
import MovieDetails from "./components/MovieDetails.jsx";
import SearchBar from "./components/SearchBar.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function fetchMovies() {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        if (search.trim()) params.set("search", search.trim());
        if (genre) params.set("genre", genre);
        const response = await fetch(`${API_URL}/movies?${params.toString()}`, { signal: controller.signal });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Could not load movies.");
        setMovies(data.movies || []);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message || "Unable to connect to the movie server.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    fetchMovies();
    return () => controller.abort();
  }, [search, genre]);

  // Build genre choices from all movies, not only the currently filtered result set.
  const [allGenres, setAllGenres] = useState([]);
  useEffect(() => {
    fetch(`${API_URL}/movies`)
      .then(response => response.json())
      .then(data => setAllGenres([...new Set((data.movies || []).flatMap(movie => movie.genre || []))].sort()))
      .catch(() => setAllGenres([]));
  }, []);
  const genres = useMemo(() => allGenres, [allGenres]);

  async function openMovie(movie) {
    try {
      const response = await fetch(`${API_URL}/movies/${movie._id}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to fetch movie details.");
      setSelectedMovie(data);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="logo" href="/" aria-label="ScreenVault home"><span>▣</span> SCREENVAULT</a>
        <span className="topbar-note">YOUR MOVIE LIBRARY</span>
      </header>
      <main className="container">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">DISCOVER · EXPLORE · REVISIT</p>
            <h1>Stories worth<br /><span>watching.</span></h1>
            <p>Explore your movie collection. Browse films, search by title or director, and discover the details behind every story.</p>
          </div>
          <div className="hero-art" aria-hidden="true"><div className="film-reel">✦</div><div className="hero-caption">A WORLD OF CINEMA</div></div>
        </section>
        <section className="library-section">
          <div className="section-top">
            <div><p className="eyebrow">THE COLLECTION</p><h2>Movie library</h2></div>
            <span className="movie-count">{movies.length} {movies.length === 1 ? "MOVIE" : "MOVIES"}</span>
          </div>
          <SearchBar search={search} onSearchChange={setSearch} genre={genre} onGenreChange={setGenre} genres={genres} />
          {loading && <div className="status-message">Loading movies from MongoDB…</div>}
          {!loading && error && <div className="error-message"><strong>Could not load the movie collection.</strong><span>{error}</span><small>Check that MongoDB and the backend server are running.</small></div>}
          {!loading && !error && <MovieList movies={movies} onSelect={openMovie} />}
        </section>
      </main>
      <footer className="footer"><span>SCREENVAULT</span><span>Movie information served from MongoDB</span></footer>
      <MovieDetails movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
    </div>
  );
}
