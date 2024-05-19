import { useEffect, useRef, useState } from "react";
import RateBook from "../ui/RateBook";
import "../style/ReadBook.scss";
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";
import { Comment } from "react-loader-spinner";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import InfiniteScroll from "react-infinite-scroll-component";
import { has } from "lodash";
const ReadBook = () => {
  const [showHeaderFooter, setShowHeaderFooter] = useState(true);
  const [imagesBase64, setImagesBase64] = useState([]);
  const [comments, setComments] = useState([]);
  const [hasMoreImages, setHasMoreImages] = useState(true);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [book, setBook] = useState({});
  const [avgRating, setAvgRating] = useState(0);
  const [commentInput, setCommentInput] = useState("");
  const pageBook = useRef(0);
  const pageComment = useRef(0);
  const navigate = useNavigate();
  const { token, userProfile } = useAuth();
  const { bookId } = useParams();
  const [showComments, setShowComments] = useState(false);
  const handleSaveBook = () => {
    if (!token) {
      toast.info("Vui lòng đăng nhập!");
      handleLogin();
      return;
    }
    console.log(book);
    axios
      .post(
        "http://localhost:8098/user/bookmark?bookId=" + book.id,
        { test: "test" },
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res);
        toast.success("Đã lưu vào danh sách yêu thích!");
        //navigate("/read/"+bookId);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 409) {
          toast.warning("Sách đã tồn tại trong danh sách yêu thích.");
          return;
        }
        toast.error("Có lỗi xảy ra vui lòng thử lại sau!");
      });
  };
  const fetchComments = () => {
    pageComment.current += 1;
    axios
      .get(
        `http://localhost:8098/book/getComments?bookId=${bookId}&page=${pageComment.current}&limit=5`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((res) => {
        console.log("comments", [...comments, ...res.data]);
        if (res.data.length == 0) {
          setHasMoreComments(false);
          return;
        }
        setComments([...comments, ...res.data]);
      })
      .catch((err) => {
        console.log(err.response);
        // if (err.response.status == 401) {
        //   toast.error("Vui lòng đăng nhập!");
        //   navigate("/");
        //   return;
        // }
      });
  };
  useEffect(() => fetchComments(), [token, bookId]);
  useEffect(() => {
    axios
      .get(`http://localhost:8098/book/getBook?bookId=${bookId}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        console.log("book", res.data);
        if (!res.data.bought) {
          navigate("/book/" + bookId);
          toast.info("Bạn chưa mua sách này!");
          return;
        }
        setBook(res.data.book);
        setAvgRating(res.data.avg);
      })
      .catch((err) => {
        console.log(err.response);
        if (err.response.status == 401) {
          toast.error("Vui lòng đăng nhập!");
          navigate("/");
          return;
        }
      });
    return;
  }, [token]);
  const fetchImages = () => {
    pageBook.current += 1;
    console.log("token", token, bookId);
    axios
      .get(
        "http://localhost:8098/file/readFileToImagePages?bookId=" +
          bookId +
          "&page=" +
          pageBook.current,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((res) => {
        console.log(res.data.data.map((img) => Object.values(img)[0]));
        const newData = res.data.data.map((img) => Object.values(img)[0]);
        if (newData.length == 0) setHasMoreImages(false);
        setImagesBase64([...imagesBase64, ...newData]);
      })
      .catch((err) => {
        console.log(err);
        // if (err.response.status === 401) {
        //   toast.error("Vui lòng đăng nhập!");
        //   navigate("/");
        //   return;
        // }
        toast.error("Couldn't load data. Please try again!");
      });
  };
  useEffect(fetchImages, [bookId, token]);
  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (!showHeaderFooter) return;
  //     //  console.log("Toggling Header/Footer...");
  //     setShowHeaderFooter(false);
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  const toggleHeaderFooter = () => {
    setShowHeaderFooter(!showHeaderFooter);
  };
  const handleRateBook = (rate) => {
    if (token) {
      axios
        .post(
          `http://localhost:8098/book/ratingBook?bookId=${bookId}&rating=${rate}
`,
          {},
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )
        .then((res) => {
          toast.success("Đánh giá sách thành công!");
        });
      return;
    }
  };
  return (
    <div className="read-book-ctn">
      <div
        className={`read-header  ${!showHeaderFooter ? "header-hidden" : ""}`}
      >
        <img
          src="/images/logo.png"
          alt="logo"
          id="logo"
          onClick={() => {
            navigate("/");
            window.scrollTo(0, 0);
          }}
        />
        <h2>{book.name}</h2>
        <div className="rating">
          <p>Đánh giá:</p>
          <RateBook isReadOnly={false} handleRateBook={handleRateBook} />
          <Tooltip title="Thêm vào danh sách yêu thích" arrow>
            <img
              src="/liked-icon.png"
              alt="like icon"
              onClick={handleSaveBook}
            />
          </Tooltip>
        </div>
      </div>
      <div className="book-content" onClick={toggleHeaderFooter}>
        <InfiniteScroll
          dataLength={imagesBase64.length} //This is important field to render the next data
          next={fetchImages}
          hasMore={hasMoreImages}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
          // below props only if you need pull down functionality
          // refreshFunction={this.refresh}
          // pullDownToRefresh
          // pullDownToRefreshThreshold={50}
          // pullDownToRefreshContent={
          //   <h3 style={{ textAlign: "center" }}>
          //     &#8595; Pull down to refresh
          //   </h3>
          // }
          // releaseToRefreshContent={
          //   <h3 style={{ textAlign: "center" }}>&#8593; Release to refresh</h3>
          // }
          className="infinite-img"
        >
          {imagesBase64.map((img, index) => (
            <>
              <img
                key={index}
                // src={"data:image/png;base64," + img}
                alt=""
                style={{
                  backgroundImage: ` url("data:image/png;base64,${img}"`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  width: "794px",
                  height: "1123px",
                }}
                id={`bg-img-${index}`}
              />
            </>
          ))}
        </InfiniteScroll>
      </div>
      <div
        className={`read-footer  ${!showHeaderFooter ? "footer-hidden" : ""}`}
      >
        <div onClick={() => setShowComments((pre) => !pre)}>
          <img src="/comments.png" alt="comment-icon" />
        </div>
      </div>
      {showHeaderFooter && (
        <div className="scroll-icon" onClick={() => window.scrollTo(0, 0)}>
          <img src="/up-arrow.png" alt="" />
        </div>
      )}

      {showComments && showHeaderFooter && (
        <div className="comment-ctn">
          <h2>Bình luận</h2>

          <div className="comment-list" id="comment-list">
            {comments.map((cm, index) => (
              <div key={index} className="comment-item">
                <h4>{cm.user_name}</h4>
                <Tooltip title={cm.created_at} placement="right">
                  <p>{cm.comment}</p>
                </Tooltip>
              </div>
            ))}
            {hasMoreComments && (
              <div className="load-more" onClick={fetchComments}>
                <p>Load more</p>
              </div>
            )}
          </div>

          <input
            type="text"
            name=""
            id=""
            maxLength={500}
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                axios
                  .post(
                    `http://localhost:8098/book/commentBook?bookId=${bookId}&comment=${commentInput}`,
                    {},
                    {
                      headers: {
                        Authorization: "Bearer " + token,
                      },
                    }
                  )
                  .then((res) => {
                    toast.success("Bình luận thành công!");
                    setCommentInput("");
                    setComments([
                      {
                        user_name: userProfile.userName,
                        comment: commentInput,
                      },
                      ...comments,
                    ]);
                  });
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ReadBook;
