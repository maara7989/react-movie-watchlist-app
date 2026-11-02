import './GenreFilter.scss';

const GENRE_ICONS = {
  All: '🎞️',
  Action: '💥',
  Comedy: '😂',
  Drama: '🎭',
  'Sci-Fi': '🚀',
  Horror: '👻',
  Romance: '💕',
};

function GenreFilter({ genres, activeGenre, onSelectGenre }) {
  return (
    <div className="genre-filter">
      {genres.map((genre) => (
        <button
          key={genre}
          className={`genre-filter__button${activeGenre === genre ? ' genre-filter__button--active' : ''}`}
          onClick={() => onSelectGenre(genre)}
        >
          <span className="genre-filter__icon">{GENRE_ICONS[genre] ?? '🎬'}</span>
          {genre}
        </button>
      ))}
    </div>
  );
}

export default GenreFilter;
