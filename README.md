# Album Cover Bank Recreated

A premium, interactive digital archive showcasing the heritage of album art design, inspired by Opemipo Aikomo and the Lagos-based maker collective **wuruwuru**. This application connects directly to the Spotify Web API to catalog and browse historical music releases while providing a community submission workflow to document visual creators and designers.

---

## 🎨 Premium Visual Design System

The application uses custom **Vanilla CSS variables** to establish a high-end, responsive museum-style aesthetic:
- **Color Palette:** Curated cream/beige canvas background (`#FDFBF7`), warm sand modules (`#F5EFEB`), warm charcoal text (`#1D1A18`), and terracotta accents (`#683522`).
- **Typography:** Custom Google Fonts pairing **Fraunces** (a high-character editorial serif for titles) with **Plus Jakarta Sans** (a modern, highly readable geometric sans-serif for tracklists and UI badges).
- **Responsive 1:1 Square Grid:** Adapts dynamically to any screen dimension via CSS Grid with `repeat(auto-fill, minmax(260px, 1fr))` columns while protecting the strict square aspect ratios of album covers.

---

## ✨ Features & Architecture

### 1. High-Fidelity Interactive Cards
Hovering on any cover card triggers a smooth micro-animation: the cover zooms by `10%` and slides up a glassmorphic linear-gradient overlay showcasing the album title, artist, year, designer, and a hover-state call-to-action.

### 2. Advanced Search & Filter drawer
Clicking the filter badge toggles a sliding **Advanced Filters Drawer** with curated options representing the visual history of African & global pop:
- **Eras:** 1970s, 1980s, 1990s, 2000s, 2010s, 2020s.
- **Genres:** Afrobeat, Highlife, Juju, Afropop, Reggae, Jazz, Hip-Hop.
- *API Query Mapping:* Badge selections are compiled into native compound query strings (e.g. `genre:"afrobeat" year:1970-1979`) and sent directly to Spotify's Search API for real-time results.

### 3. Dynamic Details Overlay
Clicking a cover card blurs the page and displays the album's high-res art, release metadata, and:
- **Live Tracklists:** Fetches the album's active tracks directly from Spotify.
- **Official Music Widget:** Embeds a responsive Spotify Web Player so users can stream the music while viewing the design history.
- **Visual Design Stories:** Generates contextual descriptions highlighting the aesthetic trends of the era.

### 4. High-Performance Pagination & Infinite Scroll
- **Ref-Based Pagination:** Uses a stable React `useRef` for pagination offsets instead of state setters. This eliminates scroll-binding layout thrashing, ensuring silky-smooth scrolling.
- **Failsafe Boundaries:** Detects API rate limits and network exceptions to gracefully halt request streams, preventing stuttering loading glitches at boundary limits.

### 5. Community submissions
Since Spotify's native database indexes only audio credits (and omits graphic designers), a customized contribution form allows users to manually catalog designer credits.
- **Thumbnail Presets:** Features one-click cataloging presets (e.g. *Gideon Alabi's Afro-Temple*) to easily test custom additions.
- Submissions prepend seamlessly at the top of the feed and feature a coral **"Community"** badge.

---

## 🚀 Getting Started

### Installation
Ensure you are using the pre-configured Node and package environments. Do not update packages to protect legacy dependency handshakes.
```bash
yarn install
# or
npm install
```

### Run Locally
Launch the Vite development server:
```bash
npm run dev
```
Open **`http://localhost:5173/`** in your browser.

### Build Production Bundle
Build and minify for production:
```bash
npm run build
```

---

## 📝 Spotify API & Visual Credits mapping
Visual designers are mapped dynamically inside `AlbumDetailModal.jsx`:
- **Curated Matches:** Artists like *Fela Kuti* are automatically attributed to the legendary artist **Lemi Ghariokwu** (who illustrated Fela's most famous sleeves).
- **Fallback Guidelines:** Default items are displayed as **"Not Archived"** with an informative prompt explaining API design constraints to encourage community submissions.
