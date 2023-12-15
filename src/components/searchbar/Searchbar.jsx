import styles from "./searchbar.module.css";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

const GENRES = ["Afrobeat", "Highlife", "Juju", "Afropop", "Reggae", "Jazz", "Hip-Hop", "R&B", "Pop", "Rock", "Electronic", "Soul", "Disco", "Folk"];
const ERAS = [
  { label: "1970s", query: "1970-1979" },
  { label: "1980s", query: "1980-1989" },
  { label: "1990s", query: "1990-1999" },
  { label: "2000s", query: "2000-2009" },
  { label: "2010s", query: "2010-2019" },
  { label: "2020s", query: "2020-2029" },
];

const Searchbar = ({ onSearch, loading }) => {
  const [searchInput, setSearchInput] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedEra, setSelectedEra] = useState("");

  const handleSearchTrigger = (queryText = searchInput, genre = selectedGenre, era = selectedEra) => {
    onSearch({
      query: queryText,
      genre: genre,
      era: era,
      reset: true,
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchTrigger();
    }
  };

  const selectGenre = (genre) => {
    const newVal = selectedGenre === genre ? "" : genre;
    setSelectedGenre(newVal);
    handleSearchTrigger(searchInput, newVal, selectedEra);
  };

  const selectEra = (eraVal) => {
    const newVal = selectedEra === eraVal ? "" : eraVal;
    setSelectedEra(newVal);
    handleSearchTrigger(searchInput, selectedGenre, newVal);
  };

  const clearAllFilters = () => {
    setSelectedGenre("");
    setSelectedEra("");
    setSearchInput("");
    onSearch({
      query: "",
      genre: "",
      era: "",
      reset: true,
    });
  };

  const hasActiveFilters = selectedGenre || selectedEra || searchInput;

  return (
    <div className={styles["searchbar-container"]}>
      <div className={styles.searchbar}>
        <SearchIcon className={styles["search-icon"]} />
        <input
          type="text"
          value={searchInput}
          placeholder="Search legendary album covers, artists, genres..."
          onKeyPress={handleKeyPress}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        {hasActiveFilters && (
          <button className={styles["clear-btn"]} onClick={clearAllFilters} title="Clear all search and filters">
            <CloseIcon />
          </button>
        )}
        <button
          className={`${styles["filter-toggle"]} ${showFilters || selectedGenre || selectedEra ? styles.active : ""}`}
          onClick={() => setShowFilters(!showFilters)}
          title="Toggle advanced filters"
        >
          <TuneIcon />
        </button>
      </div>

      {showFilters && (
        <div className={styles["filters-drawer"]}>
          <div className={styles["filter-section"]}>
            <span className={styles["section-title"]}>Select Era</span>
            <div className={styles["options-grid"]}>
              {ERAS.map((era) => (
                <button
                  key={era.label}
                  className={`${styles["filter-opt"]} ${selectedEra === era.query ? styles.selected : ""}`}
                  onClick={() => selectEra(era.query)}
                >
                  {era.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles["filter-section"]}>
            <span className={styles["section-title"]}>Select Genre</span>
            <div className={styles["options-grid"]}>
              {GENRES.map((genre) => (
                <button
                  key={genre}
                  className={`${styles["filter-opt"]} ${selectedGenre === genre ? styles.selected : ""}`}
                  onClick={() => selectGenre(genre)}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          <div className={styles["drawer-footer"]}>
            <button className={styles["reset-link"]} onClick={clearAllFilters}>
              Reset Filters
            </button>
            <button
              className={styles["apply-btn"]}
              onClick={() => {
                handleSearchTrigger();
                setShowFilters(false);
              }}
            >
              {loading ? "Searching..." : "Apply Filters"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Searchbar;
