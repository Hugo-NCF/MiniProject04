import {
  FaChevronDown,
  FaFilm,
  FaGithub,
  FaInfoCircle,
  FaLock,
  FaEnvelope,
  FaDownload,
} from "react-icons/fa";
import { useCallback, useMemo, useState } from "react";

function defaultMovieKey(movie) {
  return `${movie?.title ?? "movie"}-${movie?.releasing_year ?? ""}-${movie?.director ?? ""}`;
}

function MovieSiteLayout({
  children,
  browseOptions,
  onBrowseSelect,
  movies = [],
  loading = false,
  wishlistedKeys,
  getMovieKey,
  onToggleWishlistKey,
  onClearWishlist,
}) {
  const ageGroups = browseOptions?.ageGroups ?? [];
  const genres = browseOptions?.genres ?? [];
  const decades = browseOptions?.decades ?? [];

  const movieKey = useCallback(
    (movie) => (getMovieKey ?? defaultMovieKey)(movie),
    [getMovieKey],
  );

  const [wishlistOpen, setWishlistOpen] = useState(false);
  const wishlistCount = wishlistedKeys?.size ?? 0;

  const wishlistedMovies = useMemo(() => {
    const set = wishlistedKeys ?? new Set();
    if (!set.size) return [];
    return movies.filter((m) => set.has(movieKey(m)));
  }, [movies, wishlistedKeys, movieKey]);

  function downloadWishlist() {
    const exportList = wishlistedMovies.map((m) => ({
      title: m?.title ?? "",
      director: m?.director ?? "",
      releasing_year: m?.releasing_year ?? null,
      genre: m?.genre ?? "",
      age_group: m?.age_group ?? "",
      runtime: m?.runtime ?? "",
      imdb_rating: m?.imdb_rating ?? null,
      budget: m?.budget ?? "",
      language: m?.language ?? "",
      short_description: m?.short_description ?? "",
    }));

    const json = JSON.stringify(exportList, null, 2);
    const blob = new Blob([json], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const filename = `wishlist-movies-${yyyy}-${mm}-${dd}.json`;

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function closeBrowseDropdown(e) {
    const details = e?.currentTarget?.closest?.("details.dropdown");
    if (details) details.removeAttribute("open");
  }

  return (
    <div className="min-h-screen flex flex-col bg-base-200 w-full">
      
      {/* Header */}
      <header className="navbar bg-base-100 shadow-md px-6 w-full sticky top-0 z-50">

  {/* Left: Logo + Title + Browse */}
  <div className="flex-1 flex items-center gap-6">
    <FaFilm className="text-2xl text-primary" />
    <h1 className="text-2xl font-bold">Movies HD</h1>

    <details className={`dropdown group ${loading ? "opacity-70 pointer-events-none" : ""}`}>
      <summary className="btn btn-ghost list-none" aria-disabled={loading}>
        <span className="flex items-center gap-2">
          <span>Browse</span>
          {loading ? (
            <span className="loading loading-spinner loading-xs" />
          ) : (
            <FaChevronDown className="transition-transform group-open:rotate-180" />
          )}
        </span>
      </summary>

      <ul className="dropdown-content menu bg-base-100 rounded-box z-10 mt-2 w-52 p-2 shadow">
        {loading ? (
          <li>
            <div className="flex items-center justify-center py-6">
              <span className="loading loading-spinner loading-md" />
            </div>
          </li>
        ) : (
          <>
            <li>
              <details>
                <summary>Age group</summary>
                <ul>
                  {ageGroups.map((g) => (
                    <li key={g}>
                      <button
                        type="button"
                        onClick={(e) => {
                          onBrowseSelect?.({ type: "age_group", value: g });
                          closeBrowseDropdown(e);
                        }}
                      >
                        {g}
                      </button>
                    </li>
                  ))}
                </ul>
              </details>
            </li>

            <li>
              <details>
                <summary>Genre</summary>
                <ul>
                  {genres.map((g) => (
                    <li key={g}>
                      <button
                        type="button"
                        onClick={(e) => {
                          onBrowseSelect?.({ type: "genre", value: g });
                          closeBrowseDropdown(e);
                        }}
                      >
                        {g}
                      </button>
                    </li>
                  ))}
                </ul>
              </details>
            </li>

            <li>
              <details>
                <summary>Year</summary>
                <ul>
                  {decades.map((d) => (
                    <li key={d?.start ?? d?.label}>
                      <button
                        type="button"
                        onClick={(e) => {
                          onBrowseSelect?.({ type: "decade", value: d?.start });
                          closeBrowseDropdown(e);
                        }}
                      >
                        {d?.label ?? String(d)}
                      </button>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          </>
        )}
      </ul>
    </details>
  </div>

  {/* Right: Wishlist + Avatar */}
  <div className="flex-none flex items-center gap-4">
    <button
      type="button"
      className="btn btn-ghost"
      onClick={() => setWishlistOpen((v) => !v)}
      aria-expanded={wishlistOpen}
    >
      <span className="flex items-center gap-2">
        <span>Wishlist</span>
        <span className="badge badge-sm rounded-full min-w-5 h-5 px-1 flex items-center justify-center">
          {wishlistCount}
        </span>
      </span>
    </button>
    
    <div className="avatar">
      <div className="w-14 rounded-full">
        <img src="https://img.daisyui.com/images/profile/demo/batperson@192.webp" />
      </div>
    </div>
  </div>

</header>

      {wishlistOpen && (
        <div className="fixed left-0 right-0 bottom-0 top-16 z-40">
          <button
            type="button"
            className="absolute inset-0 bg-base-300/60"
            aria-label="Close wishlist panel"
            onClick={() => setWishlistOpen(false)}
          />

          <aside className="absolute right-0 top-0 h-full w-80 bg-base-100 border-l border-base-300 shadow-lg p-4 overflow-y-auto">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Wishlist</h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={downloadWishlist}
                  disabled={loading || wishlistCount === 0}
                  title={loading ? "Loading…" : wishlistCount === 0 ? "No wishlisted movies" : "Download wishlist"}
                >
                  <FaDownload />
                  Download
                </button>
                {wishlistCount > 0 && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={() => onClearWishlist?.()}
                  >
                    Clear all
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-sm btn-ghost"
                  onClick={() => setWishlistOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <span className="loading loading-spinner loading-md" />
                </div>
              ) : wishlistedMovies.length === 0 ? (
                <div className="text-sm text-base-content/70">No wishlisted movies yet.</div>
              ) : (
                wishlistedMovies.map((m) => (
                  <div key={movieKey(m)} className="p-3 rounded-box border border-base-300 bg-base-200">
                    <div className="flex items-start justify-between gap-3">
                      <div className="font-semibold leading-snug">{m?.title ?? "Untitled"}</div>
                      <button
                        type="button"
                        className="btn btn-xs btn-outline"
                        onClick={() => onToggleWishlistKey?.(movieKey(m))}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-2 items-center text-sm text-base-content/70">
                      {m?.releasing_year != null && (
                        <span className="badge badge-outline">{m.releasing_year}</span>
                      )}
                      {m?.genre && <span className="badge badge-outline">{m.genre}</span>}
                      {m?.age_group && <span className="badge badge-outline">{m.age_group}</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="grow w-full p-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="footer footer-center p-4 bg-base-100 text-base-content shadow-inner w-full">
        <div className="space-y-2">
          <p className="text-sm text-base-content/80">Stream picks. Build your wishlist.</p>
          <p className="text-sm">© {new Date().getFullYear()} Movies HD</p>
          <p className="text-xs text-base-content/60">Data loaded locally from /movies.json</p>

          <div className="flex items-center justify-center gap-5 pt-1">
            <a
              href="#"
              className="link link-hover text-sm inline-flex items-center gap-2"
              onClick={(e) => e.preventDefault()}
            >
              <FaInfoCircle />
              About
            </a>
            <a
              href="#"
              className="link link-hover text-sm inline-flex items-center gap-2"
              onClick={(e) => e.preventDefault()}
            >
              <FaLock />
              Privacy
            </a>
            <a
              href="#"
              className="link link-hover text-sm inline-flex items-center gap-2"
              onClick={(e) => e.preventDefault()}
            >
              <FaGithub />
              GitHub
            </a>
            <a
              href="#"
              className="link link-hover text-sm inline-flex items-center gap-2"
              onClick={(e) => e.preventDefault()}
            >
              <FaEnvelope />
              Contact
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default MovieSiteLayout;