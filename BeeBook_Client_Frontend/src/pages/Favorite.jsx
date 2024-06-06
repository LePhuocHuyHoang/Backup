import React, { useEffect, useRef, useState } from "react";
import "../style/Favorite.scss";
import axios from "axios";
import { useAuth } from "../auth/AuthProvider";
import FavoriteItem from "../ui/FavoriteItem";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const FavoritePage = () => {
  const [favBook, setFavBook] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const { token } = useAuth();
  const page = useRef(0);
  const navigate = useNavigate();
  const fetchData = () => {
    page.current += 1;
    axios
      .get(`http://localhost:8098/user/bookmark?page=${page.current}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        console.log("bookmark", res.data);
        if (res.data.length === 0) {
          setHasMore(false);
          return;
        }
        setFavBook([...favBook, ...res.data]);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          toast.error("Vui lòng đăng nhập!");
          navigate("/");
          return;
        }
      });
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleRemoveBook = (bookId) => {
    axios
      .delete(`http://localhost:8098/user/bookmark?bookId=${bookId}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        toast.success("Đã xóa khỏi danh sách yêu thích!");
        setFavBook(favBook.filter((book) => book.book_id !== bookId));
      });
  };
  return (
    <div className="favorite-ctn">
      <h2>Yêu thích</h2>
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
        {favBook.length === 0 && (
          <h4>Không có sách nào trong danh sách yêu thích</h4>
        )}
        {favBook.map((book) => (
          <FavoriteItem
            book={book}
            handleRemoveBook={handleRemoveBook}
            key={book.book_id}
          />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default FavoritePage;
