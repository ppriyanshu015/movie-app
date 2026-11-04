export default function MovieCard({ movie, onSelect }) {
  const initials = movie.title.split(" ").filter(Boolean).slice(0, 2)
    .map(word => word[0].toUpperCase()).join("");

  return (
    <button className="movie-card" onClick={() => onSelect(movie)} aria-label={`View details for ${movie.title}`}>
      <div className="poster">
        {movie.poster ? <img src={movie.poster} alt={`${movie.title} poster`} loading="lazy" /> :
          <div className="poster-placeholder"><span className="poster-symbol">✦</span><strong>{initials}</strong><small>SCREENVAULT</small></div>}
        <span className="year-badge">{movie.releaseYear}</span>
      </div>
      <div className="movie-card-info">
        <div className="movie-card-title">
          <h3>{movie.title}</h3>
          {movie.rating !== null && movie.rating !== undefined && <span className="rating">★ {Number(movie.rating).toFixed(1)}</span>}
        </div>
        <p>{(movie.genre || []).slice(0, 2).join(" · ") || "Genre not listed"}</p>
        <span className="view-details">VIEW DETAILS ↗</span>
      </div>
    </button>
  );
}
