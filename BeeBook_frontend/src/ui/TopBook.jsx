import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TopBook = ({ book, index }) => {
  const [imgStr, setImgStr] = useState("");
  const navigate = useNavigate();
  console;
  useEffect(() => {
    axios
      .get("http://localhost:8098/file/getBookCoverList?bookIdList=" + book.id)
      .then((res) => {
        setImgStr(res.data.data[0].book_cover);
      })
      .catch((err) => console.log(err));
  }, [book]);
  let rankStr = "";
  switch (index) {
    case 0:
      rankStr = "rank-one";
      break;
    case 1:
      rankStr = "rank-two";
      break;
    case 2:
      rankStr = "rank-three";
      break;
    case 3:
      rankStr = "rank-four";
      break;
    case 4:
      rankStr = "rank-five";
      break;
    default:
      rankStr = "sub-rank";
  }
  return (
    <div
      className="col-lg-3 col-md-4 col-sm-6"
      key={index}
      onClick={() => navigate("/book/" + book.id)}
    >
      <div className="bxh-box d-flex align-items-center mb-4">
        <div className="bxh-box--left p-5">
          <div className={`bxh-box--left-title ${rankStr}`}>#{index + 1}</div>
        </div>
        <div className="bxh-box--right d-flex align-items-center text-center">
          <div className="bxh-box--right-image">
            <img
              className="img-fluid"
              alt="Banner"
              src={"data:image/png;base64," + imgStr}
            />
          </div>
          <div className="d-flex flex-column text-white px-2">
            <h5>{book.name}</h5>
            <p>{book.types.map((type) => type.name).join(",")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBook;
