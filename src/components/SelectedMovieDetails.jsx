import { FaHeart, FaRegHeart, FaThumbsDown, FaThumbsUp } from "react-icons/fa";

function formatValue(value) {
  if (value == null) return "-";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function parseRuntimeMinutes(value) {
  if (value == null) return null;

  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.floor(value));
  }

  const text = String(value).trim();
  if (!text) return null;

  const minutesMatch = text.match(/(\d+)\s*(?:min|mins|m|minutes?)\b/i);
  if (minutesMatch) return Math.max(0, parseInt(minutesMatch[1], 10));

  const bareNumberMatch = text.match(/^(\d+)$/);
  if (bareNumberMatch) return Math.max(0, parseInt(bareNumberMatch[1], 10));

  return null;
}

function formatRuntime(value) {
  const minutes = parseRuntimeMinutes(value);
  if (minutes == null) return formatValue(value);

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0 && remainingMinutes === 0) return `${hours}h`;
  return `${hours}h ${remainingMinutes}m`;
}

function valueBadgeText(key, value) {
  const text = formatValue(value);

  // Show value only (no "releasing year:" prefix), but keep a hint for a few ambiguous fields.
  if (key === "releasing_year") return text;
  if (key === "age_group") return text;
  if (key === "genre") return text;
  if (key === "runtime") return formatRuntime(value);
  return text;
}

function StarIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={["block shrink-0", className].filter(Boolean).join(" ")}
      fill="currentColor"
    >
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

function PreciseStars({ value, max = 10 }) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;

  const clamped = Math.max(0, Math.min(max, numeric));
  const percent = (clamped / max) * 100;

  return (
    <div className="relative inline-block h-4 leading-none">
      <div className="flex items-center h-4 text-base-content/30">
        {Array.from({ length: 5 }, (_, i) => (
          <StarIcon key={i} className="w-4 h-4" />
        ))}
      </div>
      <div className="absolute top-0 left-0 h-4 overflow-hidden" style={{ width: `${percent}%` }}>
        <div className="flex items-center h-4 text-warning">
          {Array.from({ length: 5 }, (_, i) => (
            <StarIcon key={i} className="w-4 h-4" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SelectedMovieDetails({
  movie,
  liked = false,
  disliked = false,
  wishlisted = false,
  onToggleLike,
  onToggleDislike,
  onToggleWishlist,
}) {
  if (!movie) return null;

  const title = movie?.title ?? "Untitled";

  const badgeExcludedKeys = new Set([
    "title",
    "director",
    "budget",
    "short_description",
    "imdb_rating",
  ]);
  const badgeEntries = Object.entries(movie).filter(
    ([key, value]) => !badgeExcludedKeys.has(key) && value != null && value !== "",
  );

  const imdbRating = movie?.imdb_rating;
  const hasImdb = Number.isFinite(Number(imdbRating));

  return (
    <section className="card bg-base-100 border border-base-300 shadow-md">
      <div className="card-body gap-4">
        <div className="grid gap-4 md:grid-cols-[2fr_3fr] items-start md:items-center md:min-h-80">
          {/* Info (left) */}
          <div className="flex flex-col gap-3 min-w-0">
            <div>
              <h2 className="text-3xl font-semibold leading-tight">{title}</h2>
            </div>

            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-3">
              {hasImdb && (
                <div className="flex items-center gap-2">
                  <PreciseStars value={imdbRating} />
                  <span className="text-sm text-base-content/70">
                    {Number(imdbRating).toFixed(1)}
                  </span>
                </div>
              )}

              <div className="flex flex-wrap gap-2 items-center">
                {badgeEntries.map(([key, value]) => (
                  <span key={key} className="badge badge-outline">
                    {valueBadgeText(key, value)}
                  </span>
                ))}
              </div>
            </div>

            {/* Description under everything */}
            {movie?.short_description && (
              <p className="text-[1.05rem] leading-relaxed text-base-content/80">
                {movie.short_description}
              </p>
            )}

            {(movie?.director || movie?.budget || onToggleLike || onToggleDislike || onToggleWishlist) && (
              <div className="mt-25 flex items-start justify-between gap-4 text-sm text-base-content/70">
                <div className="space-y-1">
                  {movie?.director && <div>Director: {formatValue(movie.director)}</div>}
                  {movie?.budget && <div>Budget: {formatValue(movie.budget)}</div>}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    className={["btn btn-sm btn-square", liked ? "btn-active" : "btn-outline"].join(" ")}
                    onClick={onToggleLike}
                    aria-pressed={liked}
                    disabled={!onToggleLike}
                    title="Like"
                  >
                    <FaThumbsUp />
                  </button>

                  <button
                    type="button"
                    className={["btn btn-sm btn-square", disliked ? "btn-active" : "btn-outline"].join(" ")}
                    onClick={onToggleDislike}
                    aria-pressed={disliked}
                    disabled={!onToggleDislike}
                    title="Dislike"
                  >
                    <FaThumbsDown />
                  </button>

                  <button
                    type="button"
                    className={["btn btn-sm", wishlisted ? "btn-active" : "btn-outline"].join(" ")}
                    onClick={onToggleWishlist}
                    aria-pressed={wishlisted}
                    disabled={!onToggleWishlist}
                    title="Add to wishlist"
                  >
                    {wishlisted ? <FaHeart /> : <FaRegHeart />}
                    <span className="hidden sm:inline">Wishlist</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Picture (right) */}
          <div className="w-full">
            <div className="w-full h-full min-h-80 bg-base-200 border border-base-300 rounded-box flex items-center justify-center">
              <span className="text-base-content/50 text-lg font-semibold">[Poster Placeholder]</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
