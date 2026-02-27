import BaseMovieCard from "./BaseMovieCard";
import { FaChevronDown } from "react-icons/fa";

function defaultMovieKey(movie) {
  return `${movie?.title ?? "movie"}-${movie?.releasing_year ?? ""}`;
}

export default function RecommendedRow({
  movies = [],
  title = "Recommended",
  sortMode = "release",
  onSortModeChange,
  selectedKey = null,
  getMovieKey = defaultMovieKey,
  onSelect,
}) {
  if (!movies.length) return null;

  const sortLabel =
    sortMode === "rating"
      ? "Rating"
      : sortMode === "alpha"
        ? "Alphabetical"
        : "Release date";

  function pickSort(nextMode, e) {
    onSortModeChange?.(nextMode);
    const details = e?.currentTarget?.closest?.("details");
    if (details) details.removeAttribute("open");
  }

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-2xl font-semibold">{title}</h2>

        <details className="dropdown dropdown-bottom group">
          <summary className="btn btn-sm btn-outline list-none" aria-label="Sort movies">
            <span className="flex items-center gap-2">
              <span>By: {sortLabel}</span>
              <FaChevronDown className="transition-transform group-open:rotate-180" />
            </span>
          </summary>

          <ul className="dropdown-content menu bg-base-100 rounded-box z-10 mt-2 w-52 p-2 shadow">
            <li>
              <button type="button" onClick={(e) => pickSort("release", e)}>
                Release date
              </button>
            </li>
            <li>
              <button type="button" onClick={(e) => pickSort("rating", e)}>
                Rating
              </button>
            </li>
            <li>
              <button type="button" onClick={(e) => pickSort("alpha", e)}>
                Alphabetical
              </button>
            </li>
          </ul>
        </details>
      </div>

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
