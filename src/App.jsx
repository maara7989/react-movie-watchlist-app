import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import MovieCard from './components/MovieCard';
import Watchlist from './components/Watchlist';
import GenreFilter from './components/GenreFilter';
import Loader from './components/Loader';
import './App.scss';

const WIKIPEDIA_SUMMARY_URL = 'https://en.wikipedia.org/api/rest_v1/page/summary';
const GENRES = ['All', 'Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Romance'];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Looks up a real poster image for a movie via Wikipedia's free, key-less REST API.
async function fetchWikipediaPoster(title) {
  const candidates = [title, `${title} (film)`];

  for (const candidate of candidates) {
    try {
      const { data } = await axios.get(`${WIKIPEDIA_SUMMARY_URL}/${encodeURIComponent(candidate)}`, {
        timeout: 5000,
      });
      const image = data.originalimage?.source ?? data.thumbnail?.source;
      if (image) return image;
    } catch {
      // try the next candidate title
    }
  }

  return null;
}

function App() {
  const [movies, setMovies] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [activeGenre, setActiveGenre] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('/movies.json');
        const baseMovies = response.data;

        // Fetch posters one at a time (with a short pause) to avoid Wikipedia's rate limit.
        const moviesWithPosters = await baseMovies.reduce(async (accPromise, movie) => {
          const acc = await accPromise;
          const wikiPoster = await fetchWikipediaPoster(movie.title);
          await sleep(150);
          return [...acc, wikiPoster ? { ...movie, poster: wikiPoster } : movie];
        }, Promise.resolve([]));

        setMovies(moviesWithPosters);
      } catch {
        setError('Failed to load movies. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchMovies();
  }, []);


  const genres = GENRES;

  const filteredMovies = useMemo(() => {
    if (activeGenre === 'All') return movies;
    return movies.filter((movie) => movie.genre === activeGenre);
  }, [movies, activeGenre]);

  const handleAddToWatchlist = (movie) => {
    setWatchlist((prev) =>
      prev.some((item) => item.id === movie.id) ? prev : [...prev, movie]
    );
  };

  const handleRemoveFromWatchlist = (id) => {
    setWatchlist((prev) => prev.filter((movie) => movie.id !== id));
  };

  return (
    <div className="app">
      <header className="app__header">
        <h1>🎬 Movie Watchlist</h1>
        <p>Discover, track, and curate the movies you love</p>
      </header>

      <main className="app__main">
        <section className="app__movies">
          <GenreFilter genres={genres} activeGenre={activeGenre} onSelectGenre={setActiveGenre} />

          {isLoading && <Loader />}
          {!isLoading && error && <p className="app__error">{error}</p>}

          {!isLoading && !error && (
            filteredMovies.length === 0 ? (
              <p className="app__empty">No movies found</p>
            ) : (
              <div className="movie-grid">
                {filteredMovies.map((movie, index) => (
                  <MovieCard
                    key={movie.id}
                    title={movie.title}
                    genre={movie.genre}
                    year={movie.year}
                    rating={movie.rating}
                    index={index}
                    posterUrl={movie.poster}
                    isInWatchlist={watchlist.some((item) => item.id === movie.id)}
                    onAddToWatchlist={() => handleAddToWatchlist(movie)}
                  />
                ))}
              </div>
            )
          )}
        </section>

        <Watchlist movies={watchlist} onRemove={handleRemoveFromWatchlist} />
      </main>
    </div>
  );
}

export default App;
