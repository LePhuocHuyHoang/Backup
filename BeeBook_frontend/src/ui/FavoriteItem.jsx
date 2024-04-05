import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function FavoriteItem({ book, handleRemoveBook }) {
  const [imgStr, setImgStr] = useState("");
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
  }, [book]);

  return (
    <div className="favorite-item">
      <img src={"data:image/png;base64," + imgStr} alt="Image" />
      <p>{book.book_name}</p>
      {handleRemoveBook && (
        <img
          src="/trash-bin.png"
          alt=""
          className="bin-icon"
          onClick={() => handleRemoveBook(book.book_id)}
        />
      )}
      {!handleRemoveBook && <p>{book.rentalDate}</p>}
    </div>
  );
}

export default FavoriteItem;
