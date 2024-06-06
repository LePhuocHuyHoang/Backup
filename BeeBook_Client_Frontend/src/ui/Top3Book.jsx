import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Top3Book = ({ book, index }) => {
  const [imgStr, setImgStr] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:8098/file/getBookCoverList?bookIdList=" + book.id)
      .then((res) => {
        console.log(res.data.data[0]);
        setImgStr(res.data.data[0].background_cover);
      })
      .catch((err) => console.log(err));
  }, [book]);
  return (
    <div
      className={`carousel-item ${index == 0 ? "active" : ""}`}
      onClick={() => navigate("/book/" + book.id)}
    >
      <img
        src={"data:image/png;base64," + imgStr}
        className="d-block w-100 opacity-50"
        alt="..."
      />
      <div className="carousel-caption d-none d-md-block ">
        <h1 className="display-1 fw-bold text-light">{book.name}</h1>
        <h2 className="display-5 text-light">{book.introduce}</h2>
        <h2 className="display-6 text-light">
          {book?.types?.map((type) => type.name).join(",")}
        </h2>
      </div>
    </div>
  );
};
export default Top3Book;
