import BaseMovieCard from "./BaseMovieCard";

function defaultMovieKey(movie) {
  return `${movie?.title ?? "movie"}-${movie?.releasing_year ?? ""}`;
}

export default function RecommendedRow({
  movies = [],
  selectedKey = null,
  getMovieKey = defaultMovieKey,
  onSelect,
}) {
  if (!movies.length) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-2xl font-semibold">Recommended</h2>

      <div className="carousel carousel-center w-full space-x-4 rounded-box">
        {movies.map((m, idx) => (
          <div
            key={`${getMovieKey(m)}-${idx}`}
            className="carousel-item w-44"
          >
            <div className="w-full aspect-2/3">
              <BaseMovieCard
                movie={m}
                selected={getMovieKey(m) === selectedKey}
                onSelect={onSelect}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
