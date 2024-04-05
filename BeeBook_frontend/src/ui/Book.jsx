import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Book = ({ book, key }) => {
  const navigate = useNavigate();
  const [imgStr, setImgStr] = useState("");
  useEffect(() => {
    axios
      .get(
        "http://localhost:8098/file/getBookCoverList?bookIdList=" + book.book_id
      )
      .then((res) => {
        setImgStr(res.data.data[0].book_cover);
      })
      .catch((err) => console.log(err));
  }, [book]);
  return (
    <div
      className="col-lg-2 col-md-4 col-sm-6"
      onClick={() => navigate(`/book/${book.book_id}`)}
      key={key}
    >
      <div className="product-image">
        <a>
          <img
            className="img-fluid"
            alt="Banner"
            src={"data:image/png;base64," + imgStr}
          />
        </a>
      </div>
      <div className="new-product--namebook">{book.book_name}</div>
    </div>
  );
};

export default Book;
