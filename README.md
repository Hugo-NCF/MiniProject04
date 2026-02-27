# Movies HD (MiniProject04)

**Group Members:** Darius Beckford, Hugo Cruz

A Vite + React movie browser that loads a local dataset (public/movies.json), lets users browse by **age group / genre / year (decades)**, sort results, and manage a **wishlist** (with download support).

## Netlify Link
https://hdmoviesncf.netlify.app/

## How to run

Install dependencies and start dev server:

```bash
npm install
npm run dev
```

Build / preview:

```bash
npm run build
npm run preview
```

## Component structure

The app is split into focused components:

- src/App.jsx: loads movie data, owns shared app state (browse selection + wishlist)
- src/components/MovieSiteLayout.jsx: header/navbar, wishlist panel UI, footer
- src/components/Home.jsx: selected movie panel + filtered/sorted list logic
- src/components/RecommendedRow.jsx: list row + sort dropdown
- src/components/SelectedMovieDetails.jsx: top details panel UI
- src/components/BaseMovieCard.jsx: movie card used in the carousel/list

## Rubric checklist

1) Make sure to use useEffect and useState properly and apply utility-first CSS for styling.
- Movies are fetched once using useEffect and stored in useState.
- Tailwind/DaisyUI utility classes are used throughout the UI.

2) Create components as necessary to keep the root component (e.g., App) as clean as possible.
- App focuses on data loading + shared state; UI is broken into layout + feature components.

3) Don't forget to add a loader (DaisyUI has some nice ones).
- DaisyUI spinners appear while loading in the main area, Browse dropdown, and wishlist panel.

4) The app should have a title/header with some icon, a navbar, appropriate buttons (like, dislike), and a footer.
- Header includes an icon and a sticky navbar with Browse + Wishlist.
- Like/Dislike/Wishlist buttons are available in the selected-movie panel.
- Footer includes extra content and icon links.

5) The app must include a way for users to find movies by age group, genre, and year.
- Browse dropdown provides age group, genre, and decade/year filtering.

6) The app must include a way for the user to view a sorted list.
- Default sort is by release year (latest → oldest).
- Additional sorts: Rating and Alphabetical.

7) The user must be able to download the list of their wishlisted movies.
- Download button exports the current wishlisted movies to a readable JSON file.

8) Carefully design the frontend; display movie information modularly.
- Details panel and movie metadata are displayed using modular sections/badges.
- Layout is organized into reusable components.

9) Use appropriate messages for search options.
- Alerts appear when a filter results in no matches (e.g., “No movies match this selection.”).

10) Use third-party libraries to make your app look more interesting.
- DaisyUI provides UI components and loaders.
- React Icons provides icons used across the app.
