import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Banner from "../ui/Banner";
import "../style/HomePage.css";
import { useEffect, useState } from "react";
import Book from "../ui/Book";
import TopBook from "../ui/TopBook";

import { useAuth } from "../auth/AuthProvider";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";
function HomePage() {
  const [newBooks, setNewBooks] = useState([]);
  const [newBookImgs, setNewBookImgs] = useState([]);
  const [featuredBooks, setfeaturedBooks] = useState([]);
  const [topBooks, setTopBooks] = useState([]);
  const [hotBooks, setHotBooks] = useState("");
  const navigate = useNavigate();
  const SERVER_DOMAIN = "http://localhost:8098";
  const { token, handleLogin, handleLogout } = useAuth();
  useEffect(() => {
    axios.get(SERVER_DOMAIN + "/book/newbooks", {}).then((res) => {
      setNewBooks(res.data);
    });
  }, []);
  useEffect(() => {
    axios
      .get(
        "http://localhost:8098/file/getBookCoverList?bookIdList=" +
          topBooks[0]?.id
      )
      .then((res) => {
        setHotBooks(res.data.data[0].background_cover);
      })
      .catch((err) => console.log(err));
  }, [topBooks]);
  useEffect(() => {
    axios
      .get(SERVER_DOMAIN + "/book/featured?top=12", {})
      .then((res) => {
        setfeaturedBooks(res.data);
      })
      .catch((res) => console.log(res));
  }, []);
  useEffect(() => {
    axios
      .get(SERVER_DOMAIN + "/book/top-rental-books", {})
      .then((res) => {
        setTopBooks(res.data);
      })
      .catch((res) => console.log(res));
  }, []);

  return (
    <div>
      <div className="home-content">
        <div className="container">
          <Banner />
          {/*Sách mới - thuê ngay */}
          <div className="row">
            <div className="component d-flex justify-content-between">
              <div className="component-left align-items-center d-flex">
                <div className="component-left--rectangle" />
                <p className="component-left--title">Sách mới - Thuê ngay</p>
              </div>
              <div className="component-right d-flex align-items-center">
                <div className="component-right--textleft">&lt;</div>
                <div className="component-right--textright">&gt;</div>
              </div>
            </div>
          </div>
          <div className="row">
            {newBooks.map((book, i) => (
              <Book key={i} book={book} />
            ))}
          </div>
          {/*End sách mới - thuê ngay */}

          {/*Nổi bật */}
          <div className="row">
            <div className="component d-flex justify-content-between">
              <div className="component-left align-items-center d-flex">
                <div className="component-left--rectangle" />
                <p className="component-left--title">Nổi bật</p>
              </div>
              <div className="component-right d-flex align-items-center">
                <div className="component-right--textleft">&lt;</div>
                <div className="component-right--textright">&gt;</div>
              </div>
            </div>
          </div>
          <div className="row">
            {featuredBooks.map((book, i) => (
              <Book key={i} book={book} />
            ))}
          </div>
          {/*End nổi bật */}
          <div className="row">
            <div className="comdponent d-flex justify-content-between">
              <div className="component-left align-items-center d-flex">
                <div className="component-left--rectangle" />
                <p className="component-left--title">🎉Sách đang hot 🔥</p>
              </div>
            </div>
          </div>
          <div className="sale-box d-flex">
            <div className="sale-box--left">
              <img
                className="img-fluid"
                alt="Banner"
                style={{ minWidth: "50rem" }}
                src={"data:image/png;base64," + hotBooks}
              />
            </div>
            <div className="sale-box--right">
              <div className="sale-box--right-text">
                <h5>{topBooks[0]?.name}</h5>
                <p>{topBooks[0]?.types.map((type) => type.name).join(",")}</p>
                <p>{topBooks[0]?.introduce}</p>
              </div>
              <div className="sale-box--right-button d-flex">
                <Button onClick={() => navigate("/book/" + topBooks[0]?.id)}>
                  <p className="fs-2">Đọc ngay</p>
                </Button>
              </div>
            </div>
          </div>
          {/*Bảng xếp hạng*/}
          <div className="row">
            <div className="component d-flex justify-content-between">
              <div className="component-left align-items-center d-flex">
                <div className="component-left--rectangle" />
                <p className="component-left--title">Bảng xếp hạng</p>
              </div>
              <div className="component-right d-flex align-items-center">
                <div className="component-right--textleft">&lt;</div>
                <div className="component-right--textright">&gt;</div>
              </div>
            </div>
          </div>

          <div className="row">
            {topBooks.map((book, index) => (
              <TopBook key={book.id} index={index} book={book} />
            ))}
          </div>
          {/*End bảng xếp hạng*/}

          {/*Ưu đãi cực cháy*/}

          {/*End ưu đãi cực cháy*/}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
