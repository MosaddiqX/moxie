# 🎬 Moxie Movie App - Development Documentation


## 🚀 Overview

**Moxie: Discover, Explore, and Personalize Your Movie Experience**

Moxie is a premium movie discovery platform built with modern web technologies, including Next.js, React, and TypeScript. Integrated with The Movie Database (TMDB) API, Moxie provides a seamless, visually stunning experience for users to explore movies, manage watchlists, save favorites, and receive personalized recommendations—all wrapped in a sleek, dark-mode interface.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Architecture](#️-architecture)
- [Recommendation Algorithm](#-recommendation-algorithm)
- [Development Process](#️-development-process)
- [Future Enhancements](#-future-enhancements)
- [Installation and Setup](#-installation-and-setup)
- [Usage](#-usage)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Features

- **Movie Discovery**: Browse trending, popular, and top-rated movies effortlessly.
- **Personalized Recommendations**: Get tailored movie suggestions based on your interactions.
- **Watchlist & Favorites**: Save movies to revisit or mark as favorites with ease.
- **Recently Viewed**: Track your recently explored movies.
- **Advanced Search**: Find movies by title, genre, or year with optimized, debounced search.
- **Responsive Design**: Enjoy a consistent experience across mobile, tablet, and desktop.
- **Animations**: Delightful micro-interactions and transitions powered by Framer Motion.

---

## 🛠️ Tech Stack

| **Category**         | **Technology**          |
| -------------------- | ----------------------- |
| **Framework**        | Next.js 14 (App Router) |
| **UI Library**       | React with TypeScript   |
| **Styling**          | Tailwind CSS, shadcn/ui |
| **Animation**        | Framer Motion           |
| **State Management** | React Hooks, Context    |
| **API**              | TMDB API                |
| **Deployment**       | Vercel                  |

---

## 🏗️ Architecture

Moxie leverages Next.js 14 with the App Router for server-side rendering and static site generation, ensuring scalability and performance. The architecture emphasizes reusable components and a clear separation of concerns.

### Key Components

- **Core Pages**:

  - **Home**: Showcases featured movies and carousels.
  - **Movie Detail**: Displays detailed movie info with a parallax header.
  - **Person Detail**: Profiles actors and directors with sticky scrolling.
  - **Movies**: Offers search and filtering capabilities.
  - **Collections**: Manages Watchlist, Favorites, and Recently Viewed.

- **Custom Hooks**:

  - `useLocalStorage`: Persists user preferences.
  - `useFavorites`: Handles favorite movies.
  - `useWatchlist`: Manages watchlist with import/export options.
  - `useRecentlyViewed`: Tracks viewing history.
  - `useRecommendations`: Generates personalized suggestions.
  - `useDebounce`: Optimizes search performance.

- **UI Components**:
  - `MovieCard`: Reusable card with hover effects.
  - `MovieCarousel`: Scrollable movie lists.
  - `HeroSection`: Animated featured movie showcase.
  - `MovieDetailHero`: Parallax movie header.
  - `PersonDetailHero`: Sticky actor/director profile.
  - `Navbar`: Responsive navigation with mobile menu.
  - `BrandLogo`: Theme-aware animated logo.

---

## 🤖 Recommendation Algorithm

Moxie’s recommendation system personalizes movie suggestions based on user behavior. Here’s how it works:

1. **Data Collection**:

   - Tracks Recently Viewed, Favorites, and Watchlist movies.

2. **Genre-Based Weighting**:

   - Assigns weights to genres:
     - Recently Viewed: 1x (with recency bias).
     - Favorites: 2x (strong preference).
     - Watchlist: 1.5x (interest indicator).

3. **Score Calculation**:

   - Computes cumulative genre scores and ranks them.

4. **Movie Selection**:

   - Fetches movies from the top 2 genres.
   - Excludes duplicates and previously interacted movies.
   - Sorts by popularity, limiting to 12 results.

5. **Fallback Mechanism**:
   - Uses interaction history directly if genre data is limited.

---

## 🛠️ Development Process

### Design Philosophy

- **User-Centric**: Focuses on content discovery, visual appeal, and a cinematic dark mode.
- **Performance**: Employs lazy loading, code splitting, and debounced search.
- **Progressive Enhancement**: Ensures core features work without JavaScript, with animations as bonuses.

### Challenges & Solutions

- **State Management**:
  - _Challenge_: Persisting user preferences.
  - _Solution_: Custom hooks with localStorage and initialization checks.
- **API Integration**:
  - _Challenge_: Managing rate limits and data consistency.
  - _Solution_: Structured API calls with error handling.
- **Responsive Design**:
  - _Challenge_: Consistent visuals across devices.
  - _Solution_: Mobile-first approach with breakpoint-specific layouts.
- **Animation Performance**:
  - _Challenge_: Smooth animations without lag.
  - _Solution_: Framer Motion with hardware acceleration.
- **Recommendation Quality**:
  - _Challenge_: Relevant suggestions with limited data.
  - _Solution_: Weighted genre algorithm with fallbacks.

---

## 🔮 Future Enhancements

- **Authentication**: Add user accounts with cloud sync and social features.
- **Advanced Recommendations**: Implement machine learning for better personalization.
- **Content Expansion**: Include TV shows and streaming availability.
- **Performance**: Optimize server-side rendering and image loading.
- **Accessibility**: Enhance keyboard navigation and screen reader support.

---

## 📦 Installation and Setup

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/MosaddiqX/moxie.git
   cd moxie
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Set Environment Variables**:

   - Create a `.env.local` file:
     ```env
     NEXT_PUBLIC_TMDB_API_KEY=your_api_key_here
     ```

4. **Run the Development Server**:

   ```bash
   npm run dev
   ```

5. **Open the App**:
   - Visit `http://localhost:3000` in your browser.

---

## 📖 Usage

- **Explore Movies**: Browse the home page or search for titles.
- **Manage Collections**: Add movies to your Watchlist or Favorites.
- **View Recommendations**: Check personalized suggestions.
- **Track History**: Access recently viewed movies in Collections.

---

## 🤝 Contributing

We’d love your help to improve Moxie! To contribute:

1. Fork the repository.
2. Create a feature or bugfix branch.
3. Commit changes with clear messages.
4. Submit a pull request with a detailed description.

---

## 📄 License

This project is OpenSource

---

_Built with ❤️ by [Mosddique]_
