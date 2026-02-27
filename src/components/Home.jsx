import { useEffect, useMemo, useState } from "react";
import RecommendedRow from "./RecommendedRow";
import SelectedMovieDetails from "./SelectedMovieDetails";

function getMovieKey(movie) {
  return `${movie?.title ?? "movie"}-${movie?.releasing_year ?? ""}-${movie?.director ?? ""}`;
}

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

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedKey, setSelectedKey] = useState(null);

  const recommendedMovies = useMemo(() => pickRandomSubset(movies, 12), [movies]);

  useEffect(() => {
    if (selectedKey != null) return;
    if (!recommendedMovies.length) return;
    setSelectedKey(getMovieKey(recommendedMovies[0]));
  }, [recommendedMovies, selectedKey]);

  const selectedMovie = useMemo(() => {
    if (!selectedKey) return null;
    return movies.find((m) => getMovieKey(m) === selectedKey) ?? null;
  }, [movies, selectedKey]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setErrorMsg("");

        const res = await fetch("/movies.json");
        if (!res.ok) throw new Error(`Failed to load /movies.json (${res.status})`);

        const data = await res.json();
        const list = Array.isArray(data) ? data : [];

        if (!cancelled) setMovies(list);
      } catch (e) {
        if (!cancelled) setErrorMsg(e?.message ?? "Failed to load movies.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="alert alert-error">
        <span>{errorMsg}</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SelectedMovieDetails movie={selectedMovie} />

      <RecommendedRow
        movies={recommendedMovies}
        selectedKey={selectedKey}
        getMovieKey={getMovieKey}
        onSelect={(movie) => setSelectedKey(getMovieKey(movie))}
      />
    </div>
  );
}
