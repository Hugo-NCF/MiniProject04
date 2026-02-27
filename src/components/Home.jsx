import { useCallback, useMemo, useState } from "react";
import RecommendedRow from "./RecommendedRow";
import SelectedMovieDetails from "./SelectedMovieDetails";

function defaultMovieKey(movie) {
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

export default function Home({
  movies = [],
  browseSelection = null,
  getMovieKey,
  wishlistedKeys,
  onToggleWishlistKey,
}) {
  const movieKey = useCallback(
    (movie) => (getMovieKey ?? defaultMovieKey)(movie),
    [getMovieKey],
  );

  const [selectedKey, setSelectedKey] = useState(null);
  const [likedKeys, setLikedKeys] = useState(() => new Set());
  const [dislikedKeys, setDislikedKeys] = useState(() => new Set());
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

  const activeSelectedKey = useMemo(() => {
    if (!sortedMovies.length) return null;
    if (selectedKey != null && sortedMovies.some((m) => movieKey(m) === selectedKey)) {
      return selectedKey;
    }
    return movieKey(sortedMovies[0]);
  }, [movieKey, selectedKey, sortedMovies]);

  const selectedMovie = useMemo(() => {
    if (!activeSelectedKey) return null;
    return movies.find((m) => movieKey(m) === activeSelectedKey) ?? null;
  }, [movies, activeSelectedKey, movieKey]);

  const isLiked = activeSelectedKey != null && likedKeys.has(activeSelectedKey);
  const isDisliked = activeSelectedKey != null && dislikedKeys.has(activeSelectedKey);
  const wishlistSet = wishlistedKeys ?? new Set();
  const isWishlisted = activeSelectedKey != null && wishlistSet.has(activeSelectedKey);

  function toggleLike() {
    if (!activeSelectedKey) return;

    setLikedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(activeSelectedKey)) next.delete(activeSelectedKey);
      else next.add(activeSelectedKey);
      return next;
    });
    setDislikedKeys((prev) => {
      const next = new Set(prev);
      next.delete(activeSelectedKey);
      return next;
    });
  }

  function toggleDislike() {
    if (!activeSelectedKey) return;

    setDislikedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(activeSelectedKey)) next.delete(activeSelectedKey);
      else next.add(activeSelectedKey);
      return next;
    });
    setLikedKeys((prev) => {
      const next = new Set(prev);
      next.delete(activeSelectedKey);
      return next;
    });
  }

  function toggleWishlist() {
    if (!activeSelectedKey) return;
    onToggleWishlistKey?.(activeSelectedKey);
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
          selectedKey={activeSelectedKey}
          getMovieKey={movieKey}
          onSelect={(movie) => setSelectedKey(movieKey(movie))}
        />
      )}
    </div>
  );
}
