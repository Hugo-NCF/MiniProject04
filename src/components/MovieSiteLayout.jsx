import { FaFilm } from "react-icons/fa";

function MovieSiteLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-base-200 w-full">
      
      {/* Header */}
      <header className="navbar bg-base-100 shadow-md px-6 w-full">
        <div className="flex-1 flex items-center gap-2">
          <FaFilm className="text-2xl text-primary" />
          <h1 className="text-2xl font-bold">Movies HD</h1>
        </div>

        <div className="flex-none">
          <button className="btn btn-ghost">Wishlist</button>
          <button className="btn btn-ghost">Watched</button>
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