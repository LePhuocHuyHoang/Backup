import React, { useEffect, useRef, useState } from "react";
import "../style/Favorite.scss";
import axios from "axios";
import { useAuth } from "../auth/AuthProvider";
import RentedItem from "../ui/RentedItem";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const FavoritePage = () => {
  const [favBook, setFavBook] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [date, setDate] = useState(null); // Initial date is null
  const { token } = useAuth();
  const page = useRef(0);
  const navigate = useNavigate();

  const fetchData = () => {
    page.current += 1;

    // Construct the URL based on whether date is null
    let url = `http://localhost:8098/user/getRentedBook?page=${page.current}&limit=5`;
    if (date) {
      url += `&month=${date.split("-")[1]}&year=${date.split("-")[0]}`;
    }

    axios
      .get(url, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        console.log("rentedbook", res.data);
        if (res.data.length === 0) {
          setHasMore(false);
          return;
        }
        setFavBook((prevFavBooks) => [...prevFavBooks, ...res.data]);
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          toast.error("Vui lòng đăng nhập!");
          navigate("/");
          return;
        }
        toast.error("Couldn't load data. Please try again!");
      });
  };

  useEffect(() => {
    page.current = 0;
    setFavBook([]);
    setHasMore(true);
    fetchData();
  }, [date, token]); // Re-fetch data when date or token changes

  return (
    <div className="favorite-ctn">
      <h2>Sách đã mua</h2>
      <input
        type="month"
        id="start"
        name="start"
        value={date ? date : ""} // Handle null date
        onChange={(e) => setDate(e.target.value)}
      />
      <InfiniteScroll
        dataLength={favBook.length} // This is an important field to render the next data
        next={fetchData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        className="book-ctn"
      >
        {favBook.length === 0 && <h4>Chưa có sách nào được mua</h4>}
        {favBook.map((book, index) => (
          <RentedItem key={index} book={book} />
        ))}
      </InfiniteScroll>
      s
    </div>
  );
};

export default FavoritePage;
