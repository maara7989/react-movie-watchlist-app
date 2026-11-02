import './Loader.scss';

function Loader() {
  return (
    <output className="loader" aria-label="Loading movies">
      <div className="loader__spinner">
        <span></span>
        <span></span>
      </div>
      <p>Loading movies...</p>
    </output>
  );
}

export default Loader;
