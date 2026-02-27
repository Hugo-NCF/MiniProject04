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

export default function Home({ movies = [], browseSelection = null }) {
  const [selectedKey, setSelectedKey] = useState(null);
  const [likedKeys, setLikedKeys] = useState(() => new Set());
  const [dislikedKeys, setDislikedKeys] = useState(() => new Set());
  const [wishlistedKeys, setWishlistedKeys] = useState(() => new Set());
  const [sortMode, setSortMode] = useState("release");

  const recommendedMovies = useMemo(() => pickRandomSubset(movies, 12), [movies]);

  const displayedMovies = useMemo(() => {
    if (!browseSelection) return recommendedMovies;

    const { type, value } = browseSelection;
    if (type === "age_group") {
      return movies.filter((m) => m?.age_group === value);
    }
    if (type === "genre") {
      return movies.filter((m) => m?.genre === value);
    }
    if (type === "decade") {
      const start = Number(value);
      if (!Number.isFinite(start)) return [];
      const end = start + 9;
      return movies.filter((m) => {
        const y = Number(m?.releasing_year);
        return Number.isFinite(y) && y >= start && y <= end;
      });
    }
    return recommendedMovies;
  }, [browseSelection, movies, recommendedMovies]);

  const sortedMovies = useMemo(() => {
    const list = [...displayedMovies];

    if (sortMode === "rating") {
      list.sort((a, b) => {
        const ar = Number(a?.imdb_rating);
        const br = Number(b?.imdb_rating);
        const aVal = Number.isFinite(ar) ? ar : -Infinity;
        const bVal = Number.isFinite(br) ? br : -Infinity;
        if (bVal !== aVal) return bVal - aVal;
        return String(a?.title ?? "").localeCompare(String(b?.title ?? ""), undefined, {
          sensitivity: "base",
        });
      });
      return list;
    }

    if (sortMode === "alpha") {
      list.sort((a, b) =>
        String(a?.title ?? "").localeCompare(String(b?.title ?? ""), undefined, {
          sensitivity: "base",
        }),
      );
      return list;
    }

    // Default: release date (latest -> oldest)
    list.sort((a, b) => {
      const ay = Number(a?.releasing_year);
      const by = Number(b?.releasing_year);
      const aVal = Number.isFinite(ay) ? ay : -Infinity;
      const bVal = Number.isFinite(by) ? by : -Infinity;
      if (bVal !== aVal) return bVal - aVal;
      return String(a?.title ?? "").localeCompare(String(b?.title ?? ""), undefined, {
        sensitivity: "base",
      });
    });
    return list;
  }, [displayedMovies, sortMode]);

  useEffect(() => {
    if (!sortedMovies.length) return;

    const stillVisible =
      selectedKey != null && sortedMovies.some((m) => getMovieKey(m) === selectedKey);

    if (stillVisible) return;
    setSelectedKey(getMovieKey(sortedMovies[0]));
  }, [sortedMovies, selectedKey]);

  const selectedMovie = useMemo(() => {
    if (!selectedKey) return null;
    return movies.find((m) => getMovieKey(m) === selectedKey) ?? null;
  }, [movies, selectedKey]);

  const isLiked = selectedKey != null && likedKeys.has(selectedKey);
  const isDisliked = selectedKey != null && dislikedKeys.has(selectedKey);
  const isWishlisted = selectedKey != null && wishlistedKeys.has(selectedKey);

  function toggleLike() {
    if (!selectedKey) return;

    setLikedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(selectedKey)) next.delete(selectedKey);
      else next.add(selectedKey);
      return next;
    });
    setDislikedKeys((prev) => {
      const next = new Set(prev);
      next.delete(selectedKey);
      return next;
    });
  }

  function toggleDislike() {
    if (!selectedKey) return;

    setDislikedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(selectedKey)) next.delete(selectedKey);
      else next.add(selectedKey);
      return next;
    });
    setLikedKeys((prev) => {
      const next = new Set(prev);
      next.delete(selectedKey);
      return next;
    });
  }

  function toggleWishlist() {
    if (!selectedKey) return;

    setWishlistedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(selectedKey)) next.delete(selectedKey);
      else next.add(selectedKey);
      return next;
    });
  }

  const listTitle = useMemo(() => {
    if (!browseSelection) return "Recommended";
    if (browseSelection.type === "age_group") return `Age group: ${browseSelection.value}`;
    if (browseSelection.type === "genre") return `Genre: ${browseSelection.value}`;
    if (browseSelection.type === "decade") return `${browseSelection.value}s`;
    return "Results";
  }, [browseSelection]);

  return (
    <div className="space-y-8">
      <SelectedMovieDetails
        movie={selectedMovie}
        liked={isLiked}
        disliked={isDisliked}
        wishlisted={isWishlisted}
        onToggleLike={toggleLike}
        onToggleDislike={toggleDislike}
        onToggleWishlist={toggleWishlist}
      />

      {browseSelection && displayedMovies.length === 0 ? (
        <div className="alert">
          <span>No movies match this selection.</span>
        </div>
      ) : (
        <RecommendedRow
          title={listTitle}
          movies={sortedMovies}
          sortMode={sortMode}
          onSortModeChange={setSortMode}
          selectedKey={selectedKey}
          getMovieKey={getMovieKey}
          onSelect={(movie) => setSelectedKey(getMovieKey(movie))}
        />
      )}
    </div>
  );
}
