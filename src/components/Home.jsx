import { useEffect, useState } from "react";
import RecommendedRow from "./RecommendedRow";

function getMovieKey(movie) {
  return `${movie?.title ?? "movie"}-${movie?.releasing_year ?? ""}`;
}

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedKey, setSelectedKey] = useState(null);

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
      <RecommendedRow
        movies={movies}
        count={12}
        selectedKey={selectedKey}
        getMovieKey={getMovieKey}
        onSelect={(movie) => setSelectedKey(getMovieKey(movie))}
      />
    </div>
  );
}
