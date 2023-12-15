import { useEffect, useState, useRef } from "react";
import styles from "./App.module.css";
import AlbumCard from "./components/albumcard/AlbumCard";
import Searchbar from "./components/searchbar/Searchbar";

const CLIENT_ID = "YOUR_SPOTIFY_CLIENT_ID";
const CLIENT_SECRET = "YOUR_SPOTIFY_CLIENT_SECRET";

const PAGE_SIZE = 20; // Number of albums to fetch per page

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  const fetchNewReleases = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `https://api.spotify.com/v1/browse/new-releases?limit=${PAGE_SIZE}&offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAlbums((prevAlbums) => [...prevAlbums, ...data.albums.items]);
        setOffset(offset + PAGE_SIZE);
      } else {
        console.error("Failed to fetch new releases");
      }
    } catch (error) {
      console.error("Error fetching new releases:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = containerRef.current;

    if (scrollHeight - scrollTop === clientHeight && !loading) {
      fetchNewReleases();
    }
  };

  useEffect(() => {
    const fetchAccessToken = async () => {
      const authParameters = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body:
          "grant_type=client_credentials&client_id=" +
          CLIENT_ID +
          "&client_secret=" +
          CLIENT_SECRET,
      };

      const response = await fetch("https://accounts.spotify.com/api/token", authParameters);
      const data = await response.json();
      setAccessToken(data.access_token);
    };

    fetchAccessToken();
  }, []);

  useEffect(() => {
    fetchNewReleases();
  }, [accessToken]); // Fetch new releases when accessToken changes

  useEffect(() => {
    // Attach scroll event listener
    const container = containerRef.current;
    container.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <>
      <div className={styles["app-container"]} ref={containerRef}>
        <div className={styles.header}>
          <h2>Explore Various Album Covers</h2>
        </div>

        <Searchbar accessToken={accessToken} setAlbums={setAlbums} />

        <div className={styles.container}></div>

        <div className={styles["grid-container"]}>
          {albums.map((album, i) => (
            <AlbumCard key={i} albums={albums} {...album} />
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
