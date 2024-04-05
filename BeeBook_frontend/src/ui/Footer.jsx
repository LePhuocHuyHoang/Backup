import React from "react";
import "../style/Footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-md-6 footer-box">
            <div className="footer-logo">
              <img
                className="footer-logo--image"
                alt="logo"
                src="/images/logo.png"
              />
            </div>
            <p>
              Beebook là một nền tảng đặc biệt thiết kế để đáp ứng nhu cầu đọc
              sách của cộng đồng độc giả trực tuyến. Với sự đa dạng về thể loại
              và hàng ngàn tựa sách phong phú, Beebook mang đến trải nghiệm đọc
              sách độc đáo và thuận tiện.
            </p>
          </div>
          <div className="col-lg-3 col-md-6 pt-4">
            <div className="footer-box info">
              <h2 className="widget-title">Thành viên</h2>
              <ul>
                <li>Võ Quốc Tuấn</li>
                <li>Trương Quang Vinh</li>
                <li>Hồ Văn Quốc Huy</li>
                <li>Lê Tự Toàn</li>
                <li>Nguyễn Đăng Minh Quang</li>
                <li>Lê Công Lương</li>
                <li>Phạm Tấn Đạt</li>
                <li>Lê Phước Huy Hoàng</li>
              </ul>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 pt-4">
            <div className="footer-box pages">
              <h2 className="widget-title">Chăm Sóc Khách Hàng</h2>
              <ul>
                <li>
                  <a href="index.html">Hướng Dẫn Mua Hàng</a>
                </li>
                <li>
                  <a href="about.html">Chính Sách Đổi Trả</a>
                </li>
                <li>
                  <a href="services.html">Flash Sale</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 pt-4">
            <div className="footer-box subscribe">
              <h2 className="widget-title">Đăng Ký Nhận Tin</h2>
              <p>
                Đăng ký để nhận những tin tức khuyến mãi mới nhất của chúng tôi.
              </p>
              <form action="index.html">
                <input type="email" placeholder="Email" />
                <button type="submit">Gửi</button>
              </form>
            </div>
          </div>
        </div>

        <div className="row copyright text-center">
          <p>
            Copyrights © 2024 -{" "}
            <a href="https://imransdesign.com/">Võ Quốc Tuấn</a>, All Rights
            Reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
