import styles from "./albumcard.module.css";

const AlbumCard = ({
  name,
  artists,
  images,
  artist,
  imageUrl,
  designer,
  year,
  isSubmitted,
  onClick,
}) => {
  const displayImage = images && images[0] ? images[0].url : (imageUrl || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&auto=format&fit=crop");
  const displayArtist = artists && artists[0] ? artists[0].name : (artist || "Unknown Artist");
  const displayName = name || "Untitled Album";
  const displayDesigner = designer || "";
  const displayYear = year || (artists && artists[0] ? "" : "");

  return (
    <div className={styles["card-container"]} onClick={onClick}>
      <div className={styles.card}>
        <div className={styles["card-image"]}>
          <img src={displayImage} alt={displayName} loading="lazy" />
          {isSubmitted && <span className={styles["badge-submitted"]}>Community</span>}
        </div>
        <div className={styles["card-overlay"]}>
          <div className={styles["card-details"]}>
            {displayYear && <span className={styles["card-year"]}>{displayYear}</span>}
            <h4 className={styles["card-title"]}>{displayName}</h4>
            <p className={styles["card-artist"]}>by {displayArtist}</p>
            {displayDesigner && (
              <p className={styles["card-designer"]}>
                Design: <span>{displayDesigner}</span>
              </p>
            )}
            <span className={styles["card-cta"]}>View Cover Details</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumCard;
