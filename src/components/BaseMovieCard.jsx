function splitBadges(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  return String(value)
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export default function BaseMovieCard({ movie, selected = false, onSelect }) {
  const title = movie?.title ?? "Untitled";
  const year = movie?.releasing_year;
  const ageGroup = movie?.age_group;
  const genres = splitBadges(movie?.genre).slice(0, 2);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.(movie)}
      onKeyDown={(e) =>
        e.key === "Enter" || e.key === " " ? onSelect?.(movie) : null
      }
      className={[
        "card bg-base-100 border border-base-300 shadow-sm cursor-pointer",
        "transition hover:shadow-md hover:border-base-content",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-base-content",
        "w-full h-full",
        selected ? "border-2 border-base-content shadow-md" : "",
      ].join(" ")}
    >
      <div className="flex flex-col h-full">
        {/* Placeholder poster area */}
        <div className="flex-1 bg-base-200 border-b border-base-300 flex items-center justify-center">
          <span className="text-base-content/50 text-sm font-medium">[Placeholder]</span>
        </div>

        {/* Essential info anchored at the bottom */}
        <div className="p-3 space-y-2">
          <h3 className="text-sm font-semibold leading-tight line-clamp-2">{title}</h3>

          <div className="flex flex-wrap gap-2 items-center">
            {year != null && <span className="badge badge-sm badge-ghost">{year}</span>}
            {ageGroup && <span className="badge badge-sm badge-outline">{ageGroup}</span>}
            {genres.map((g) => (
              <span key={g} className="badge badge-sm badge-secondary badge-outline">
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
