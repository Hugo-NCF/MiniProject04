import { useEffect, useMemo, useState } from "react";
import MovieSiteLayout from "./components/MovieSiteLayout";
import Home from "./components/Home";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [browseSelection, setBrowseSelection] = useState(null);
  const [wishlistedKeys, setWishlistedKeys] = useState(() => new Set());

  function getMovieKey(movie) {
    return `${movie?.title ?? "movie"}-${movie?.releasing_year ?? ""}-${movie?.director ?? ""}`;
  }

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

  const browseOptions = useMemo(() => {
    const ageGroups = Array.from(
      new Set(movies.map((m) => m?.age_group).filter(Boolean)),
    ).sort();

    const genres = Array.from(
      new Set(movies.map((m) => m?.genre).filter(Boolean)),
    ).sort();

    const decadeStarts = Array.from(
      new Set(
        movies
          .map((m) => Number(m?.releasing_year))
          .filter((y) => Number.isFinite(y))
          .map((y) => Math.floor(y / 10) * 10),
      ),
    ).sort((a, b) => b - a);

    const decades = decadeStarts.map((start) => ({ label: `${start}s`, start }));

    return { ageGroups, genres, decades };
  }, [movies]);

  function handleBrowseSelect(selection) {
    setBrowseSelection(selection);
  }

  function toggleWishlistKey(key) {
    if (!key) return;
    setWishlistedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function clearWishlist() {
    setWishlistedKeys(new Set());
  }

  return (
    <MovieSiteLayout
      browseOptions={browseOptions}
      onBrowseSelect={handleBrowseSelect}
      movies={movies}
      loading={loading}
      wishlistedKeys={wishlistedKeys}
      getMovieKey={getMovieKey}
      onToggleWishlistKey={toggleWishlistKey}
      onClearWishlist={clearWishlist}
    >
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : errorMsg ? (
        <div className="alert alert-error">
          <span>{errorMsg}</span>
        </div>
      ) : (
        <Home
          movies={movies}
          browseSelection={browseSelection}
          getMovieKey={getMovieKey}
          wishlistedKeys={wishlistedKeys}
          onToggleWishlistKey={toggleWishlistKey}
        />
      )}
    </MovieSiteLayout>
  );
}
