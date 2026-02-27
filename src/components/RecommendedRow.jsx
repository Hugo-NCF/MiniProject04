import { useMemo } from "react";
import BaseMovieCard from "./BaseMovieCard";

function shuffleInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function pickRandomSubset(list, count) {
  const arr = [...list];
  shuffleInPlace(arr);
  return arr.slice(0, Math.min(count, arr.length));
}

function defaultMovieKey(movie) {
  return `${movie?.title ?? "movie"}-${movie?.releasing_year ?? ""}`;
}

export default function RecommendedRow({
  movies = [],
  count = 12,
  selectedKey = null,
  getMovieKey = defaultMovieKey,
  onSelect,
}) {
  const recommended = useMemo(() => pickRandomSubset(movies, count), [movies, count]);

  if (!recommended.length) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-2xl font-semibold">Recommended</h2>

      <div className="carousel carousel-center w-full space-x-4 rounded-box">
        {recommended.map((m, idx) => (
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
