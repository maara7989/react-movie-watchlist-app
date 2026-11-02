import { useState } from 'react';
import './MovieCard.scss';

const GENRE_THEME = {
  Action: { icon: '💥', gradient: 'linear-gradient(135deg, #ff5f6d, #2b0f14)' },
  Comedy: { icon: '😂', gradient: 'linear-gradient(135deg, #ffd166, #4a3500)' },
  Drama: { icon: '🎭', gradient: 'linear-gradient(135deg, #8e54e9, #220a35)' },
  'Sci-Fi': { icon: '🚀', gradient: 'linear-gradient(135deg, #36d1dc, #0b1d3a)' },
  Horror: { icon: '👻', gradient: 'linear-gradient(135deg, #5a5a5a, #0a0a0a)' },
};
const DEFAULT_THEME = { icon: '🎬', gradient: 'linear-gradient(135deg, #4f8cff, #141830)' };

function MovieCard({ title, genre, year, rating, isInWatchlist, onAddToWatchlist, index = 0, posterUrl }) {
  const [imageFailed, setImageFailed] = useState(false);
  const theme = GENRE_THEME[genre] ?? DEFAULT_THEME;
  const showFallback = !posterUrl || imageFailed;

  return (
    <div className="movie-card" style={{ animationDelay: `${index * 0.06}s` }}>
      <div className="movie-card__poster" style={showFallback ? { background: theme.gradient } : undefined}>
        {showFallback ? (
          <span className="movie-card__icon">{theme.icon}</span>
        ) : (
          <img
            className="movie-card__poster-img"
            src={posterUrl}
            alt={`${title} poster`}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        )}
        <span className="movie-card__rating">⭐ {rating}</span>
      </div>
      <div className="movie-card__body">
        <h3 className="movie-card__title">{title}</h3>
        <p className="movie-card__meta">
          <span className="movie-card__genre">{genre}</span>
          <span className="movie-card__year">{year}</span>
        </p>
      </div>
      <button
        className="movie-card__button"
        disabled={isInWatchlist}
        onClick={onAddToWatchlist}
      >
        {isInWatchlist ? '✓ Added' : '+ Add to Watchlist'}
      </button>
    </div>
  );
}

export default MovieCard;
