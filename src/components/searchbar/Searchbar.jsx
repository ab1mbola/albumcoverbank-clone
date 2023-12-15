import styles from "./searchbar.module.css";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import { useEffect, useState } from "react";

const Searchbar = ({ accessToken, setAlbums }) => {
  const [searchInput, setSearchInput] = useState("");

  // search function
  async function search() {
    console.log("search for " + searchInput);

    // get request to get the artist id
    var searchParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };
    
    var artistId = await fetch(
      "https://api.spotify.com/v1/search?q=" + searchInput + "&type=artist",
      searchParameters
    )
      .then((response) => response.json())
      .then((data) => {
        return data.artists.items[0].id;
      });

      console.log("first artist id: " + artistId)

    // get request to get the albums of the artist
    var returnedAlbums = await fetch("https://api.spotify.com/v1/artists/" + artistId + "/albums?include_groups=album&market=US&limit=50", searchParameters)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setAlbums(data.items)
        // return data.items;
      });

    // display the album covers of the albums
  }

  return (
    <div className={styles["searchbar-container"]}>
      <div className={styles.searchbar}>
        <SearchIcon />
        <input
          type="text"
          name="search"
          placeholder="Search Albums, Artists & Designers"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              search();
            }
          }}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <TuneIcon className={styles.filter} />
      </div>
    </div>
  );
};

export default Searchbar;
