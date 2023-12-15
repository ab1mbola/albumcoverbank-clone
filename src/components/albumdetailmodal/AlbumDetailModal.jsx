import { useEffect, useState } from "react";
import styles from "./albumdetailmodal.module.css";
import CloseIcon from "@mui/icons-material/Close";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";

const AlbumDetailModal = ({ album, accessToken, onClose }) => {
  const [tracks, setTracks] = useState([]);
  const [loadingTracks, setLoadingTracks] = useState(false);
  const [playingTrackId, setPlayingTrackId] = useState(null);
  const [audio] = useState(new Audio());

  const isSpotify = album && album.id && !album.isSubmitted;
  const albumId = album?.id;

  useEffect(() => {
    if (!album) return;

    // Handle ESC key press to close modal
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Fetch Spotify tracks
    if (isSpotify && accessToken) {
      const fetchTracks = async () => {
        setLoadingTracks(true);
        try {
          const response = await fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks?limit=30`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setTracks(data.items || []);
          }
        } catch (error) {
          console.error("Error fetching album tracks:", error);
        } finally {
          setLoadingTracks(false);
        }
      };
      fetchTracks();
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      audio.pause();
    };
  }, [album, accessToken, isSpotify, albumId, audio, onClose]);

  if (!album) return null;

  const displayImage = album.images && album.images[0] ? album.images[0].url : (album.imageUrl || "");
  const displayArtist = album.artists && album.artists[0] ? album.artists[0].name : (album.artist || "Unknown Artist");
  const displayName = album.name || "Untitled Album";

  // Spotify API doesn't catalog cover designers; attribute Fela Kuti to Lemi Ghariokwu, otherwise show 'Not Archived'
  const getDesignerCredit = () => {
    if (album.designer) return album.designer;
    if (displayArtist.toLowerCase().includes("fela")) return "Lemi Ghariokwu";
    return "Not Archived";
  };

  const displayDesigner = getDesignerCredit();
  const getDynamicGenre = () => {
    if (album.genre) return album.genre;
    const titleLower = displayName.toLowerCase();
    const artistLower = displayArtist.toLowerCase();
    if (artistLower.includes("ebo taylor") || artistLower.includes("highlife") || titleLower.includes("highlife")) return "Highlife";
    if (artistLower.includes("ade") || artistLower.includes("obey") || artistLower.includes("juju")) return "Juju";
    if (artistLower.includes("fela") || artistLower.includes("africa 70") || artistLower.includes("tony allen") || artistLower.includes("afrobeat")) return "Afrobeat";
    return "Official Release";
  };

  const displayGenre = getDynamicGenre();
  const displayYear = album.year || (album.release_date ? album.release_date.split("-")[0] : "N/A");

  // Pre-configured rich descriptions of covers to feel highly premium
  const getDesignerStory = () => {
    if (album.isSubmitted) {
      return `This record was added to our archive by a member of the community. It represents the gorgeous design landscape of the era. Preserving and showcasing the rich artwork of ${displayArtist} from ${displayYear}.`;
    }
    if (displayDesigner === "Not Archived") {
      return `Spotify's API does not catalog graphic artist or visual design credits. We are currently researching the cover artist for "${displayName}". If you know who designed this cover, click 'Submit a Cover' to update our archive!`;
    }
    return `An outstanding visual artifact of its time. The artwork for "${displayName}" showcases the unique design aesthetic and typographic style of the legendary designer ${displayDesigner}. Hand-selected to celebrate graphic excellence in musical preservation.`;
  };

  const playPreview = (track) => {
    if (!track.preview_url) return;

    if (playingTrackId === track.id) {
      audio.pause();
      setPlayingTrackId(null);
    } else {
      audio.src = track.preview_url;
      audio.play();
      setPlayingTrackId(track.id);

      audio.onended = () => {
        setPlayingTrackId(null);
      };
    }
  };

  const formatDuration = (ms) => {
    const min = Math.floor(ms / 60000);
    const sec = ((ms % 60000) / 1000).toFixed(0);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div className={styles["modal-backdrop"]} onClick={onClose}>
      <div className={styles["modal-container"]} onClick={(e) => e.stopPropagation()}>
        <button className={styles["close-btn"]} onClick={onClose} aria-label="Close modal">
          <CloseIcon />
        </button>

        <div className={styles["modal-grid"]}>
          {/* Cover Art Column */}
          <div className={styles["cover-column"]}>
            <div className={styles["image-wrapper"]}>
              <img src={displayImage} alt={displayName} />
            </div>
            {isSpotify && (
              <div className={styles["embed-player"]}>
                <iframe
                  src={`https://open.spotify.com/embed/album/${albumId}`}
                  width="100%"
                  height="80"
                  frameBorder="0"
                  allowtransparency="true"
                  allow="encrypted-media"
                  title="Spotify Player"
                ></iframe>
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className={styles["details-column"]}>
            <div className={styles.header}>
              <div className={styles.meta}>
                <span className={styles.badge}>{displayGenre}</span>
                <span className={styles.year}>{displayYear}</span>
              </div>
              <h2 className={styles.title}>
                <a
                  href={album.external_urls?.spotify || `https://www.google.com/search?q=${encodeURIComponent(displayArtist + " " + displayName + " album")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles["source-link"]}
                  title="View original album source"
                >
                  {displayName}
                </a>
              </h2>
              <h3 className={styles.artist}>
                by{" "}
                <a
                  href={(album.artists && album.artists[0]?.external_urls?.spotify) || `https://www.google.com/search?q=${encodeURIComponent(displayArtist)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles["source-link"]}
                  title="View artist profile"
                >
                  {displayArtist}
                </a>
              </h3>
            </div>

            <div className={styles["designer-section"]}>
              <h4 className={styles["section-title"]}>Cover Design History</h4>
              <p className={styles.designer}>
                Graphic Designer: <span>{displayDesigner}</span>
              </p>
              <p className={styles.story}>{getDesignerStory()}</p>
            </div>

            <div className={styles["tracks-section"]}>
              <h4 className={styles["section-title"]}>
                <LibraryMusicIcon className={styles["tracks-icon"]} /> Tracklist & Sound Bites
              </h4>

              {loadingTracks ? (
                <div className={styles.loader}>
                  <div className={styles.spinner}></div>
                  <span>Fetching tracklist...</span>
                </div>
              ) : tracks.length > 0 ? (
                <div className={styles["tracks-list"]}>
                  {tracks.map((track) => (
                    <div
                      key={track.id}
                      className={`${styles["track-row"]} ${track.preview_url ? styles["has-preview"] : ""}`}
                    >
                      <span className={styles["track-num"]}>{track.track_number}</span>
                      <span className={styles["track-name"]}>{track.name}</span>
                      <div className={styles["track-right"]}>
                        <span className={styles["track-time"]}>{formatDuration(track.duration_ms)}</span>
                        {track.preview_url && (
                          <button
                            className={`${styles["play-btn"]} ${playingTrackId === track.id ? styles.playing : ""}`}
                            onClick={() => playPreview(track)}
                            title={playingTrackId === track.id ? "Pause Preview" : "Play Sound Bite"}
                          >
                            {playingTrackId === track.id ? <PauseIcon /> : <PlayArrowIcon />}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles["no-tracks"]}>
                  <p>Archived visual asset. Audio details loaded dynamically for Spotify items.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumDetailModal;
