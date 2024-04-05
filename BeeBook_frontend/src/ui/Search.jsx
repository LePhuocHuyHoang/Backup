import React, { useEffect, useRef, useState } from "react";
import "../style/Search.scss";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const SERVER_DOMAIN = "http://localhost:8098";
  const navigate = useNavigate();

  const searchContainerRef = useRef();
  const delayedSearch = debounce((term) => {
    // Thực hiện tìm kiếm ở đây, có thể gọi API hoặc thực hiện logic tìm kiếm khác

    axios
      .get(SERVER_DOMAIN + "/book/search?keyword=" + searchTerm)
      .then((res) => {
        console.log(res.data);
        setSearchResult(res.data);
      });

    setSearchPerformed(true);
  }, 500); // Thời gian chờ debounce, ở đây là 500ms

  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    if (term.trim() == "") return;

    setSearchPerformed(false); // Đặt cờ là false khi người dùng thay đổi ô tìm kiếm

    // Gọi hàm tìm kiếm với debounce
    delayedSearch(searchTerm);
  };
  const handleClickOutside = (event) => {
    if (
      searchContainerRef.current &&
      !searchContainerRef.current.contains(event.target)
    ) {
      setIsFocused(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="search-ctn">
      <input
        type="text"
        name="search"
        id="search-input"
        onChange={handleSearchChange}
        onFocus={() => setIsFocused(true)}
      />
      {isFocused &&
        searchPerformed &&
        searchResult.length === 0 &&
        searchTerm != "" && (
          <ul className="search-result" ref={searchContainerRef}>
            <li>No results found</li>
          </ul>
        )}
      {/* Hiển thị kết quả tìm kiếm */}
      {isFocused &&
        searchPerformed &&
        searchResult.length > 0 &&
        searchTerm != "" && (
          <ul className="search-result" ref={searchContainerRef}>
            {searchResult.map((res) => (
              <li
                key={res.id}
                onClick={() => {
                  navigate("/book/" + res.id);
                  setIsFocused(false);
                  setSearchTerm(res.name);
                }}
              >
                {res.name}
              </li>
            ))}
          </ul>
        )}
    </div>
  );
};

export default Search;
