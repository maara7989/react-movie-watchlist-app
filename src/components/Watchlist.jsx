import './Watchlist.scss';

function Watchlist({ movies, onRemove }) {
  return (
    <aside className="watchlist">
      <h2 className="watchlist__title">
        🍿 My Watchlist <span className="watchlist__count" key={movies.length}>{movies.length}</span>
      </h2>
      {movies.length === 0 ? (
        <p className="watchlist__empty">Your watchlist is empty. Add some movies!</p>
      ) : (
        <ul className="watchlist__list">
          {movies.map((movie, index) => (
            <li key={movie.id} className="watchlist__item" style={{ animationDelay: `${index * 0.05}s` }}>
              <span className="watchlist__item-info">
                {movie.title} <small>({movie.year})</small>
              </span>
              <button className="watchlist__remove" onClick={() => onRemove(movie.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

export default Watchlist;
