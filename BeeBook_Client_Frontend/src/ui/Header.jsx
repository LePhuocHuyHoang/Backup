import React, { useRef, useState } from "react";
import Button from "../ui/Button";
import "../style/Header.scss";
import { useNavigate } from "react-router-dom";
import HoverBookTypes from "./HoverBookTypes";
import HoverUser from "./HoverUser";

import Search from "./Search";
import { useAuth } from "../auth/AuthProvider";
const Header = () => {
  const navigate = useNavigate();
  const { handleLogin, handleLogout, token, userProfile } = useAuth();
  const inputRef = useRef();
  return (
    <div className="header">
      <a onClick={() => navigate("/")} className="logo">
        <img className="logo-image" alt="logo" src="/images/logo.png" />
      </a>
      {/* <HoverBookTypes /> */}
      <p>Tìm kiếm sách</p>
      <Search />
      {!token && (
        <div className="btns">
          <div onClick={handleLogin}>
            <Button variation="secondary">Đăng nhập</Button>
          </div>
          <div onClick={() => navigate("/register")}>
            <Button variation="primary">Đăng ký</Button>
          </div>
        </div>
      )}
      {token && (
        <HoverUser userProfile={userProfile} handleLogout={handleLogout} />
      )}
    </div>
  );
};

export default Header;
