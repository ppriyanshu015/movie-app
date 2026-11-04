import MovieCard from "./MovieCard.jsx";

export default function MovieList({ movies, onSelect }) {
  if (!movies.length) return (
    <div className="empty-state"><span>⌕</span><h3>No movies found</h3><p>Try another title or choose a different genre.</p></div>
  );
  return <div className="movie-grid">{movies.map(movie =>
    <MovieCard key={movie._id} movie={movie} onSelect={onSelect} />
  )}</div>;
}
