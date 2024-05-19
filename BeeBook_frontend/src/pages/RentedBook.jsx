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
  const [date, setDate] = useState("2024-03");
  const { token, handleLogin } = useAuth();
  const page = useRef(0);
  const navigate = useNavigate();
  const fetchData = () => {
    page.current += 1;
    axios
      .get(
        `http://localhost:8098/user/getRentedBook?month=${date.split("-")[1]}&year=${date.split("-")[0]}&page=${page.current}&limit=5`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then((res) => {
        console.log("bookmark", res.data);
        if (res.data.length === 0) {
          setHasMore(false);
          return;
        }
        setFavBook([...favBook, ...res.data]);
      })
      .catch((res) => console.log(res));
  };

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    axios
      .get(
        `http://localhost:8098/user/getRentedBook?month=${date.split("-")[1]}&year=${date.split("-")[0]}&page=${page.current}&limit=5`,
        {
          headers: { Authorization: "Bearer " + token },
        }
      )
      .then((res) => {
        console.log("bookmark", res.data);
        setFavBook(res.data);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          toast.error("Vui lòng đăng nhập!");
          navigate("/");
          return;
        }
      });
  }, [date]);
  return (
    <div className="favorite-ctn">
      <h2>Sách đã mua</h2>
      <input
        type="month"
        id="start"
        name="start"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <InfiniteScroll
        dataLength={favBook.length} //This is important field to render the next data
        next={fetchData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        // endMessage={
        //   <p style={{ textAlign: "center" }}>
        //     <h4>Yay! You have seen it all</h4>
        //   </p>
        // }
        // below props only if you need pull down functionality
        className="book-ctn"
      >
        {favBook.length === 0 && <h4>Chưa có sách nào được mua</h4>}
        {favBook.map((book) => (
          <RentedItem book={book} />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default FavoritePage;
