export default function MovieDetails({ movie, onClose }) {
  if (!movie) return null;
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={event => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="details-panel" role="dialog" aria-modal="true" aria-labelledby="details-title">
        <button className="close-button" onClick={onClose} aria-label="Close details">×</button>
        <div className="details-visual">
          {movie.poster ? <img src={movie.poster} alt={`${movie.title} poster`} /> :
            <div className="details-placeholder"><span>✦</span><strong>{movie.title}</strong></div>}
        </div>
        <div className="details-content">
          <p className="eyebrow">MOVIE INFORMATION</p>
          <h2 id="details-title">{movie.title}</h2>
          <div className="detail-tags">
            <span>{movie.releaseYear}</span><span>{movie.language || "Language not listed"}</span>
            {movie.rating !== null && movie.rating !== undefined && <span>★ {Number(movie.rating).toFixed(1)} / 10</span>}
          </div>
          <h3>Overview</h3>
          <p className="description">{movie.description || "No description available."}</p>
          <div className="detail-row"><span>DIRECTOR</span><strong>{movie.director || "Not listed"}</strong></div>
          <div className="detail-row"><span>GENRE</span><strong>{(movie.genre || []).join(", ") || "Not listed"}</strong></div>
          <div className="detail-row"><span>CAST</span><strong>{(movie.cast || []).join(", ") || "Not listed"}</strong></div>
        </div>
      </section>
    </div>
  );
}
