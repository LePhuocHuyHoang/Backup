import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function FavoriteItem({ book, handleRemoveBook }) {
  const [imgStr, setImgStr] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [displayedName, setDisplayedName] = useState("");
  const navigate = useNavigate(); // Initialize navigate

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    axios
      .get(
        "http://localhost:8098/file/getBookCoverList?bookIdList=" + book.book_id
      )
      .then((res) => {
        console.log(res.data.data[0]);
        setImgStr(res.data.data[0].book_cover);
      })
      .catch((err) => console.log(err));
    if (book.book_name.length > 30) {
      setDisplayedName(book.book_name.substring(0, 30) + "...");
    } else {
      setDisplayedName(book.book_name);
    }
  }, [book]);

  // Function to handle clicking on the book item
  const handleClick = () => {
    navigate(`/read/${book.book_id}`); // Navigate to the read book page
  };

  return (
    <div
      className="favorite-item"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick} // Add onClick event handler
    >
      <img src={"data:image/png;base64," + imgStr} alt="Image" />
      <p>{isHovered ? book.book_name : displayedName}</p>
      {handleRemoveBook && (
        <img
          src="/trash-bin.png"
          alt=""
          className="bin-icon"
          onClick={(e) => {
            e.stopPropagation(); // Prevent the click event from propagating to the parent div
            handleRemoveBook(book.book_id);
          }}
        />
      )}
      {!handleRemoveBook && <p>{book.rentalDate}</p>}
      {isHovered && (
        <div className="tooltip">
          <p>{book.book_name}</p>
        </div>
      )}
    </div>
  );
}

export default FavoriteItem;