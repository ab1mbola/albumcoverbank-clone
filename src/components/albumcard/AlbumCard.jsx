import styles from "./albumcard.module.css";

const AlbumCard = ({ title, album, images, name, artists }) => {
  return (
    <div className={styles["card-container"]}>
      <div className={styles.card}>
        <div className={styles["card-image"]}>
          <img src={images[0].url} alt="" />
        </div>
        <div className={styles["card-body"]}>
          <div className={styles.center}>
            <h4>{name}</h4>
            {/* <br /> */}
            <p>{artists[0].name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumCard;
