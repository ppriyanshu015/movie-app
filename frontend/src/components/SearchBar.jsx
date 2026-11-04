export default function SearchBar({ search, onSearchChange, genre, onGenreChange, genres }) {
  return (
    <div className="search-controls">
      <label className="search-box">
        <span aria-hidden="true">⌕</span>
        <input type="search" value={search}
          onChange={event => onSearchChange(event.target.value)}
          placeholder="Search title, director or cast..." aria-label="Search movies" />
      </label>
      <select value={genre} onChange={event => onGenreChange(event.target.value)} aria-label="Filter by genre">
        <option value="">All genres</option>
        {genres.map(item => <option key={item} value={item}>{item}</option>)}
      </select>
    </div>
  );
}
