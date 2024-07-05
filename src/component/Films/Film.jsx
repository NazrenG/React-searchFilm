import { useState, useMemo } from "react";
import "./style.css";
import axios from "axios";
import * as basicLightbox from "basiclightbox";
import "basiclightbox/dist/basicLightbox.min.css";
import { FaClipboardList } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";

function FilmComponent() {
  const [list, setList] = useState([]);
  const [favList, setFavList] = useState([]);
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const yearNum = Number(year);
    let yearParam = "";
    if (year) {
      if (
        yearNum != null &&
        yearNum > 1800 &&
        yearNum < new Date().getFullYear()
      ) {
        yearParam = year ? `&y=${year}` : "";
      } else {
        alert("Please enter a valid year between 1800 and the current year.");
        return;
      }
    }

    const response = await axios.get(
      `https://www.omdbapi.com/?s=${query}${yearParam}&apikey=12c2927b`
    );
    if (response.data.Search) {
      setList(response.data.Search);
    } else {
      setList([]);
    }
  };
  const memoizedFavList = useMemo(() => favList, [favList]);

  const showFavList = () => {
    const instance = basicLightbox.create(`
      <div class="modal">
        <h2 style={{color:"white"}}>Favorites</h2>
        <ul class="fav-list">
          ${memoizedFavList
            .map(
              (item) => `
            <li>
              <p>${item.Title} (${item.Year})</p>
            </li>
          `
            )
            .join("")}
        </ul>
        <button class="close-btn">Close</button>
      </div>
    `);

    instance.show();

    document.querySelector(".close-btn").onclick = instance.close;
  };

  return (
    <div className="FilmDiv">
      <header className="Searchbar">
        <form className="SearchForm" onSubmit={handleSubmit}>
          <button type="submit" className="button">
            <CiSearch />
            <span className="label">Search</span>
          </button>
          <input
            className="input"
            type="text"
            placeholder="Search movies"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
        </form>
        <input
          type="text"
          placeholder="Year"
          className="inputYear"
          value={year}
          onChange={(e) => {
            setYear(e.target.value);
          }}
        />
        <button className="showList" onClick={showFavList}>
          <FaClipboardList className="listIcon" />
        </button>
        <div className="countList">{favList.length}</div>
      </header>
      <ul className="ImageGallery">
        {list.map((item) => (
          <li key={item.imdbID} className="ImageGalleryItem">
            <img className="image" src={item.Poster} alt={item.Title} />
            <div className="description">
              <p>
                {item.Title} ({item.Year})
              </p>
              <button
                className="addFav"
                onClick={() => {
                  setFavList((prevList) => [...prevList, item]);
                }}
              >
                Add to Favorites
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FilmComponent;
