import { useEffect, useState, useRef, useCallback } from "react";
import styles from "./App.module.css";
import AlbumCard from "./components/albumcard/AlbumCard";
import Searchbar from "./components/searchbar/Searchbar";
import AlbumDetailModal from "./components/albumdetailmodal/AlbumDetailModal";
import SubmitModal from "./components/submitmodal/SubmitModal";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

const CLIENT_ID = "YOUR_SPOTIFY_CLIENT_ID";
const CLIENT_SECRET = "YOUR_SPOTIFY_CLIENT_SECRET";
const PAGE_SIZE = 20;

// Curated beautiful initial community album covers to showcase Nigerian/African art immediately
const INITIAL_SUBMISSIONS = [
  {
    name: "Zombie",
    artist: "Fela Anikulapo Kuti & Africa 70",
    designer: "Lemi Ghariokwu",
    year: "1976",
    genre: "Afrobeat",
    imageUrl: "https://i.scdn.co/image/ab67616d0000b273468532402120005a9163013b",
    isSubmitted: true,
  },
  {
    name: "Gentleman",
    artist: "Fela Kuti",
    designer: "Bob Group",
    year: "1973",
    genre: "Afrobeat",
    imageUrl: "https://i.scdn.co/image/ab67616d0000b2734a7495444855734280540131",
    isSubmitted: true,
  },
];

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);
  const offsetRef = useRef(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Search and filter parameters state
  const [activeQuery, setActiveQuery] = useState("");
  const [activeGenre, setActiveGenre] = useState("");
  const [activeEra, setActiveEra] = useState("");

  // UI state
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Community-submitted custom covers state
  const [submittedCovers, setSubmittedCovers] = useState(INITIAL_SUBMISSIONS);

  // Guards against duplicate fetches (StrictMode)
  const isFetchingRef = useRef(false);
  const lastOffsetRef = useRef(-1);

  // 1. Fetch access token on mount
  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const authParameters = {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
        };
        const response = await fetch("https://accounts.spotify.com/api/token", authParameters);
        if (response.ok) {
          const data = await response.json();
          setAccessToken(data.access_token);
        } else {
          console.error("Failed to fetch Spotify access token");
        }
      } catch (err) {
        console.error("Network error fetching Spotify token:", err);
      }
    };
    fetchAccessToken();
  }, []);

  // 2. Core unified album fetch logic
  const fetchAlbums = useCallback(
    async ({ query = activeQuery, genre = activeGenre, era = activeEra, reset = false } = {}) => {
      if (!accessToken) return;
      if (isFetchingRef.current) return;

      const currentOffset = reset ? 0 : offsetRef.current;

      // Prevent duplicate fetches for the same offset and configuration
      if (!reset && currentOffset === lastOffsetRef.current) return;

      isFetchingRef.current = true;
      setLoading(true);
      lastOffsetRef.current = currentOffset;

      try {
        let endpoint = "";
        const isFiltering = query || genre || era;

        if (!isFiltering) {
          // Default: fetch new releases
          endpoint = `https://api.spotify.com/v1/browse/new-releases?limit=${PAGE_SIZE}&offset=${currentOffset}`;
        } else {
          // Filtered Search: construct advanced Spotify search query
          let q = "";
          if (query) q += query;
          if (genre) q += `${q ? " " : ""}genre:"${genre.toLowerCase()}"`;
          if (era) q += `${q ? " " : ""}year:${era}`;
          
          endpoint = `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=album&limit=${PAGE_SIZE}&offset=${currentOffset}`;
        }

        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const items = data.albums ? data.albums.items : [];

          if (reset) {
            setAlbums(items);
            offsetRef.current = PAGE_SIZE;
          } else {
            setAlbums((prev) => [...prev, ...items]);
            offsetRef.current = currentOffset + PAGE_SIZE;
          }

          // If we received fewer items than requested or hit an empty page, we've hit the end
          setHasMore(items.length === PAGE_SIZE && items.length > 0);
        } else {
          console.error("API error fetching covers");
          setHasMore(false); // Stop trying to infinite scroll if the API hits a limit or throws error
        }
      } catch (error) {
        console.error("Network error fetching covers:", error);
        setHasMore(false); // Stop trying to fetch on network errors
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    },
    [accessToken, activeQuery, activeGenre, activeEra]
  );

  // Trigger initial load when access token is loaded
  useEffect(() => {
    if (accessToken) {
      fetchAlbums({ reset: true });
    }
  }, [accessToken, fetchAlbums]);

  // 3. Search and filter update handler
  const handleSearchAndFilters = ({ query, genre, era, reset }) => {
    setActiveQuery(query);
    setActiveGenre(genre);
    setActiveEra(era);
    fetchAlbums({ query, genre, era, reset });
  };

  // 4. Infinite scroll & UI controls
  const handleScroll = useCallback(() => {
    // Back to top visibility
    if (window.scrollY > 400) {
      setShowBackToTop(true);
    } else {
      setShowBackToTop(false);
    }

    if (loading || !hasMore || !accessToken) return;

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollHeight - scrollTop - clientHeight < 250) {
      fetchAlbums({ reset: false });
    }
  }, [loading, hasMore, accessToken, fetchAlbums]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  // 5. Submitted Cover custom integration
  const handleNewSubmission = (newCover) => {
    setSubmittedCovers((prev) => [newCover, ...prev]);
    setIsSubmitModalOpen(false);
    // Scroll smoothly to top to highlight submission
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 6. Filter user-submitted items locally based on search parameters
  const filteredSubmissions = submittedCovers.filter((item) => {
    if (activeGenre && item.genre.toLowerCase() !== activeGenre.toLowerCase()) return false;
    if (activeEra) {
      const [start, end] = activeEra.split("-").map(Number);
      const itemYear = Number(item.year);
      if (isNaN(itemYear) || itemYear < start || itemYear > end) return false;
    }
    if (activeQuery) {
      const q = activeQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchArtist = item.artist.toLowerCase().includes(q);
      const matchDesigner = item.designer?.toLowerCase().includes(q);
      if (!matchName && !matchArtist && !matchDesigner) return false;
    }
    return true;
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Prepend community submissions to our display grid
  const allDisplayedAlbums = [...filteredSubmissions, ...albums];

  return (
    <>
      {/* Sticky Premium Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          ALBUM<span>COVER</span>BANK
        </div>
        <div className={styles["nav-links"]}>
          <span className={styles["nav-link"]} onClick={() => setIsSubmitModalOpen(true)}>
            Submit a Cover
          </span>
          <a
            href="https://github.com/wuruwuru/album-cover-bank"
            target="_blank"
            rel="noreferrer"
            className={styles["nav-link"]}
          >
            Archive GitHub
          </a>
          <button className={styles["submit-btn"]} onClick={() => setIsSubmitModalOpen(true)}>
            Contribute Art
          </button>
        </div>
      </nav>

      <div className={styles["app-container"]}>
        {/* Decorative Hero Banner */}
        <header className={styles["hero-section"]}>
          <h1>Explore the heritage of cover design.</h1>
          <p>
            An archive of legendary album covers documenting graphic design history. Filter by era, genre, and search musicians or designers.
          </p>
        </header>

        {/* Dynamic Search & Filters Area */}
        <Searchbar onSearch={handleSearchAndFilters} loading={loading} />

        {/* Display Grid of Albums */}
        {allDisplayedAlbums.length > 0 ? (
          <div className={styles["grid-container"]}>
            {allDisplayedAlbums.map((album, i) => (
              <AlbumCard
                key={`${album.id || album.name}-${i}`}
                {...album}
                onClick={() => setSelectedAlbum(album)}
              />
            ))}
          </div>
        ) : (
          !loading && (
            <div className={styles["loader-container"]}>
              <AutoAwesomeIcon style={{ fontSize: 48, color: "var(--accent-color)", opacity: 0.6 }} />
              <span className={styles["loader-text"]}>No album covers found for active search terms.</span>
            </div>
          )
        )}

        {/* Shimmer/Loader Indicator */}
        {loading && (
          <div className={styles["loader-container"]}>
            <div className={styles.spinner}></div>
            <span className={styles["loader-text"]}>Loading archives...</span>
          </div>
        )}

        {/* Footer */}
        <footer className={styles.footer}>
          <p>© {new Date().getFullYear()} Album Cover Bank clone. Handcrafted with React & Spotify Web API.</p>
        </footer>
      </div>

      {/* Floating Back to Top control */}
      {showBackToTop && (
        <button className={styles["back-to-top"]} onClick={scrollToTop} title="Scroll back to top">
          <ArrowUpwardIcon />
        </button>
      )}

      {/* Dynamic Detail Overlay Dialog */}
      {selectedAlbum && (
        <AlbumDetailModal
          album={selectedAlbum}
          accessToken={accessToken}
          onClose={() => setSelectedAlbum(null)}
        />
      )}

      {/* Community Submit Dialog */}
      <SubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmit={handleNewSubmission}
      />
    </>
  );
}

export default App;
