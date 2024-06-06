import { useNavigate } from "react-router-dom";
import "../style/Login.css";
import Footer from "../ui/Footer";

function Login() {
  const navigate = useNavigate();
  return (
    <div className="register">
      <div className="heading">
        <div className="regis-head">
          <div className="regis-wrapper">
            <a onClick={() => navigate("/")} className="logo">
              <img className="logo-image" alt="logo" src="/images/logo.png" />
            </a>
            <h3 className="regis-title">Đăng nhập</h3>
          </div>

          <a href="/" className="regis-help">
            Bạn cần giúp đỡ?
          </a>
        </div>
      </div>

      <div className="regis-form">
        <form action="" method="POST" className="form" id="form-1">
          <h3 className="heading-form">Đăng nhập</h3>

          <div className="regis-span">
            Bạn chưa có tài khoản?
            <a href="/register" className="regis-span__login">
              Đăng ký
            </a>
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="search-form--input"
              placeholder="VD: email@domain.com"
            />
            <span className="form-message"></span>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Mật khẩu
            </label>
            <input
              type="password"
              className="search-form--input"
              placeholder="Nhập mật khẩu"
            />
            <span className="form-message"></span>
          </div>

          <button className="form-submit">Đăng nhập</button>

          <div className="regis-span">
            <a href="/forgot-pass" className="regis-span__login">
              Quên mật khẩu?
            </a>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default Login;
