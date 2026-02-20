import { FaFilm, FaSearch } from "react-icons/fa";

function MovieSiteLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-base-200 w-full">
      
      {/* Header */}
      <header className="navbar bg-base-100 shadow-md px-6 w-full">

  {/* Left: Logo + Title + Search */}
  <div className="flex-1 flex items-center gap-6">
    <FaFilm className="text-2xl text-primary" />
    <h1 className="text-2xl font-bold">Movies HD</h1>

    <label className="input input-bordered flex items-center gap-2 w-80">
      <FaSearch className="opacity-60" />
      <input
        type="text"
        className="grow"
        placeholder="Search movies..."
      />
    </label>
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