import { useEffect, useState } from "react";
import styles from "./submitmodal.module.css";
import CloseIcon from "@mui/icons-material/Close";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";

const GENRES = ["Afrobeat", "Highlife", "Juju", "Afropop", "Reggae", "Jazz", "Hip-Hop", "Electronic", "Rock"];

// Some curated beautiful album cover images to act as premium defaults if the user wants to test easily
const PRESET_COVERS = [
  {
    name: "Afro-Temple",
    artist: "Gideon Alabi",
    url: "https://images.unsplash.com/photo-1546074177-3e1b6a7a57c9?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Golden Highlife Sessions",
    artist: "Ebo Taylor Orchestra",
    url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Sun and Rhythms",
    artist: "The Lijadu Sisters",
    url: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=600&auto=format&fit=crop",
  },
];

const SubmitModal = ({ isOpen, onClose, onSubmit }) => {
  const [albumTitle, setAlbumTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [designerName, setDesignerName] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Afrobeat");
  const [imageUrl, setImageUrl] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const tempErrors = {};
    if (!albumTitle.trim()) tempErrors.albumTitle = "Album Title is required";
    if (!artistName.trim()) tempErrors.artistName = "Artist Name is required";
    if (!designerName.trim()) tempErrors.designerName = "Cover Designer is required";
    if (!releaseYear.trim() || isNaN(releaseYear) || parseInt(releaseYear) < 1900 || parseInt(releaseYear) > 2030) {
      tempErrors.releaseYear = "Enter a valid year (1900 - 2030)";
    }
    if (!imageUrl.trim() || !imageUrl.startsWith("http")) {
      tempErrors.imageUrl = "Please enter a valid image URL starting with http/https";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        name: albumTitle,
        artist: artistName,
        designer: designerName,
        year: releaseYear,
        genre: selectedGenre,
        imageUrl: imageUrl,
        isSubmitted: true,
      });
      // Clear form
      setAlbumTitle("");
      setArtistName("");
      setDesignerName("");
      setReleaseYear("");
      setSelectedGenre("Afrobeat");
      setImageUrl("");
      setErrors({});
    }
  };

  const selectPreset = (preset) => {
    setAlbumTitle(preset.name);
    setArtistName(preset.artist);
    setImageUrl(preset.url);
  };

  return (
    <div className={styles["modal-backdrop"]} onClick={onClose}>
      <div className={styles["modal-container"]} onClick={(e) => e.stopPropagation()}>
        <button className={styles["close-btn"]} onClick={onClose} aria-label="Close modal">
          <CloseIcon />
        </button>

        <div className={styles["modal-header"]}>
          <h2 className={styles.title}>Submit a Cover to the Bank</h2>
          <p className={styles.subtitle}>
            Help us expand the digital archive. Share historically significant or visually stunning Nigerian and global album art.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles["form-grid"]}>
            <div className={styles["form-group"]}>
              <label htmlFor="albumTitle">Album Title</label>
              <input
                type="text"
                id="albumTitle"
                value={albumTitle}
                onChange={(e) => setAlbumTitle(e.target.value)}
                placeholder="e.g., Zombie"
                className={errors.albumTitle ? styles["input-error"] : ""}
              />
              {errors.albumTitle && <span className={styles["error-msg"]}>{errors.albumTitle}</span>}
            </div>

            <div className={styles["form-group"]}>
              <label htmlFor="artistName">Musician / Artist</label>
              <input
                type="text"
                id="artistName"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                placeholder="e.g., Fela Kuti"
                className={errors.artistName ? styles["input-error"] : ""}
              />
              {errors.artistName && <span className={styles["error-msg"]}>{errors.artistName}</span>}
            </div>

            <div className={styles["form-group"]}>
              <label htmlFor="designerName">Cover Designer</label>
              <input
                type="text"
                id="designerName"
                value={designerName}
                onChange={(e) => setDesignerName(e.target.value)}
                placeholder="e.g., Lemi Ghariokwu"
                className={errors.designerName ? styles["input-error"] : ""}
              />
              {errors.designerName && <span className={styles["error-msg"]}>{errors.designerName}</span>}
            </div>

            <div className={styles["form-group"]}>
              <label htmlFor="releaseYear">Release Year</label>
              <input
                type="text"
                id="releaseYear"
                value={releaseYear}
                onChange={(e) => setReleaseYear(e.target.value)}
                placeholder="e.g., 1976"
                className={errors.releaseYear ? styles["input-error"] : ""}
              />
              {errors.releaseYear && <span className={styles["error-msg"]}>{errors.releaseYear}</span>}
            </div>

            <div className={styles["form-group"]}>
              <label htmlFor="genre">Music Genre</label>
              <select id="genre" value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
                {GENRES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles["form-group"]}>
              <label htmlFor="imageUrl">Cover Art Image URL</label>
              <input
                type="text"
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="e.g., https://images.unsplash.com/..."
                className={errors.imageUrl ? styles["input-error"] : ""}
              />
              {errors.imageUrl && <span className={styles["error-msg"]}>{errors.imageUrl}</span>}
            </div>
          </div>

          <div className={styles["preset-section"]}>
            <span className={styles["preset-label"]}>
              <PhotoLibraryIcon className={styles["preset-icon"]} /> Need testing art? Click a preset cover:
            </span>
            <div className={styles["preset-grid"]}>
              {PRESET_COVERS.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  className={styles["preset-card"]}
                  onClick={() => selectPreset(preset)}
                  title={`Use preset: ${preset.name}`}
                >
                  <img src={preset.url} alt={preset.name} />
                  <div>
                    <strong>{preset.name}</strong>
                    <span>{preset.artist}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className={styles["form-actions"]}>
            <button type="button" className={styles["cancel-btn"]} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles["submit-btn"]}>
              Submit Archive Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitModal;
