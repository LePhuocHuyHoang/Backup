import React from "react";
// import Tippy from '@tippyjs/react/headless';

import "../style/Navbar.css";
import Search from "../ui/Search";
import { useNavigate } from "react-router-dom";
import HoverBookTypes from "./HoverBookTypes";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className="rectangle">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 d-flex align-items-center justify-content-between">
            <a onClick={() => navigate("/")} className="logo">
              <img className="logo-image" alt="logo" src="/images/logo.png" />
            </a>

            <h5 className="category">
              <HoverBookTypes />
            </h5>
          </div>
          <div className="navbar-right col-lg-8 d-flex align-items-center justify-content-between">
            <Search />
            <div className="d-flex">
              <a className="custom-btn" onClick={() => navigate("/login")}>
                Đăng nhập
              </a>
              <a className="custom-btn" onClick={() => navigate("/register")}>
                Đăng ký
              </a>
            </div>
            {/*<Tippy
                            interactive={true}
                            placement="bottom-end"
                            render={(attrs) => <div className="user-box" tabIndex="-1" {...attrs}>
                                <div className = "user-box--heading">
                                    <div className='user-box--heading-title d-flex justify-content-between align-items-center'>
                                        <div className='d-flex flex-column'>
                                            <span>Tên người dùng</span>
                                            <span>Email</span>
                                        </div>
                                        <img src="/images/pen.png" alt="Point" />
                                    </div>
                                    
                                </div>
                                <div className='user-box--body'>
                                    <span className='span-header'>Điểm của tôi</span>
                                    <div className= 'd-flex justify-content-between align-items-center mt-4 mb-5'>
                                        <div className='point d-flex align-items-center'>
                                            <img src="/images/point.png" alt="Point" />
                                            <span>0</span>
                                        </div>
                                        <a href='nap-point' className='add-point'>
                                            <span>Nạp point</span>
                                            <img src="/images/wallet.png" alt="Wallet" />
                                        </a>
                                    </div>
                                </div>
                                <div className='user-box--footer d-flex flex-column mt-5"'>
                                    <a href='danh-sach-yeu-thich'>
                                        <img src="/images/image-25.png" alt="Wallet" />
                                        Danh sách yêu thích
                                    </a>
                                    <a href='da-mua'>
                                        <img src="/images/times.png" alt="Wallet" />
                                        Đã mua
                                    </a>
                                    <a href='dang-xuat'>
                                        <img src="/images/logout.png" alt="Wallet" />
                                        Đăng xuất       
                                    </a>

                                </div>
                            </div>}
                        >
                            <div className="nav-right--user d-flex align-items-center text-align-center">
                                <h5>Username 12345</h5>
                                <i className="fa-solid fa-user"></i>
                            </div>
                        </Tippy>
                        */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
