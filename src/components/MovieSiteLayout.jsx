import { FaChevronDown, FaFilm } from "react-icons/fa";

function MovieSiteLayout({ children, browseOptions, onBrowseSelect }) {
  const ageGroups = browseOptions?.ageGroups ?? [];
  const genres = browseOptions?.genres ?? [];
  const decades = browseOptions?.decades ?? [];

  function closeBrowseDropdown(e) {
    const details = e?.currentTarget?.closest?.("details.dropdown");
    if (details) details.removeAttribute("open");
  }

  return (
    <div className="min-h-screen flex flex-col bg-base-200 w-full">
      
      {/* Header */}
      <header className="navbar bg-base-100 shadow-md px-6 w-full">

  {/* Left: Logo + Title + Browse */}
  <div className="flex-1 flex items-center gap-6">
    <FaFilm className="text-2xl text-primary" />
    <h1 className="text-2xl font-bold">Movies HD</h1>

    <details className="dropdown group">
      <summary className="btn btn-ghost list-none">
        Browse
        <FaChevronDown className="ml-1 transition-transform group-open:rotate-180" />
      </summary>

      <ul className="dropdown-content menu bg-base-100 rounded-box z-10 mt-2 w-52 p-2 shadow">
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
      </ul>
    </details>
  </div>

  {/* Right: Wishlist + Avatar */}
  <div className="flex-none flex items-center gap-4">
    <button className="btn btn-ghost">Wishlist</button>
    
    <div className="avatar">
      <div className="w-14 rounded-full">
        <img src="https://img.daisyui.com/images/profile/demo/batperson@192.webp" />
      </div>
    </div>
  </div>

</header>

      {/* Main Content */}
      <main className="flex-grow w-full p-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="footer footer-center p-4 bg-base-100 text-base-content shadow-inner w-full">
        <p>
          © {new Date().getFullYear()} Movies HD
        </p>
      </footer>

    </div>
  );
}

export default MovieSiteLayout;